import axios from "axios";

const api = axios.create({
  baseURL: "http://donaciones.ddns.net:3000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export { api };
