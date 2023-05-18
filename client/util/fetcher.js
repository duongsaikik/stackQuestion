import axios from 'axios'

const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/api'
    : `https://${process.env.SITE_NAME}/api`
const headers = { 'Content-Type': 'application/json' }
const publicFetch = axios.create({
  baseURL,
  headers
})

export { publicFetch, baseURL }
