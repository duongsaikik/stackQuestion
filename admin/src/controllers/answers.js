import axios from "axios";
const usersUrl = "http://localhost:8080/api";
export const getAllAnswers = async (question) => {
  return await axios.get(`${usersUrl}/allAnswers/${question}`);
};

export const getAnswersOfPage = async (question, page, sort) => {
  page = page || 0;
  sort = sort || "";
  return await axios.get(`${usersUrl}/answers/${question}?page=${page}&sort=${sort}`);
};

