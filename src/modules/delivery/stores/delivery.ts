import { defineStore } from "pinia";
import { ref } from "vue";
import APIFactory from "../../../config/api/APIFactory";

export const useDeliveryStore = defineStore("delivery", () => {
  const deliveries = ref([]);
  const pagination = ref({});

  const addDelivery = async (payload) => {
    try {
      let response = await APIFactory.post({
        path: "/deliveries",
        setToken: true,
        body: payload.body,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateDelivery = async (payload) => {
    try {
      let response = await APIFactory.put({
        path: `/deliveries/${payload.id}`,
        setToken: true,
        body: payload.body,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const cancelDelivery = async (payload) => {
    try {
      let response = await APIFactory.patch({
        path: `/deliveries/cancel/${payload.id}`,
        setToken: true,
        body: payload.body,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getDeliveries = async (payload) => {
    try {
      let query = payload.query;
      let response = await APIFactory.get({
        path: "/deliveries",
        setToken: true,
        query,
      });
      deliveries.value = response.data.data.deliveries;
      pagination.value = {
        totalDocs: response.data.total,
        limit: payload.query.limit || 0,
        page: payload.query.page || 1,
      };
    } catch (error) {
      throw error;
    }
  };

  return {
    deliveries,
    pagination,
    addDelivery,
    updateDelivery,
    cancelDelivery,
    getDeliveries,
  };
});
