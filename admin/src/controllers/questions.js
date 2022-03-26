import axios from "axios";
const usersUrl = "http://localhost:8080/api";
export const getAllQuestions = async (page,size,sort) => {
  return await axios.get(`${usersUrl}/question?page=${page}&sort=${sort}&size=${size}`);
};

export const getQuestionsOfCurrentPage = async (request) => {
  
  return await axios.get(`${usersUrl}/question`,request);
};

export const getQuestionsById = async (id,request) =>{
  return await axios.get(`${usersUrl}/question/users/report/${id}`,request);
}

export const removeReports = async (id,reportId) =>{
  return await axios.delete(`${usersUrl}/report/${id}/${reportId}`);
}
