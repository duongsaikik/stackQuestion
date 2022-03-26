import { useState, useEffect } from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core";
import {
    getQuestionsById,
    removeReports
} from "../../controllers/questions";
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

const UserReport = () => {
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
          page: router.query.pagee ? router.query.pagee : 1,
          size: 15,
        }
    }
  getQuestionsById(router.query.id,request)
  .then((res) =>{
      console.log(res.data)
    setTotalPages(res.data.pageNum)  
    setCurrentPage(res.data.currentPage)
    setUsersOfCurrentPage(res.data.data);
  })
   
  }, [router]);
  


  useEffect(() => {
    setQuery({
      pageNumber: query.pageNumber,
      sort: query.sort,
      search: searchTerm
    });
  }, [searchTerm])


  const deleteUserFunction = async (id) => {
   
    window.confirm("This would also remove all questions of this user. Are you sure about that?");
    await removeReports(router.query.id,id);
    alert("Delete successfully!!!");
    var request = {
      params: {      
        page: 1,
        size: 15,
      }
  }
  
    getQuestionsById(router.query.id,request).then((res) => {
      setTotalPages(res.data.pageNum)  
    setCurrentPage(res.data.currentPage)
    setUsersOfCurrentPage(res.data.data);
    }); 
  };

  return (
    <div className="App">
      <h1>USERS REPORT</h1>
     
    
      <TableContainer component={Paper}>

        <Table sx={{ minWidth: 850 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">No.</TableCell>
              <TableCell align="center">
                Username
             
              </TableCell>
              <TableCell align="center">
                Email
               
              </TableCell>
              
              <TableCell align="center">Image</TableCell>
              <TableCell align="center">
                Created
               
              </TableCell>
             
             
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

               
                <TableCell align="center" >
                  <img style={qt_img} src={row.profilePhoto} alt="Avatar" />
                </TableCell>
                <TableCell align="center">
                  <div style={qt_content}>
                    {moment(row.created).format("DD/MM/YYYY hh:mm:ss")}
                  </div>
                </TableCell>   
                <TableCell align="center">
                  <Button color="warning"
                    onClick={() => deleteUserFunction(row._id)}
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

export default UserReport;
