import { defineStore } from "pinia";
import { ref } from "vue";
import APIFactory from "../../../config/api/APIFactory";

export const useProfileStore = defineStore("profile", () => {

    const getProfile = async () => {
        try {
        let response = await APIFactory.get({
            path: "/users/profile",
            setToken: true,
        });
        return response.data.data;
        } catch (error) {
        throw error;
        }
    };

    const changePassword = async (payload) => {
        try {
        let response = await APIFactory.post({
            path: "/changePassword",
            setToken: true,
            body: payload.body,
        });
        return response;
        } catch (error) {
        throw error;
        }
    }
    
    return {
        getProfile,
        changePassword
    };
});