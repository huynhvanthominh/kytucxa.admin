import axios from "axios"

const getBillById = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getBillById', {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

const addBill = (body) => {
    return new Promise((resolve, reject) => {
        axios
            .post('/addBill',
            body)
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const addArea = (body) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                '/addArea',
                body
            )
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const updateBill = (body = {}, params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .put('/updateBill', body, {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const deleteBill = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .delete('/deleteBill',{params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const billAPI = {
    addBill,
    getBillById,
    addArea,
    updateBill,
    deleteBill
}
