import axios from "axios";

const instance = axios.create({
  // baseURL: "https://beyond-graduation.onrender.com/",
  // baseURL: "https://backend-production-a0af.up.railway.app/",
  baseURL: "http://localhost:4000/",
  //baseURL: "http://65.20.82.203:4000/",
});

export const chatInstance = axios.create({
  // baseURL:
  // "http://ec2-15-206-210-177.ap-south-1.compute.amazonaws.com:4001/api",
  baseURL: "http://65.20.82.203:4001/api",
});

export default instance;
