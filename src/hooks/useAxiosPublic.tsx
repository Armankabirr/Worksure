import axios, { AxiosInstance } from "axios";

const axiosPublic: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

const useAxiosPublic = (): AxiosInstance => {
    return axiosPublic;
};

export default useAxiosPublic;