import axios from "axios";

export const AxiosConfig = () => {
    axios.defaults.baseURL = 'http://localhost:3001/';
}