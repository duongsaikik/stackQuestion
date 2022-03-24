const User = require('../models/user');
const jwtDecode = require('jwt-decode');
const nodeMailer = require("nodemailer");
const { body, validationResult } = require('express-validator');

const { createToken, hashPassword, verifyPassword } = require('../utils/authentication');
const fullTextSearch = require('fulltextsearch');
var fullTextSearchVi = fullTextSearch.vi;

const getPagination = (page, size, data) => {
  const start = page ? + (page - 1) * size : 0;
  const end = size ? page * size : 10;
  const dataInPer = data.slice(start, end);
  const pagePer = Math.ceil(data.length / size);
  return { dataInPer, pagePer };
};
exports.sendMail = (req, res) => {
  //guesswhoisthis111222@gmail.com
  const adminEmail = "dinhhaiduongsoma@gmail.com";
  const adminPassword = "sotuxeeusstaossp";
  const mailHost = "smtp.gmail.com";
  const { email, subject, htmlContent } = req.body;

  const mailPort = 25;

  const transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false,
    auth: {
      user: adminEmail,
      pass: adminPassword,
    },
    tls: {
      rejectUnauthorized: false
    }

  });

  const options = {
    from: adminEmail,
    to: email,
    subject: subject,
    html: htmlContent,
  };
  console.log(options)

  transporter.sendMail(options, function (err, data) {
    if (err) {
      console.log(err)
    } else {
      res.send({
        message: "Mã đã được gửi vui lòng vào mail để xác nhận",
      });
      console.log("mail has sent")
    }

  })
  /*  return transporter.sendMail(options); */
};
exports.signup = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }

  try {
    const { username } = req.body;

    const userData = {
      username: username.toLowerCase()
    };

    const existingUsername = await User.findOne({
      username: userData.username
    });

    if (existingUsername) {
      return res.status(400).json({
        message: 'Username already exists.'
      });
    }
    if (req.body.email) {
      const existingEmail = await User.findOne({
        email: req.body.email
      });
      if (existingEmail) {
        return res.status(400).json({
          message: 'Email already exists.'
        });
      } else {
        userData.email = req.body.email;
      }
    }
    if (req.body.role) userData.role = req.body.role;
    if (req.body.password) {
      const hashedPassword = await hashPassword(req.body.password);
      userData.password = hashedPassword;
    } else {
      const hashedPassword = await hashPassword('abc@123');
      userData.password = hashedPassword;
    }
    // const { username, email } = req.body;
    // const hashedPassword = await hashPassword(req.body.password);

    // const userData = {
    //   email: email,
    //   username: username.toLowerCase(),
    //   password: hashedPassword,
    //   email: email
    // };
    // const existingEmail = await User.findOne({
    //   email: userData.email
    // });
    // const existingUsername = await User.findOne({
    //   username: userData.username
    // });

    // if (existingEmail) {
    //   return res.status(400).json({
    //     message: 'Email already exists.'
    //   });
    // }

    // if (existingUsername) {
    //   return res.status(400).json({
    //     message: 'Username already exists.'
    //   });
    // }else if(existingEmail){
    //   return res.status(400).json({
    //     message: 'Email already exists.'
    //   });
    // }

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    if (savedUser) {
      const token = createToken(savedUser);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      const { username, role, email, id, created, profilePhoto } = savedUser;
      const userInfo = {
        username,
        role,
        email,
        id,
        created,
        profilePhoto
      };

      return res.json({
        message: 'User created!',
        token,
        userInfo,
        expiresAt
      });
    } else {
      return res.status(400).json({
        message: 'There was a problem creating your account.'
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: 'There was a problem creating your account.'
    });
  }
};

exports.authenticate = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      username: username.toLowerCase()
    });

    if (!user) {
      return res.status(403).json({
        message: 'Wrong username or password.'
      });
    }

    const passwordValid = await verifyPassword(password, user.password);

    if (passwordValid) {
      const token = createToken(user);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;
      const { username, role, id, created, profilePhoto } = user;
      const userInfo = { username, role, id, created, profilePhoto };

      res.json({
        message: 'Authentication successful!',
        token,
        userInfo,
        expiresAt
      });
    } else {
      res.status(403).json({
        message: 'Wrong username or password.'
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.'
    });
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const { sortType = '-created' } = req.body;
    const users = await User.find().sort(sortType);
    const { page, size } = req.query;

    const { dataInPer, pagePer } = getPagination(page, size, users);
    res.json({
      currentPage: Number(page),
      pageNum: pagePer,
      user: dataInPer
    });
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const users = await User.find({ username: { $regex: req.params.search, $options: 'i' } });
    const { page, size } = req.query;
    const { dataInPer, pagePer } = getPagination(page, size, users);
    res.json({
      currentPage: Number(page),
      pageNum: pagePer,
      user: dataInPer
    });
  } catch (error) {
    next(error);
  }
};

exports.find = async (req, res, next) => {
  try {
    const { username, email } = req.query;


    if (username) {
      const users = await User.findOne({ username: username });
      res.json(users);

    } else if (email) {
      const users = await User.findOne({ email: email });

      /*   const {email, username, role, _id, created, profilePhoto } = users;   */

      const userInfo = {
        email: users.email,
        username: users.username,
        role: users.role,
        id: users.id,
        created: users.created,
        profilePhoto: users.profilePhoto
      };

      res.json({ userInfo });
    }

  } catch (error) {
    next(error);
  }
};
exports.upDatePassword = async (req, res, next) => {
  try {
    const { id, newPassword } = req.body;
    const hashedPassword = await hashPassword(newPassword);

    console.log(hashedPassword)
    const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { upsert: true })

    console.log(user)
    if (user) {
      const token = createToken(user);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;
      const { email, username, role, _id, created, profilePhoto } = user;

      const userInfo = {
        email: email,
        username: username,
        role: role,
        id: id,
        created: created,
        profilePhoto: profilePhoto
      };

      return res.json({
        message: 'User updated!',
        token,
        userInfo,
        expiresAt
      });
    } else {
      return res.status(400).json({
        message: 'There was a problem updating your account.'
      });
    }




  } catch (error) {
    next(error);
  }
};

exports.validateUser = [
  body('username')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ max: 16 })
    .withMessage('must be at most 16 characters long')

    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('contains invalid characters'),

  body('password')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ min: 6 })
    .withMessage('must be at least 6 characters long')

    .isLength({ max: 50 })
    .withMessage('must be at most 50 characters long')
];
exports.editUser = async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.params.username });
    user.role = req.body.role;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    await User.deleteOne({ _id: user._id });
    res.json('Delete User Successfully');
  } catch (error) {
    next(error);
  }
};
exports.getUsersOfCurrentPage = async (req, res) => {
  const PAGE_SIZE = 5;
  const page = parseInt(req.query.page || '0');
  const sort = req.query.sort || '';
  var filterUsername = {};
  var filterEmail = {};
  try {
    if (req.query.search) {
      const search = req.query.search;
      filterUsername.username = new RegExp(fullTextSearchVi(search), 'i');
      filterEmail.email = new RegExp(fullTextSearchVi(search), 'i');
    } 
    var users = await User.find({ $or: [filterUsername, filterEmail] });
    const total = users.length;
    // while(Math.ceil(total / PAGE_SIZE)<=page){
    //   page--;
    // }
    console.log(page);
    users = await User.find({ $or: [filterUsername, filterEmail] })
      .sort(sort)
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);

    res.status(200).json({ totalPages: Math.ceil(total / PAGE_SIZE), users });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
