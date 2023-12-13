import { defineStore } from "pinia";
import { ref } from "vue";
import APIFactory from "../../../config/api/APIFactory";

export const useNeighborhoodStore = defineStore("neighborhood", () => {
  //states
  const neighborhoods = ref([]);

  const addNeighborhood = async (payload) => {
    try {
      let response = await APIFactory.post({
        path: "/neighborhoods",
        setToken: true,
        body: payload.body,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getNeighborhoods = async (payload) => {
    try {
      let query = payload.query;
      let response = await APIFactory.get({
        path: "/neighborhoods",
        setToken: true,
        query,
      });
      neighborhoods.value = response.data.data.neighborhoods;
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const updateNeighborhood = async (payload) => {
    try {
      let response = await APIFactory.put({
        path: `/neighborhoods/${payload.id}`,
        setToken: true,
        body: payload.body,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const changeStatus = async (id, status) => {
    try {
      let response = await APIFactory.patch({
        path: `/neighborhoods/${id}`,
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
    neighborhoods,
    addNeighborhood,
    getNeighborhoods,
    updateNeighborhood,
    changeStatus,
  };
});
