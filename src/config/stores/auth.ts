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
      let response = await APIFactory.post({
        path: "/verify-token",
        setToken: true,
      });
      isValid.value = true;
      userLogged.value = response.data.data;
    } catch (error) {
      isValid.value = false;
      throw error;
    }
  }

  async function logout() {
    try {
      localStorage.removeItem("token");
      userLogged.value = null;
    } catch (error) {
      throw error;
    } finally {
      isValid.value = null;
    }
  }

  return {
    //States
    isValid,
    noAccess,
    userLogged,

    //Actions
    setValidation,
    logout,
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
