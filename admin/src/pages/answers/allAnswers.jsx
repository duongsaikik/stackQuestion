import { useState, useEffect, useContext } from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core";
import { getAllAnswers, getAnswersOfPage } from "../../controllers/answers";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";

import { faSortUp } from "@fortawesome/free-solid-svg-icons";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FetchContext } from "../../context/fetch";
import slug from "slug";

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

const AllAnswers = () => {
  const { authAxios } = useContext(FetchContext);
  const usersUrl = "http://localhost:8080/api";
  const { question } = useParams();
  const questionId = question.split("-").shift();
  const title = question
    ?.substr(question.indexOf("-") + 1)
    .split("-")
    .join(" ");
  console.log(useParams());
  const classes = useStyles();
  const [answersOfPage, setAnswersOfPage] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
  const [query, setQuery] = useState({ pageNumber: 0, sort: "" });
  const [totalPages, setTotalPages] = useState([]);
  const pages = new Array(totalPages).fill(null).map((v, i) => i);
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
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    textAlign: "left",
  };

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
    getAllAnswers(questionId).then((res) => {
      setAllAnswers(res.data);
    });
  }, []);
  useEffect(() => {
    getAnswersOfPage(questionId, query.pageNumber, query.sort).then((res) => {
      setAnswersOfPage(res.data.answers);
      setTotalPages(res.data.totalPages);
    });
  }, [query]);

  useEffect(() => {
    setAnswersOfPage(
      allAnswers.filter((val) => {
        if (searchTerm.toString() === "") {
          return val;
        } else if (
          val.text
            .toString()
            .toLowerCase()
            .includes(searchTerm.toString().toLowerCase())
        ) {
          return val;
        }
      })
    );
  }, [searchTerm]);
  const deleteAnswerFunction = async (answer) => {
    window.confirm("Are you sure about that?");
    //await DeleteAnswer(question, answer);
    await authAxios.delete(`${usersUrl}/answer/${questionId}/${answer}`);
    alert("Xóa thành công!!!");
    getAllAnswers(questionId).then((res) => setAllAnswers(res.data));
    getAnswersOfPage(questionId, query.pageNumber, query.sort).then((res) => {
      setAnswersOfPage(res.data.answers);
      setTotalPages(res.data.totalPages);
    });
  };
  const truncate = (str, n) => {
    return str.length > n ? str.substr(0, n - 1) + " (...)" : str;
  };
  console.log(answersOfPage);
  return (
    <div className="App">
      <h1>ANSWERS MANAGEMENT</h1>
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
                Author
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
                Text
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
                Votes
                <div class="btn-group-vertical">
                  <button
                    class="sort"
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
                    class="sort"
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
              <TableCell align="center">Comment</TableCell>

              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {answersOfPage?.map((row, i) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{i + 1}</TableCell>
                <TableCell
                  sx={qt_title}
                  align="center"
                  dangerouslySetInnerHTML={{ __html: row.author.username }}
                ></TableCell>

                <TableCell align="center">
                  <div
                    style={qt_content}
                    dangerouslySetInnerHTML={{ __html: row.text }}
                  ></div>
                </TableCell>

                <TableCell align="center">{row.votes.length}</TableCell>
                <TableCell sx={qt_title} align="center">
                  {moment(row.created).format("DD/MM/YYYY hh:mm:ss")}
                </TableCell>
                <TableCell align="center">
                  {/* {row.comments.length} */}
                  <Button
                    component={Link}
                    to={`/comments/${questionId}-${slug(title)}/${row.id}`}
                  >
                    View
                  </Button>
                </TableCell>

                <TableCell align="center">
                  <Button
                    color="info"
                    href={`http://localhost:3000/questions/${questionId}-${slug(
                      title
                    )}`}
                    target="_blank"
                  >
                    Detail
                  </Button>
                </TableCell>

                <TableCell align="center">
                  <Button
                    color="warning"
                    onClick={() => deleteAnswerFunction(row.id)}
                  >
                    Delete
                  </Button>
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

export default AllAnswers;
