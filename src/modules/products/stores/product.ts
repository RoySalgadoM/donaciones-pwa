import { defineStore} from "pinia";
import { ref,  } from "vue";
import APIFactory from "../../../config/api/APIFactory";

export const useProductsStore = defineStore("products", () => {
  //states
  const products = ref([])
  const pagination = ref({})

  const addProduct = async (payload) => {
    try {
      let response = await APIFactory.post({
        path: "/products",
        setToken: true,
        body: payload.body,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateProduct = async (payload) => {
    try {
      let response = await APIFactory.put({
        path: `/products/${payload.id}`,
        setToken: true,
        body: payload.body,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  const changeStatus = async (id, status) => {
    try {
      let response = await APIFactory.patch({
        path: `/products/${id}`,
        setToken: true,
        body: {
          status
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  const getProducts = async (payload) => {
    try {
      let query = payload.query;
      let response = await APIFactory.get({
        path: "/products",
        setToken: true,
        query
      });
      products.value = response.data.data.products;
      pagination.value = {
        totalDocs: response.data.total,
        limit: payload.query.limit || 0,
        page: payload.query.page || 1,
      }
      return response.data.data;
    } catch (error) {
      throw error; 
    }
  }

  return {
    products,
    pagination,
    getProducts,
    addProduct,
    updateProduct,
    changeStatus
  };
});
