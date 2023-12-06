import { defineStore } from "pinia";
import { ref } from "vue";
import APIFactory from "../../../config/api/APIFactory";

export const useStoresStore = defineStore("stores", () => {
  //states
  const stores = ref([]);
  const pagination = ref({});

  const addStore = async (payload) => {
    try {
      let response = await APIFactory.post({
        path: "/chains",
        setToken: true,
        body: payload.body,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getStores = async (payload) => {
    try {
      let query = payload.query;
      let response = await APIFactory.get({
        path: "/chains",
        setToken: true,
        query,
      });
      stores.value = response.data.data.chains;
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const updateStore = async (payload) => {
    try {
      let response = await APIFactory.put({
        path: `/chains/${payload.id}`,
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
        path: `/chains/${id}`,
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
    stores,
    pagination,
    addStore,
    updateStore,
    getStores,
    changeStatus,
  };
});
