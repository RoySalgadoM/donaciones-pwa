import axios from "axios";

const api = axios.create({
  baseURL: "https://donaciones-api.ddns.net/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export { api };
