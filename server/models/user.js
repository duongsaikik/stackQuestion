const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
  email:{type: String , require: true},
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  score: { type: Number, default: 0 },
  questionsMount: { type: Number, default: 0 },
    answersMount: { type: Number, default: 0 },
  profilePhoto: {
    type: String,
    default: function () {
      return `https://secure.gravatar.com/avatar/${this._id}?s=90&d=identicon`;
    }
  },
  created: { type: Date, default: Date.now },
  ban:{type: Boolean, default:false}
});

userModel.set('toJSON', { getters: true });
userModel.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj._id;
  delete obj.__v;
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userModel);
