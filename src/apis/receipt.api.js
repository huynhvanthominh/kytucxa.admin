import axios from "axios"

const getBillByArea = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getBillByArea', {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

const getReceiptById = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getReceiptById', {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

const addReceipt = (body) => {
    return new Promise((resolve, reject) => {
        axios
            .post('/addReceipt', body)
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

export const updateReceipt = (body = {}, params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .put('/updateReceipt', body, {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const deleteReceipt = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .delete('/deleteReceipt',{params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const receiptAPI = {
    addReceipt,
    getBillByArea,
    addArea,
    updateReceipt,
    deleteReceipt,
    getReceiptById
}
