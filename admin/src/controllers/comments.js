import axios from "axios";
const usersUrl = "http://localhost:8080/api";
export const getAllComments = async (question, answer) => {
  if (answer) {
    return await axios.get(`${usersUrl}/allComments/${question}/${answer}`);
  } else return await axios.get(`${usersUrl}/allComments/${question}`);
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

