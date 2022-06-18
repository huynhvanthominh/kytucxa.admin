import axios from "axios"
const path = "/trouble-material/"

export const get = async () => {
    return await axios.get(path)
}

export const getOne = async (id) => {
    return await axios.get(path + id)
}

export const create = async (trouble) => {
    return await axios.post(path, trouble)
}

export const troubleMaterialAPI = {
    get,
    getOne,
    create
}