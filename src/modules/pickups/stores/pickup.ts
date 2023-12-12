import { defineStore } from "pinia";
import { ref } from "vue";
import APIFactory from "../../../config/api/APIFactory";

export const usePickupsStore = defineStore("pickup", () => {
  const pickups = ref([]);
  const pagination = ref({});

  const addPickup = async (payload) => {
    try {
      let response = await APIFactory.post({
        path: "/pickups",
        setToken: true,
        body: payload.body,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updatePickup = async (payload) => {
    try {
      let response = await APIFactory.put({
        path: `/pickups/${payload.id}`,
        setToken: true,
        body: payload.body,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const cancelPickup = async (payload) => {
    try {
      let response = await APIFactory.patch({
        path: `/pickups/cancel/${payload.id}`,
        setToken: true,
        body: payload.body
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getPickups = async (payload) => {
    try {
      let query = payload.query;
      let response = await APIFactory.get({
        path: "/pickups",
        setToken: true,
        query,
      });
      pickups.value = response.data.data.pickups;
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

  return {
    pickups,
    pagination,
    addPickup,
    updatePickup,
    cancelPickup,
    getPickups,
  };
});
