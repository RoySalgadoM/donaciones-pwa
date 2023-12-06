import { defineStore } from "pinia";
import { ref } from "vue";
import APIFactory from "../../../config/api/APIFactory";

export const useUsersStore = defineStore("users", () => {
  //states
  const users = ref([]);
  const pagination = ref({});

  const addUser = async (payload) => {
    try {
      let response = await APIFactory.post({
        path: "/users",
        setToken: true,
        body: payload.body,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (payload) => {
    try {
      let response = await APIFactory.put({
        path: `/users/${payload.id}`,
        setToken: true,
        body: payload.body,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  const getUsers = async (payload) => {
    try {
      let query = payload.query;
      let response = await APIFactory.get({
        path: "/users",
        setToken: true,
        query,
      });
      users.value = response.data.data.users;
      pagination.value = {
        totalDocs: response.data.total,
        limit: payload.query.limit || 0,
        page: payload.query.page || 1,
      };
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const changeStatus = async (id, status) => {
    try {
      let response = await APIFactory.patch({
        path: `/users/${id}`,
        setToken: true,
        body: {
          status,
        },
      }); 
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    users,
    pagination,
    getUsers,
    addUser,
    changeStatus,
    updateUser
  };
});
