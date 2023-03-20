import axios from "axios";

const instance = axios.create({
  // baseURL: "https://beyond-graduation.onrender.com/",
  baseURL: "https://backend-production-a0af.up.railway.app/",
  // baseURL: "http://localhost:4000/",
});

export const chatInstance = axios.create({
  baseURL: "http://localhost:4001/api",
});

export default instance;
