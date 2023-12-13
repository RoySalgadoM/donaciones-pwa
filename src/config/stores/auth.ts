import { api } from "./axios";
import APIFactory from "../api/APIFactory";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccessAuthStore = defineStore("accessAuth", () => {
  const isValid = ref(null as Boolean | null);
  const userLogged = ref(null);
  const noAccess = ref(false as Boolean | null);

  async function setValidation() {
    try {
      let token = localStorage.getItem("token");
      let response = await APIFactory.get({
        path: "/verifyToken",
        setToken: true,
        query: {token},
      });
      isValid.value = true;
      userLogged.value = response.data.data;
    } catch (error) {
      isValid.value = false;
    }
  }

  async function logout() {
    try {
      localStorage.removeItem("token");
      userLogged.value = null;
    } catch (error) {
      throw error;
    } finally {
      isValid.value = false;
    }
  }

  const reqRecoverPassword = async (email: string) => {
    try {
      let response = await APIFactory.post({
        path: "/reqRecoverPassword",
        setToken: true,
        body: {email},
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    //States
    isValid,
    noAccess,
    userLogged,

    //Actions
    setValidation,
    logout,
    reqRecoverPassword,
  };
});

export const login = async (email: string, password: string) => {
  try {
    const { data } = await api.post("/login", { email, password });
    localStorage.setItem("token", data.data.token);
    return data;
  } catch (error) {
    throw error;
  }
};
