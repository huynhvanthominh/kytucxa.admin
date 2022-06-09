import axios from "axios"
const path = "/bill-material/"

const getAllAdmin = async () => await axios.get(path);

const create = async (bill) => {
    return axios.post(path, bill)
}

const createDetailBill = async (detailBill) => {
    return axios.post(path + "detail-bill-material/", detailBill)
}

export const billMaterialAPI = {
    getAllAdmin,
    create,
    createDetailBill
}
