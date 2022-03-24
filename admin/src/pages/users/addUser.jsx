import { useState } from "react";
import {
  FormGroup,
  FormControl,
  InputLabel,
  Input,
  Button,
  makeStyles,
  Typography,
  Select,
  MenuItem,
} from "@material-ui/core";
import { addUser } from "../../controllers/users";
import { useHistory } from "react-router-dom";

const initialValue = {
  username: "",
  role: "",
};

const useStyles = makeStyles({
  container: {
    width: "50%",
    margin: "5% 0 0 25%",
    "& > *": {
      marginTop: 20,
    },
  },
});

const AddUser = () => {
  const [user, setUser] = useState(initialValue);
  const { username, role } = user;
  const classes = useStyles();
  let history = useHistory();

  const onValueChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const Add = async () => {
    await addUser(user);
    history.push("./");
  };

  return (
    <FormGroup className={classes.container}>
      <Typography variant="h4">Add User</Typography>
      <FormControl>
        <InputLabel htmlFor="my-input">Username</InputLabel>
        <Input
          onChange={(e) => onValueChange(e)}
          name="username"
          value={username}
          id="my-input"
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">Role</InputLabel>
        <Select
          onChange={(e) => onValueChange(e)}
          name="role"
          value={role}
          id="my-input"
        >
        <MenuItem value={"user"}>User</MenuItem>
        <MenuItem value={"admin"}>Admin</MenuItem>
        </Select>
      </FormControl>

      <FormControl>
        <Button variant="contained" color="primary" onClick={() => Add()}>
          Add User
        </Button>
      </FormControl>
    </FormGroup>
  );
};

export default AddUser;
