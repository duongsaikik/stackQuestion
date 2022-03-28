import { useState, useEffect, useContext } from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

/* import { Spinner } from '../components/icons' */
import { Button } from "@mui/material";
import {
 
  getAllQuestions,
} from "../../controllers/questions";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FetchContext } from "../../context/fetch";
import axios from "axios";
import slug from "slug";
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
const styleButton = {
  background: "#white",
};

const AllReport = () => {
  const router = useRouter();
  
  const { authAxios } = useContext(FetchContext);
  const usersUrl = "http://localhost:8080/api";
  
  const [questionsOfCurrentPage, setQuestionsOfCurrentPage] = useState([]);
  
  const [currentPage,setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState({ pageNumber: 0, sort: "" });

  const [totalPages, setTotalPages] = useState([]);
 
  const qt_content = {
    display: "-webkit-box",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    overflow: "hidden",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    textAlign: "left",
  };
  const qt_title = {
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    overflow: "hidden",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    textAlign: "left",
  };
  const qt_find_field = {
   width:'50%'
  };


  useEffect(() => {
    var request = {
      params: {
        requestType: "Newest",
        page: router.query.pagee ? router.query.pagee : 1,
        size: 15,
      }
    };
   
    const fetchQt = async () => {
      
        const { data } = await axios.get(`${usersUrl}/question/report/qt`, request);
     
         setQuestionsOfCurrentPage(data.data);
        setTotalPages(data.pageNum);
        setCurrentPage(data.currentPage) 
      
    };
    fetchQt();
  }, [router]);
 
  const deleteQuestionFunction = async (id) => {
    var request = {
    
        requestType: "Newest",
        page: 1,
        size: 15,
 
    };
    const currentPath = router.pathname;
    const currentQuery = router.query;
  
  

    router.push(`${currentPath}?pagee=${currentQuery.pagee}`)
    window.confirm("Are you sure about that?");
    await authAxios.delete(`${usersUrl}/question/${id}`);
    alert("Xóa thành công!!!");
     getAllQuestions(request.page, request.size,request.requestType).then((res) => {
      setQuestionsOfCurrentPage(res.data.data);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage)
     });
  
     
   
  };

  return (
    <div className="App">
      <h1>Reports</h1>
     
    
      <TableContainer component={Paper}>
          <Table sx={{ minWidth: 850 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">No.</TableCell>
                <TableCell align="center">
                  Title
                 
                </TableCell>
                <TableCell align="center">Text</TableCell>
                <TableCell align="center">
                  Author
                 
                </TableCell>
                <TableCell align="center">
                  Votes
               
                </TableCell>
                <TableCell align="center">
                  Created
                 
                </TableCell>
                <TableCell align="center">Reports</TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questionsOfCurrentPage?.map((row, i) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{i + 1}</TableCell>
                  <TableCell
                    sx={qt_title}
                    align="center"
                    dangerouslySetInnerHTML={{ __html: row.title }}
                  ></TableCell>

                  <TableCell align="center">
                    <div
                      style={qt_content}
                      dangerouslySetInnerHTML={{ __html: row.text }}
                    ></div>
                  </TableCell>
                  <TableCell align="center">{row.author.username}</TableCell>
                  <TableCell align="center">{row.votes.length}</TableCell>

                  <TableCell align="center">
                    {moment(row.created).format("DD/MM/YYYY hh:mm:ss")}
                   
                  </TableCell>
                 
                  <TableCell align="center">
                   {row.report.length}
                  </TableCell>
                  <TableCell align="center">
                   <Button
                    component={Link}
                    to={`/report/userreport/${row.id}`}
                   >
                     View
                     </Button>
                  </TableCell>
                  <TableCell align="center">
                    {row._status === "pending" || row._status === "deny" ? (
                      ""
                    ) : (
                      <Button
                        color="success"
                        href={`http://localhost:3000/questions/${row.id}-${slug(
                          row.title
                        )}`}
                        target="_blank"
                      >
                        Detail
                      </Button>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      component={Link}
                      onClick={() => deleteQuestionFunction(row.id)}
                    >
                      Delete
                    </Button>
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

export default AllReport;
