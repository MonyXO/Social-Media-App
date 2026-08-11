import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
    baseURL: "http://10.0.0.20/api", // Server IP - need to test
    // Check this below later
    headers: {
        "Content-Type": "application/json",
    },
});

// This will attach the stored token to requests
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api;
