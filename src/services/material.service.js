import axios from "axios"
import { formatFilter } from "../helps/formatFilter";

const path = "/material/"

const get = async (filter = {}) => {
    const query = formatFilter(filter);
    return await axios.get(path + "?" + query);
}

const getByIdLoaivatchat = async (idLoaivatchat) => await axios.get(path + "material-type/" + idLoaivatchat)

const add = async (material) => await axios.post(path, material)

const _delete = async (id) => await axios.delete(path + id)

export const materialService = {
    get,
    getByIdLoaivatchat,
    add,
    delete: _delete
}