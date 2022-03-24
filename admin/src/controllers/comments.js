import axios from "axios";
import { useContext } from "react";
import { FetchContext } from "../context/fetch";
const usersUrl = "http://localhost:8080/api";
export const getAllComments = async (question, answer) => {
  if (answer) {
    return await axios.get(`${usersUrl}/allComments/${question}/${answer}`);
  } else return await axios.get(`${usersUrl}/allComments/${question}`);
};

export const getUserById = async (id) => {
  id = id || "";
  return await axios.get(`${usersUrl}/user/${id}`);
};
export const getCommentsOfPage = async (question, page, sort, answer) => {
  page = page || 0;
  sort = sort || "";
  if (answer) {
    return await axios.get(
      `${usersUrl}/comments/${question}/${answer}?page=${page}&sort=${sort}`
    );
  } else
    return await axios.get(
      `${usersUrl}/comments/${question}?page=${page}&sort=${sort}`
    );
};

export const addUser = async (user) => {
  return await axios.post(`${usersUrl}/user/addUser`, user);
};

const DeleteComment = async (question, comment) => {
  const { authAxios } = useContext(FetchContext);
  return await authAxios.delete(`${usersUrl}/comment/${question}/${comment}`);
};
export default DeleteComment;
