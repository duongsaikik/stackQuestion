import { useState, useEffect, useContext } from "react";
import moment from "moment";
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Button,
  makeStyles,
} from "@material-ui/core";
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
  const { authAxios } = useContext(FetchContext);
  const usersUrl = "http://localhost:8080/api";
  const classes = useStyles();
  const [questionsOfCurrentPage, setQuestionsOfCurrentPage] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
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
    getAllQuestions().then((res) => {
      setAllQuestions(res.data);
    });
  }, []);
  useEffect(() => {
    getQuestionsOfCurrentPage(query.pageNumber, query.sort).then((res) => {
      setQuestionsOfCurrentPage(res.data.questions);
      setTotalPages(res.data.totalPages);
    });
  }, [query]);

  useEffect(() => {
    setQuestionsOfCurrentPage(
      allQuestions.filter((val) => {
        if (searchTerm.toString() === "") {
          return val;
        } else if (
          val.title
            .toString()
            .toLowerCase()
            .includes(searchTerm.toString().toLowerCase())
        ) {
          return val;
        }
      })
    );
  }, [searchTerm]);
  const deleteQuestionFunction = async (id) => {
    window.confirm("Are you sure about that?");
    await authAxios.delete(`${usersUrl}/question/${id}`);
    alert("Xóa thành công!!!");
    getAllQuestions().then((res) => setAllQuestions(res.data));
    getQuestionsOfCurrentPage(query.pageNumber, query.sort).then((res) => {
      setQuestionsOfCurrentPage(res.data.questions);
      setTotalPages(res.data.totalPages);
    });
  };

  return (
    <div className="App">
      <h1>QUESTIONS MANAGEMENT</h1>
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
              <th style={{ width: "3%" }}>No.</th>
              <th style={{ width: "20%", wordBreak: "break-word" }}>
                Title{" "}
                <div class="btn-group-vertical">
                  <button
                    class="sort"
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
                    class="sort"
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
              </th>
              <th style={{ wordBreak: "break-word" }}>
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
              </th>
              <th style={{ width: "8%" }}>
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
              </th>
              <th style={{ width: "7%" }}>
                Votes{" "}
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
              </th>
              <th style={{ width: "13%" }}>
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
              <th style={{ width: "8%" }}>Answers</th>
              <th style={{ width: "8%" }}>Comments</th>
              <th style={{ width: "13%" }}>Modify</th>
            </tr>
          </thead>
          <tbody>
            {questionsOfCurrentPage.map((question, i) => (
              <tr className={classes.row} key={question.id}>
                <th>{i + 1}</th>
                <td
                  style={{ wordBreak: "break-word" }}
                  dangerouslySetInnerHTML={{ __html: question.title }}
                ></td>
                <td
                  style={{ wordBreak: "break-word" }}
                  dangerouslySetInnerHTML={{ __html: question.text }}
                ></td>
                <td>{question.author.username}</td>
                <td>{question.votes.length}</td>
                <td>
                  {moment(question.created).format("DD/MM/YYYY hh:mm:ss")}
                </td>
                <td>
                  <Button
                    variant="contained"
                    style={{
                      marginRight: 10,
                      color: "white",
                    }}
                    color="primary"
                    component={Link}
                    to={`/answers/${question.id}`}
                  >
                    View
                  </Button>{" "}
                </td>
                <td>
                  <Button
                    variant="contained"
                    style={{
                      marginRight: 10,
                      color: "white",
                    }}
                    color="primary"
                    component={Link}
                    to={`/comments/${question.id}`}
                  >
                    View
                  </Button>{" "}
                </td>
                <td>
                  <Button
                    variant="contained"
                    style={{
                      marginRight: 10,
                      background: "#09aeae",
                      color: "white",
                    }}
                    href={`http://localhost:3000/questions/${question.id}-${question.title}`}
                    target="_blank"
                  >
                    Details
                  </Button>{" "}
                  {/* change it to user.id to use JSON Server */}
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => deleteQuestionFunction(question.id)}
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

export default AllQuestions;
