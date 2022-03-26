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
  getQuestionsOfCurrentPage,
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

const AllQuestions = () => {
  const router = useRouter();
  
  const { authAxios } = useContext(FetchContext);
  const usersUrl = "http://localhost:8080/api";
  const classes = useStyles();
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
/*   const previous = () => {
    setQuery({
      pageNumber: Math.max(0, query.pageNumber - 1),
      sort: query.sort,
    });
  };
  const next = () => {
    setQuery({
      pageNumber: Math.min(totalPages - 1, query.pageNumber + 1),
      sort: query.sort,
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
  useEffect(() => {
    getAllQuestions().then((res) => {
      setAllQuestions(res.data);
    });
  }, []);
  */
  useEffect(() => {
    var request = {
      params: {
        requestType: query.sort,
        page:  1,
        size: 15,
      }
    };
  
    getQuestionsOfCurrentPage(request).then((res) => {
     
        setCurrentPage(res.data.currentPage)
      setQuestionsOfCurrentPage(res.data.data);
      setTotalPages(res.data.totalPages);
    });
  }, [query]);
 
  useEffect(() => {
    var request = {
      params: {
        requestType: "Newest",
        page: router.query.pagee ? router.query.pagee : 1,
        size: 15,
      }
    };
   
    const fetchQt = async () => {
      if (searchTerm) {
        const { data } = await axios.get(
          `${usersUrl}/question/find/${searchTerm}`,
          request
        );
        setQuestionsOfCurrentPage(data.data);
        setTotalPages(data.pageNum);
        setCurrentPage(data.currentPage)
      } else {
        const { data } = await axios.get(`${usersUrl}/question`, request);
     
        setQuestionsOfCurrentPage(data.data);
        setTotalPages(data.pageNum);
        setCurrentPage(data.currentPage)
      }
    };
    fetchQt();
  }, [searchTerm,router]);
 
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
      <div>
        <h1>QUESTIONS MANAGEMENT</h1>
        <form class="d-flex" style={qt_find_field}>
          <input
            class="form-control me-2"
            type="search"
            style={{marginBottom:10}}
            placeholder="Search"
            aria-label="Search"
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
         {/*  <button class="btn btn-outline-success" type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </button> */}
        </form>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 850 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">No.</TableCell>
                <TableCell align="center">
                  Title
                  <div class="btn-group-vertical">
                    <button
                      className="sort"
                      onClick={() =>
                        setQuery({
                          pageNumber: query.pageNumber,
                          sort: "-title",
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faSortUp} className={"uparrow"} />
                    </button>
                    <button
                      className="sort"
                      onClick={() =>
                        setQuery({
                          pageNumber: query.pageNumber,
                          sort: "title",
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
                <TableCell align="center">Text</TableCell>
                <TableCell align="center">
                  Author
                  <div className="btn-group-vertical">
                    <button
                      className="sort"
                      onClick={() =>
                        setQuery({
                          pageNumber: query.pageNumber,
                          sort: "-author",
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faSortUp} className={"uparrow"} />
                    </button>
                    <button
                      className="sort"
                      onClick={() =>
                        setQuery({
                          pageNumber: query.pageNumber,
                          sort: "author",
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
                <TableCell align="center">
                  Votes
                  <div class="btn-group-vertical">
                    <button
                      className="sort"
                      onClick={() =>
                        setQuery({
                          pageNumber: query.pageNumber,
                          sort: "-score",
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faSortUp} className={"uparrow"} />
                    </button>
                    <button
                      className="sort"
                      onClick={() =>
                        setQuery({
                          pageNumber: query.pageNumber,
                          sort: "score",
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
                <TableCell align="center">
                  Created
                  <div class="btn-group-vertical">
                    <button
                      className="sort"
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
                      className="sort"
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
                <TableCell align="center">Answers</TableCell>
                <TableCell align="center">Comments</TableCell>
                <TableCell align="center">Status</TableCell>
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
                    <Button
                      component={Link}
                      to={`/answers/${row.id}-${slug(row.title)}`}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      component={Link}
                      to={`/comments/${row.id}-${slug(row.title)}`}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      color={
                        row._status === "pending"
                          ? "info"
                          : row._status === "deny"
                          ? "warning"
                          : "success"
                      }
                    >
                      {row._status}
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
    </div>
  );
};

export default AllQuestions;
