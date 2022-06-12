import axios from "axios";
import PATH from "../consts/path";

export const AxiosConfig = () => {
    axios.defaults.baseURL = PATH.URL_SERVER;
}