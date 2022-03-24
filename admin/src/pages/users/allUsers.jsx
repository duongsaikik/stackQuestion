import { useState, useEffect } from "react";
import moment from "moment";
import { Button, makeStyles } from "@material-ui/core";
import {
  getUsersOfCurrentPage,
  deleteUser,
  getAllUsers,
} from "../../controllers/users";
import { Link } from "react-router-dom";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";

const useStyles = makeStyles({
  table: {
    width: "90%",
    margin: "50px 0 0 50px",
  },
  thead: {
    "& > *": {
      fontSize: 20,
      background: "#808080",
      color: "#black",
    },
  },
  row: {
    "& > *": {
      fontSize: 18,
    },
  },
  pagination: {
    margin: "30px",
  },
});

const AllUsers = () => {
  const classes = useStyles();
  const [usersOfCurrentPage, setUsersOfCurrentPage] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
  const [query, setQuery] = useState({ pageNumber: 0, sort: "", search: "" });
  const [totalPages, setTotalPages] = useState([]);
  const pages = new Array(totalPages).fill(null).map((v, i) => i);
  const previous = () => {
    setQuery({
      pageNumber: Math.max(0, query.pageNumber - 1),
      sort: query.sort,
      search: query.search
    });
  };
  const next = () => {
    setQuery({
      pageNumber: Math.min(totalPages - 1, query.pageNumber + 1),
      sort: query.sort,
      search: query.search
    });
  };
  useEffect(() => {
    getAllUsers().then((res) => {
      setAllUsers(res.data);
    });
  }, []);
  useEffect(() => {
    getUsersOfCurrentPage(query.pageNumber, query.sort, query.search).then((res) => {
      setUsersOfCurrentPage(res.data.users);
      setTotalPages(res.data.totalPages);
    });
  }, [query]);

  // useEffect(() => {
  //   setUsersOfCurrentPage(
  //     allUsers.filter((val) => {
  //       if (searchTerm.toString() === "") {
  //         return val;
  //       } else if (
  //         val.username
  //           .toString()
  //           .toLowerCase()
  //           .includes(searchTerm.toString().toLowerCase())
  //       ) {
  //         return val;
  //       }
  //     })
  //   );
  // }, [searchTerm]);
  useEffect(()=>{
    setQuery({
      pageNumber: query.pageNumber,
      sort: query.sort,
      search: searchTerm
    });
  },[searchTerm])
  const deleteUserFunction = async (id) => {
    window.confirm("Are you sure about that?");
    await deleteUser(id);
    alert("Xóa thành công!!!");
    getAllUsers().then((res) => setAllUsers(res.data));
    getUsersOfCurrentPage(query.pageNumber, query.sort, query.search).then((res) => {
      setUsersOfCurrentPage(res.data.users);
      setTotalPages(res.data.totalPages);
    });
  };
  const isFirstPage = () => {
    return "page-item " + (query.pageNumber === 0 ? "disabled" : "");
  };
  const isLastPage = () => {
    return (
      "page-item " + (query.pageNumber === totalPages - 1 ? "disabled" : "")
    );
  };
  const isActive = (pageNumber) => {
    return "page-item " + (query.pageNumber === pageNumber ? "active" : "");
  };
  return (
    <div className="App">
      <h1>USERS MANAGEMENT</h1>
      <Button
        variant="contained"
        style={{
          marginLeft: "4%",
          float: "left",
          background: "#1fae51",
          color: "white",
        }}
        component={Link}
        to={`/users/add`}
      >
        + Add
      </Button>{" "}
      <form class="d-flex">
        <input
          class="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
        <button class="btn btn-outline-success" type="submit">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
      <div class="table-responsive-xxl">
        <table class="table table-sm table-bordered table-striped">
          <thead class="table-dark">
            <tr className={classes.thead}>
              <th style={{ width: "5%" }}>No.</th>
              <th style={{ width: "15%" }}>
                Username{" "}
                <div class="btn-group-vertical">
                  <button
                    class="sort"
                    onClick={() =>
                      setQuery({
                        pageNumber: query.pageNumber,
                        sort: "-username",
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faSortUp} className={"uparrow"} />
                  </button>
                  <button
                    class="sort"
                    onClick={() =>
                      setQuery({
                        pageNumber: query.pageNumber,
                        sort: "username",
                      })
                    }
                  >
                    <FontAwesomeIcon
                      icon={faSortDown}
                      className={"downarrow"}
                    />
                  </button>
                </div>
              </th>
              <th style={{ width: "25%" }}>
                Email{" "}
                <div class="btn-group-vertical">
                  <button
                    class="sort"
                    onClick={() =>
                      setQuery({
                        pageNumber: query.pageNumber,
                        sort: "-email",
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faSortUp} className={"uparrow"} />
                  </button>
                  <button
                    class="sort"
                    onClick={() =>
                      setQuery({ pageNumber: query.pageNumber, sort: "email" })
                    }
                  >
                    <FontAwesomeIcon
                      icon={faSortDown}
                      className={"downarrow"}
                    />
                  </button>
                </div>
              </th>
              <th style={{ width: "7%" }}>
                Role{" "}
                <div class="btn-group-vertical">
                  <button
                    class="sort"
                    onClick={() =>
                      setQuery({
                        pageNumber: query.pageNumber,
                        sort: "-role",
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faSortUp} className={"uparrow"} />
                  </button>
                  <button
                    class="sort"
                    onClick={() =>
                      setQuery({ pageNumber: query.pageNumber, sort: "role" })
                    }
                  >
                    <FontAwesomeIcon
                      icon={faSortDown}
                      className={"downarrow"}
                    />
                  </button>
                </div>
              </th>
              <th style={{ width: "7%" }}>Avatar</th>
              <th>
                Created{" "}
                <div class="btn-group-vertical">
                  <button
                    class="sort"
                    onClick={() =>
                      setQuery({
                        pageNumber: query.pageNumber,
                        sort: "-created",
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faSortUp} className={"uparrow"} />
                  </button>
                  <button
                    class="sort"
                    onClick={() =>
                      setQuery({
                        pageNumber: query.pageNumber,
                        sort: "created",
                      })
                    }
                  >
                    <FontAwesomeIcon
                      icon={faSortDown}
                      className={"downarrow"}
                    />
                  </button>
                </div>
              </th>
              <th>Modify</th>
            </tr>
          </thead>
          <tbody>
            {usersOfCurrentPage.map((user, i) => (
              <tr className={classes.row} key={user.id}>
                <th>{i + 1}</th>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <img src={user.profilePhoto} alt="Avatar"></img>
                </td>
                <td>{moment(user.created).format("DD/MM/YYYY hh:mm:ss")}</td>
                <td>
                  <Button
                    variant="contained"
                    style={{
                      marginRight: 10,
                      background: "#09aeae",
                      color: "white",
                    }}
                    href={`http://localhost:3000/users/${user.username}`}
                    target="_blank"
                  >
                    Details
                  </Button>{" "}
                  <Button
                    color="primary"
                    variant="contained"
                    style={{ color: "white", marginRight: 10 }}
                    component={Link}
                    to={`/users/edit/${user.username}`}
                  >
                    Edit
                  </Button>{" "}
                  {/* change it to user.id to use JSON Server */}
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => deleteUserFunction(user.username)}
                  >
                    Delete
                  </Button>{" "}
                  {/* change it to user.id to use JSON Server */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <li class={isFirstPage()}>
            <a class="page-link" onClick={previous}>
              Previous
            </a>
          </li>
          {pages.map((pageIndex) => (
            <li class={isActive(pageIndex)}>
              <a
                class="page-link"
                onClick={() => {
                  setQuery({ pageNumber: pageIndex, sort: query.sort });
                }}
              >
                {pageIndex + 1}
              </a>
            </li>
          ))}

          <li class={isLastPage()}>
            <a class="page-link" onClick={next}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AllUsers;
