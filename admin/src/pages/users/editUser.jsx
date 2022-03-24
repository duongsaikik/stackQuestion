import { useState, useEffect } from "react";
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

import { useHistory, useParams } from "react-router-dom";
import { getUserByUsername, editUser } from "../../controllers/users";
import { set } from "lodash";

const initialValue = {
  username: "",
  email:"",
  role: "",
  ban:false
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

const EditUser = () => {
  const [user, setUser] = useState(initialValue);
  const { username, role, email, ban } = user;
  const { id } = useParams();
  const classes = useStyles();
  let history = useHistory();
  useEffect(() => {
    loadUserDetails();
  }, []);
 
  const loadUserDetails = async () => {
    const response = await getUserByUsername(id);
    
    setUser(response.data);
  };

  const editUserDetails = async () => {
    await editUser(id, user);
    history.push("../");
  };
  const onValueChange = (e) => {
   
    setUser({ ...user, [e.target.name]: e.target.value,[e.target.email]: e.target.value });
  };
  const onValueChangeBan = (e) =>{
    if(e.target.value === 'true'){
      setUser({...user,[e.target.name]:true});
    }else{
      setUser({...user,[e.target.name]:false});
    }
  }
  return (
    <FormGroup className={classes.container}>
      <Typography variant="h4">Edit Information</Typography>
      <FormControl>
        <InputLabel htmlFor="my-input">Username</InputLabel>
        <Input
          disabled   
          name="username"
          value={username}
          id="my-input"
          aria-describedby="my-helper-text"
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">Email</InputLabel>
       <Input            
          name="email"
          onChange={(e) => onValueChange(e)}
          value={""+ email ? email : ''}
          id="my-input"
          aria-describedby="my-helper-text"
        />              
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">Role</InputLabel>
        <Select
          onChange={(e) => onValueChange(e)}
          name="role"
          value={role}
          id="my-input"
          aria-describedby="my-helper-text"
        >
          <MenuItem value={"user"}>User</MenuItem>
          <MenuItem value={"checker"}>checker</MenuItem>
          <MenuItem value={"admin"}>Admin</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">Ban</InputLabel>
        <Select
          onChange={(e) => onValueChangeBan(e)}
          name="ban"
          value={ban}
          id="my-input"
          aria-describedby="my-helper-text"
        >        
          <MenuItem value={"true"}>True</MenuItem>
          <MenuItem value={"false"}>False</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={() => editUserDetails()}
        >
          Edit User
        </Button>
      </FormControl>
    </FormGroup>
  );
};

export default EditUser;
