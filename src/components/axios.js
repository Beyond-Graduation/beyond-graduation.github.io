import axios from "axios";

const instance = axios.create({
  // baseURL: "https://alumni-tracker-cet.herokuapp.com/",
  baseURL: "http://localhost:4000/",
});

export default instance;
