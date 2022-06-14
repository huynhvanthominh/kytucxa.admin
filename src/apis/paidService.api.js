import axios from "axios"

const getListPaidService = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getListPaidService', {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

const getListArea = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getListArea', {params})
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

export const updateArea = (body = {}, params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .put('/updateArea', body, {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const deleteArea = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .delete('/deleteArea',{params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const paidServiceAPI = {
    getListPaidService,
    getListArea,
    addArea,
    updateArea,
    deleteArea
}
