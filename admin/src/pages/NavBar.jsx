import { AppBar, Toolbar, makeStyles } from "@material-ui/core";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/auth";
const useStyle = makeStyles({
  header: {
    background: "#111111",
  },
  tabs: {
    color: "#FFFFFF",
    marginRight: 20,
    textDecoration: "none",
    fontSize: 20,
  },
});

const NavBar = () => {
  const classes = useStyle();
  const { logout, isAuthenticated } = useContext(AuthContext);
  return (
    <AppBar position="static" className={classes.header}>
      <Toolbar>
        {/* <NavLink className={classes.tabs} to="/" exact>
          Home
        </NavLink> */}
        <NavLink className={classes.tabs} to="/users" exact>
          Users
        </NavLink>
        <NavLink className={classes.tabs} to="/questions" exact>
          Questions
        </NavLink>
        {isAuthenticated() ? (
          <NavLink
            className={classes.tabs}
            to="/logout"
            exact
            style={{ marginLeft: "80%" }}
            onClick={logout}
          >
            Logout
          </NavLink>
        ) : (
          <NavLink
            className={classes.tabs}
            to="/login"
            exact
            style={{ marginLeft: "80%" }}
          >
            Login
          </NavLink>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
