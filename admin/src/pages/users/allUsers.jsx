import { useState, useEffect } from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core";
import {
  getUsersOfCurrentPage,
  deleteUser,
  getAllUsers
} from "../../controllers/users";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

import { Link } from "react-router-dom";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";

import {useRouter} from "../../components/pangination/useRouter"
import Pangination from "../../components/pangination/index"

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
  const router = useRouter();


  const [usersOfCurrentPage, setUsersOfCurrentPage] = useState([]);
  const [currentPage,setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);

  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
  const [query, setQuery] = useState({ pageNumber: 0, sort: "", search: "" });
 
  const pages = new Array(totalPages).fill(null).map((v, i) => i);

  const qt_content = {
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    overflow: 'hidden',
    WebkitLineClamp: 2,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    textAlign: 'left'

  }
  const qt_title = {
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    overflow: 'hidden',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    
  }
  const qt_img = {
   width:'50px'
  }
  const qt_find_field = {
    width:'50%',
    marginBottom:'10px'
   };

  useEffect(() => {
    var request = {
      params: {
        sortType:query.sort,
        page: router.query.pagee ? router.query.pagee : 1,
        size: 15,
      }
    };
   
    getAllUsers(request).then((res) => {
      setTotalPages(res.data.pageNum)  
      setCurrentPage(res.data.currentPage)
      setUsersOfCurrentPage(res.data.user);
    });
  }, [router,query]);
  


  useEffect(() => {
    setQuery({
      pageNumber: query.pageNumber,
      sort: query.sort,
      search: searchTerm
    });
  }, [searchTerm])


  const deleteUserFunction = async (id) => {
    console.log(id)
    window.confirm("This would also remove all questions of this user. Are you sure about that?");
    await deleteUser(id);
    alert("Delete successfully!!!");
    getAllUsers().then((res) => setAllUsers(res.data));
    getUsersOfCurrentPage(query.pageNumber, query.sort, query.search).then((res) => {
      setUsersOfCurrentPage(res.data.users);
      setTotalPages(res.data.totalPages);
    });
  };

  return (
    <div className="App">
      <h1>USERS MANAGEMENT</h1>
      <Button
        variant="contained"
        style={{
          float: "left",
          background: "#1fae51",
          color: "white",
        }}
        component={Link}
        to={`/users/add`}
      >
        + Add
      </Button>{" "}
      <form class="d-flex" style={qt_find_field}>
        <input
          class="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
      
      </form>
      <TableContainer component={Paper}>

        <Table sx={{ minWidth: 850 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">No.</TableCell>
              <TableCell align="center">
                Username
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
                      setQuery({ pageNumber: query.pageNumber, sort: "username" })
                    }
                  >
                    <FontAwesomeIcon
                      icon={faSortDown}
                      className={"downarrow"}
                    />
                  </button>
                </div>
              </TableCell>
              <TableCell align="center">
                Email
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
              </TableCell>
              <TableCell align="center">
                Role
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
              </TableCell>
              <TableCell align="center">Image</TableCell>
              <TableCell align="center">
                Created
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
              </TableCell>
              <TableCell align="center">Ban</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersOfCurrentPage?.map((row, i) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">{i + 1}</TableCell>
                <TableCell sx={qt_title} align="center">{row.username}</TableCell>
                <TableCell align="center">
                  <div style={qt_content}>
                    {row.email}
                  </div>

                </TableCell>

                <TableCell align="center">{row.role}</TableCell>
                <TableCell align="center" >
                  <img style={qt_img} src={row.profilePhoto} alt="Avatar" />
                </TableCell>
                <TableCell align="center">
                  <div style={qt_content}>
                    {moment(row.created).format("DD/MM/YYYY hh:mm:ss")}
                  </div>
                </TableCell>
                <TableCell align="center">
                  <Button color={row.ban ? "warning" : "success"}>
                    {row.ban ? "True" : "False"}
                  </Button>

                </TableCell>
                <TableCell align="center">
                  {
                    row.role === 'checker' || row.role === 'admin'
                      ? ''
                      : <Button color="success"
                        href={`http://localhost:3000/users/${row.username}`}
                        target="_blank"
                      >
                        Detail
                      </Button>
                  }

                </TableCell>

                <TableCell align="center">
                  <Button color="info"
                    component={Link}
                    to={`/users/edit/${row.username}`}
                  >Edit</Button>
                </TableCell>
                <TableCell align="center">
                  <Button color="warning"
                    onClick={() => deleteUserFunction(row.username)}
                  >Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
     <Pangination currentPage={currentPage} totalPage={totalPages}/>
    </div>
  );
};

export default AllUsers;
