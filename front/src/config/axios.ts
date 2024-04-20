import * as axios from "axios";
export const BASE_URL = "http://localhost:8080";

export const API = axios.default.create({
    baseURL: BASE_URL,
});

API.defaults.headers.post["Content-Type"] = "application/json";


