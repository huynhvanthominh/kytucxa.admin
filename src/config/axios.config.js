import axios from "axios";

export const AxiosConfig = () => {
    axios.defaults.baseURL = 'http://192.168.1.10:3001/';
}