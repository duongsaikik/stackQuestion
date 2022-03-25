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
  const { logout, isAuthenticated, isChecker } = useContext(AuthContext);


  /* showNavbar('header-toggle','nav-bar','body-pd','header') */


  return (
    <>

      <div className="l-navbar" id="nav-bar">
        <nav className="nav">
          <div>
            <a href="#" className="nav__logo">
              <i className='bx bx-layer nav__logo-icon'></i>
              <span className="nav__logo-name">Bedimcode</span>
            </a>

            <div className="nav__list">
              {
                isChecker()
                  ? <NavLink className="nav__link" to="/censorship" exact>
                    <i className='bx bx-bookmark nav__icon' ></i>
                    <span className="nav__name">CenSorship</span>
                  </NavLink>
                  : <>
                    <NavLink className="nav__link" to="/users" exact>
                      <i className='bx bx-user nav__icon' ></i>
                      <span className="nav__name">Users</span>
                    </NavLink>
                    <NavLink className="nav__link" to="/questions" exact>
                      <i className='bx bx-message-square-detail nav__icon' ></i>
                      <span className="nav__name">Questions</span>
                    </NavLink>

                    <NavLink className="nav__link" to="/censorship" exact>
                      <i className='bx bx-bookmark nav__icon' ></i>
                      <span className="nav__name">Censorship</span>
                    </NavLink>
                  </>
              }


            </div>
          </div>

          {isAuthenticated() ? (
            <NavLink
              className="nav__link"
              to="/logout"
              exact

              onClick={logout}
            >
              <i className='bx bx-log-out nav__icon' ></i>
              <span className="nav__name">Log Out</span>
            </NavLink>
          ) : (
            <NavLink
              className="nav__link"
              to="/login"
              exact

            >
              <i className='bx bx-log-out nav__icon' ></i>
              <span className="nav__name">Log Out</span>
            </NavLink>
          )}
        </nav>
      </div>


    </>
  );
};

export default NavBar;
