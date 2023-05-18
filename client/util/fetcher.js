import axios from 'axios'

const baseURL = 'https://stack-question-ba.onrender.com/api'
const headers = { 'Content-Type': 'application/json' }
const publicFetch = axios.create({
  baseURL,
  headers
})

export { publicFetch, baseURL }
