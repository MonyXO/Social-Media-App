import axios from "axios";

export default axios.create({
    baseURL: "http://10.0.0.55:5000", // Server IP - need to test
    // Check this below later
    headers: {
        "Content-Type": "application/json",
    },
});