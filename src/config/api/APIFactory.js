import { api } from "@/config/stores/axios";
import { transformToParamsString } from "../../utils/utils";
export default {
  async get(payload) {
    var config = {
      headers: { ...payload.headers },
    };
    if (payload.setToken) {
      config.headers["Authorization"] = `Bearer ${localStorage.getItem(
        "token"
      )}`;
    }
    let { query } = payload;
    query = transformToParamsString(query);
    return new Promise((resolve, reject) => {
      api
        .get(`${payload.path}${query}`, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  async post(payload) {
    var config = {
      headers: { ...payload.headers },
    };
    if (payload.setToken) {
      config.headers["Authorization"] = `Bearer ${localStorage.getItem(
        "token"
      )}`;
    }
    let { query } = payload;
    query = transformToParamsString(query);
    return new Promise((resolve, reject) => {
      api
        .post(`${payload.path}${query}`, payload.body, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  async getFile(payload) {
    var config = { responseType: "arraybuffer" };
    if (payload.setToken) {
      config.headers = {};
      config.headers["Authorization"] = `Bearer ${localStorage.getItem(
        "token"
      )}`;
    }
    let { query } = payload;
    query = transformToParamsString(query);
    return new Promise((resolve, reject) => {
      api
        .get(`${payload.path}${query}`, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  async getFilePost(payload) {
    var config = { responseType: "arraybuffer" };
    if (payload.setToken) {
      config.headers = {};
      config.headers["Authorization"] = `Bearer ${localStorage.getItem(
        "token"
      )}`;
    }
    let { query } = payload;
    query = transformToParamsString(query);
    return new Promise((resolve, reject) => {
      api
        .post(`${payload.path}${query}`, payload.body, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  async delete(payload) {
    var config = {
      headers: { ...payload.headers },
    };
    if (payload.setToken) {
      config.headers["Authorization"] = `Bearer ${localStorage.getItem(
        "token"
      )}`;
    }
    let { query } = payload;
    query = transformToParamsString(query);
    return new Promise((resolve, reject) => {
      api
        .delete(`${payload.path}${query}`, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  async patch (payload) {
    var config = {
      headers: { ...payload.headers },
    };
    if (payload.setToken) {
      config.headers["Authorization"] = `Bearer ${localStorage.getItem(
        "token"
      )}`;
    }
    let { query } = payload;
    query = transformToParamsString(query);
    return new Promise((resolve, reject) => {
      api
        .patch(`${payload.path}${query}`, payload.body, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  async put(payload) {
    var config = {
      headers: { ...payload.headers },
    };
    if (payload.setToken) {
      config.headers["Authorization"] = `Bearer ${localStorage.getItem(
        "token"
      )}`;
    }
    let { query } = payload;
    query = transformToParamsString(query);
    return new Promise((resolve, reject) => {
      api
        .put(`${payload.path}${query}`, payload.body, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
};
