import axios from "axios";

const api = axios.create({
  baseURL: "http://52.70.89.161:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export { api };
