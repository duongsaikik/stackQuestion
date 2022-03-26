import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Link } from "react-router-dom";

import Pangination from "../../components/pangination/index";
import {useRouter} from "../../components/pangination/useRouter";
import { useParams } from 'react-router-dom'

/* import { Spinner } from '../components/icons' */
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import axios from "axios";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FetchContext } from "../../context/fetch";
import '../censorship/allCensorship.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}
const qt_content = {
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  overflow: 'hidden',
  WebkitLineClamp: 4,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  textAlign: 'left'

}
const qt_title = {
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  overflow: 'hidden',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  textAlign: 'left'
}
const qt_tag = {
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  overflow: 'hidden',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  textAlign: 'left'

}
const qt_created = {
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  overflow: 'hidden',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  textAlign: 'left'

}
const qt_itemTag = {
  padding: '4px',
  background: 'darkturquoise',
  borderRadius: '5px',
  fontSize: '12px',
  color: 'white',
  margin: '2px'

}
const withTable = {
    minWidth: '750px',
}
const AllCensorship = () => {

  const router = useRouter();

  const [open, setOpen] = React.useState(false)
  const [_status, setStatus] = React.useState()
  const [questions, setQuestions] = useState(null)
  const [questionId, setQuestionId] = useState()
  const [tags, setTags] = useState([])
  const [selectedTag, setSelectedTag] = useState()

  const [query, setQuery] = useState({ pageNumber: 0, sort: "", search: "" });
  const [questionsOfCurrentPage, setQuestionsOfCurrentPage] = useState([]);
  const [totalPages, setTotalPages] = useState([]);

  const usersUrl = "http://localhost:8080/api";
  const handleChange = (event) => {
    setSelectedTag(event.target.value)
}

  const fetchQuestion = async (size) => {
    var request = {
      params: {   
        requestType: query.sort,   
        page:size? size : router.query.pagee ? router.query.pagee : 1,
        size: 15
      }
    }
    const { data } = await axios.get(`${usersUrl}/question`,request)
    console.log(data)
    setQuestions(data.data)
    setQuestionsOfCurrentPage(data.currentPage)
    setTotalPages(data.pageNum);
  }

  const fetchQuestionByTag = async () => {
    const { data } = await axios.get(`${usersUrl}/questions/` + selectedTag)
    setQuestions(data)
    console.log(data)
  }

  const fetchTags = async () => {
    const { data } = await axios.get(`${usersUrl}/tags`)
    console.log(data)
    setTags(data.tag)
  }

  const updateQuestionStatus = async () => {
    const { data } = await axios.put(`${usersUrl}/question/` + questionId, {
      _status: _status
    })
    setStatus('')
    fetchQuestion(1);
  }

  const handleModal = (id) => {
    setOpen(true)
    setQuestionId(id)
  }

  useEffect(() => {
    if (_status) {
       updateQuestionStatus()
     
    }
  }, [_status])

  useEffect(() => {
    if (selectedTag === 'All') fetchQuestion()
    else if (selectedTag) {
      fetchQuestionByTag()
    }

  }, [selectedTag])

  useEffect(() => {
    fetchQuestion()

  }, [router,query])

  useEffect(() => {
    fetchTags()
  }, [router])

 

  return (
    <div>
      <div>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <InputLabel id="dem-select-status">Status</InputLabel>
            <Select
              labelId="dem-select-status"
              id="demo-simple-select1"
              value={_status}
              label="Status"
              onChange={(e) => {
                setStatus(e.target.value)
              }}
            >
              <MenuItem value={'pending'}>Pending</MenuItem>
              <MenuItem value={'deny'}>Deny</MenuItem>
              <MenuItem value={'accept'}>Accept</MenuItem>
            </Select>
          </Box>
        </Modal>
      </div>
      <Box sx={{ maxWidth: 120, margin: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Tag</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedTag}
            label="Tag"
            onChange={handleChange}
          >
            <MenuItem value={'All'}>All</MenuItem>
            {tags ? tags.map((item) => (
              <MenuItem value={item._id}>{item._id}</MenuItem>
            )) : ''}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>

        <Table sx={withTable} aria-label="simple table">
          <TableHead>
            <TableRow>
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
              <TableCell align="center">Tags</TableCell>
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
              <TableCell align="center">Author</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions ? questions.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={qt_title} align="center">{row.title}</TableCell>
                <TableCell align="center" >
                  <div style={qt_content} dangerouslySetInnerHTML={{ __html: row.text }}>

                  </div>
                </TableCell>
                <TableCell sx={qt_tag} align="center">{row.tags?.map((item, index) => {
                  return <span style={qt_itemTag} key={index}>
                    {item}
                  </span>
                })}</TableCell>
                <TableCell sx={qt_created} align="center">{row.created}</TableCell>
                <TableCell align="center">{row.author.username}</TableCell>
                <TableCell align="center">
                  {row._status === 'accept' && (
                    <Button  color="success">
                      {row._status}
                    </Button>
                  )}
                  {row._status === 'pending' && (
                    <Button  color="info">
                      {row._status}
                    </Button>
                  )}
                  {row._status === 'deny' && (
                    <Button  color="warning">
                      {row._status}
                    </Button>
                  )}
                </TableCell>
                <TableCell align="center">
                  {
                    row._status === 'accept' || row._status === 'deny'
                    ? ''
                    : <Button onClick={() => handleModal(row.id)}>Approve</Button>
                  }
                  
                </TableCell>
              </TableRow>
            )) : ''}
          </TableBody>
        </Table>
      </TableContainer>
     
     <Pangination currentPage={questionsOfCurrentPage} totalPage={totalPages}/>
    </div>
   
  )
}
export default AllCensorship;