import axios from "axios"
import { formatFilter } from "../helps/formatFilter";

const path = "/material/"

const get = async (filter = {}) => {
    const query = formatFilter(filter);
    return await axios.get(path + "?" + query);
}
const getById = async (id) => {
    return await axios.get(path + id)
}

const getDetailMaterialById = async (id) => await axios.get(path + "detail-material/view/" + id);

const getDetailMaterial = async (id) => await axios.get(path + "detail-material/" + id);

const getStatus = async () => await axios.get(path + "status");

const getByIdLoaivatchat = async (idLoaivatchat) => await axios.get(path + "material-type/" + idLoaivatchat)

const add = async (material) => await axios.post(path, material)

const addDetailMaterial = async (detailMaterial) => await axios.post(path + "detail-material", detailMaterial);

const update = async (material) => await axios.patch(path, material);

const _delete = async (id) => await axios.delete(path + id)

export const materialService = {
    get,
    getById,
    getByIdLoaivatchat,
    getDetailMaterialById,
    getDetailMaterial,
    getStatus,
    add,
    addDetailMaterial,
    update,
    delete: _delete
}