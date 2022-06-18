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

const addReceipt = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .post('/addReceipt', {params})
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

export const receiptAPI = {
    addReceipt,
    getBillByArea,
    addArea,
    updateBill,
    deleteBill
}
