import axios from "axios";

const api = axios.create({
  baseURL: "https://b967hfr3-3000.usw3.devtunnels.ms/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export { api };
