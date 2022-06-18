import axios from "axios"

const getContractByArea = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getContractByArea', {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

const getContractById = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getContractById', {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};
const getUserByBookTicket = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getUserByBookTicket', {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const addContract = (body) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                '/addContract',
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

export const updateContract = (body = {}, params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .put('/updateContract', body, {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const deleteContract = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .delete('/deleteContract',{params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const contractAPI = {
    getContractByArea,
    addContract,
    updateContract,
    deleteContract,
    getUserByBookTicket,
    getContractById
}
