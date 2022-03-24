import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

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
const qt_itemTag = {
  padding: '4px',
  background: 'darkturquoise',
  borderRadius: '5px',
  fontSize: '12px',
  color: 'white',
  margin: '2px'

}
const AllCensorship = () => {

  const [open, setOpen] = React.useState(false)
  const [_status, setStatus] = React.useState()
  const [questions, setQuestions] = useState(null)
  const [questionId, setQuestionId] = useState()
  const [tags, setTags] = useState([])
  const [selectedTag, setSelectedTag] = useState()
  const usersUrl = "http://localhost:8080/api";
  const handleChange = (event) => {
    setSelectedTag(event.target.value)
  }

  const fetchQuestion = async () => {
    const { data } = await axios.get(`${usersUrl}/question`)
    console.log(data)
    setQuestions(data.data)
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

  }, [open])

  useEffect(() => {
    fetchTags()
  }, [])

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

        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Text</TableCell>
              <TableCell align="center">Tags</TableCell>
              <TableCell align="center">created</TableCell>
              <TableCell align="center">author</TableCell>
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
                <TableCell align="center">{row.created}</TableCell>
                <TableCell align="center">{row.author.username}</TableCell>
                <TableCell align="center">
                  {row._status === 'done' && (
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
                  <Button onClick={() => handleModal(row.id)}>Duyệt</Button>
                </TableCell>
              </TableRow>
            )) : ''}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  )
}
export default AllCensorship;