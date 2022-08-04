import axios from "axios";

const instance = axios.create({
  baseURL: "https://alumni-tracker-cet.herokuapp.com/",
});

export default instance;
