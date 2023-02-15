import axios from "axios";

const instance = axios.create({
    baseURL: "https://beyond-graduation.onrender.com/",
});

export default instance;
