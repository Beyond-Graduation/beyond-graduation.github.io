import axios from "axios";

const instance = axios.create({
  // baseURL: "https://beyond-graduation.onrender.com/",
  baseURL: "http://localhost:4000/",
});

export default instance;
