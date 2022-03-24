import axios from "axios";
const usersUrl = "http://localhost:8080/api";
export const getAllQuestions = async () => {
  return await axios.get(`${usersUrl}/question`);
};
export const getQuestionsOfCurrentPage = async (page, sort) => {
  page = page || 0;
  sort = sort || "";
  return await axios.get(`${usersUrl}/questions?page=${page}&sort=${sort}`);
};

