import { defineStore } from "pinia";
import { ref } from "vue";
import APIFactory from "../../../config/api/APIFactory";

export const useDeliveryStore = defineStore("delivery", () => {
  const deliveries = ref([]);
  const pagination = ref({});

  const addDelivery = async (payload) => {
    try {
      let response = await APIFactory.post({
        path: "/delivery",
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
        path: `/delivery/${payload.id}`,
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
        path: `/delivery/cancel/${payload.id}`,
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
        path: "/delivery",
        setToken: true,
        query,
      });
      deliveries.value = response.data.data.deliveries;
      pagination.value = {
        totalDocs: response.data.total,
        limit: payload.query.limit || 0,
        page: payload.query.page || 1,
        totalPages: response.data.pages,
        pagingCounter: response.data.page,
        hasPrevPage: response.data.hasPrevPage,
        hasNextPage: response.data.hasNextPage,
        prevPage: response.data.prevPage,
        nextPage: response.data.nextPage,
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
