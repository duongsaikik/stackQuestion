import axios from "axios";
const usersUrl = "http://localhost:8080/api";
export const getAllUsers = async () => {
  return await axios.get(`${usersUrl}/users`);
};

export const getUserByUsername = async (id) => {
  id = id || "";
  return await axios.get(`${usersUrl}/user/${id}`);
};
export const getUsersOfCurrentPage = async (page, sort, search) => {
  page = page || 0;
  sort = sort || "";
  search = search || "";
  return await axios.get(`${usersUrl}/user?page=${page}&sort=${sort}&search=${search}`);
};

export const addUser = async (user) => {
  return await axios.post(`${usersUrl}/user/addUser`, user);
};

export const deleteUser = async (id) => {
  return await axios.delete(`${usersUrl}/user/deleteUser/${id}`);
};

export const editUser = async (id, user) => {
  return await axios.post(`${usersUrl}/user/${id}`, user);
};

