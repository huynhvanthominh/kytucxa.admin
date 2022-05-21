import axios from "axios"

const path = "/material-type/"

const get = async () => await axios.get(path)

const add = async (payload) => await axios.post(path, payload)

const update = async (materialType) => axios.patch(path + materialType?.idLoaivatchat, materialType)

const _delete = async (id) => await axios.delete(path + id)

const getById = async (id) => await axios.get(path + id);

export const materialTypeService = {
    get,
    getById,
    add,
    update,
    delete: _delete,
}