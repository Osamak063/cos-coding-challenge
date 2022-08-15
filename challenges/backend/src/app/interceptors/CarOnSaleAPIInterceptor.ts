import axios from "axios";

export let axiosInstance = axios.create({
    timeout: 2000,
    headers: { "accept": 'application/json' }
});

axiosInstance.interceptors.request.use(function (config) {
    if (!config?.headers) {
        throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});
