import { useContext, useState, useEffect } from "react";
import moment from "moment";
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Button,
  makeStyles,
  TableContainer,
} from "@material-ui/core";
import Paper from "@mui/material/Paper";
import { getAllComments, getCommentsOfPage } from "../../controllers/comments";
import { useParams } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FetchContext } from "../../context/fetch";
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

const AllComments = () => {
  const { authAxios } = useContext(FetchContext);
  const usersUrl = "http://localhost:8080/api";
  const { question, answer } = useParams();
  const questionId = question.split("-").shift();
  const title = question
    ?.substr(question.indexOf("-") + 1)
    .split("-")
    .join(" ");
  const classes = useStyles();
  const [commentsOfPage, setCommentsOfPage] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
  const [query, setQuery] = useState({ pageNumber: 0, sort: "" });
  const [totalPages, setTotalPages] = useState([]);
  const pages = new Array(totalPages).fill(null).map((v, i) => i);
  const previous = () => {
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
    getAllComments(questionId, answer).then((res) => {
      setAllComments(res.data);
    });
  }, []);
  useEffect(() => {
    getCommentsOfPage(questionId, query.pageNumber, query.sort, answer).then(
      (res) => {
        setCommentsOfPage(res.data.comments);
        setTotalPages(res.data.totalPages);
      }
    );
  }, [query]);

  useEffect(() => {
    console.log(allComments)
    setCommentsOfPage(
      allComments.filter((val) => {
        if (searchTerm.toString() === "") {
          return val;
        } else if (
          val.body
            .toString()
            .toLowerCase()
            .includes(searchTerm.toString().toLowerCase())
        ) {
          return val;
        }
      })
    );
  }, [searchTerm]);
  const deleteCommentFunction = async (comment) => {
    window.confirm("Are you sure about that?");
    if (answer) {
      await authAxios.delete(
        `${usersUrl}/comment/${questionId}/${answer}/${comment}`
      );
    } else {
      await authAxios.delete(`${usersUrl}/comment/${questionId}/${comment}`);
    }
    alert("Xóa thành công!!!");
    getAllComments(questionId).then((res) => setAllComments(res.data));
    getCommentsOfPage(questionId, query.pageNumber, query.sort, answer).then(
      (res) => {
        setCommentsOfPage(res.data.comments);
        setTotalPages(res.data.totalPages);
      }
    );
  };
  const truncate = (str, n) => {
    return str.length > n ? str.substr(0, n - 1) + " (...)" : str;
  };
  const qt_content = {
    display: "-webkit-box",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    overflow: "hidden",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    textAlign: "left",
  };
  return (
    <div className="App">
      <h1>COMMENTS MANAGEMENT</h1>
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">No.</TableCell>
              <TableCell align="center">
                Author{" "}
                <div class="btn-group-vertical">
                  <button
                    class="sort"
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
                    class="sort"
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
                Text{" "}
                <div class="btn-group-vertical">
                  <button
                    class="sort"
                    onClick={() =>
                      setQuery({
                        pageNumber: query.pageNumber,
                        sort: "-text",
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
                        sort: "text",
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
              </TableCell>
              <TableCell align="center">Modify</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commentsOfPage?.map((comment, i) => (
              <TableRow
                key={comment.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{i + 1}</TableCell>
                <TableCell align="center">{comment.author.username}</TableCell>
                <TableCell
                  align="center"
                  sx={qt_content}
                  dangerouslySetInnerHTML={{ __html: comment.body }}
                ></TableCell>
                <TableCell align="center">
                  {moment(comment.created).format("DD/MM/YYYY hh:mm:ss")}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    style={{
                      marginRight: 10,
                      background: "#09aeae",
                      color: "white",
                    }}
                    href={`http://localhost:3000/questions/${question}`}
                    target="_blank"
                  >
                    Details
                  </Button>{" "}
                  {/* change it to user.id to use JSON Server */}
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => deleteCommentFunction(comment.id)}
                  >
                    Delete
                  </Button>{" "}
                  {/* change it to user.id to use JSON Server */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <nav aria-label="Page navigation example" className="pt_outline">
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

export default AllComments;
