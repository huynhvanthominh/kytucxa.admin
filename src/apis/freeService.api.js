import axios from "axios"

const getListFreeService = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getListFreeService', {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};


export const addFreeService = (body) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                '/addFreeService',
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

export const updateFreeService = (body = {}, params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .put(
                '/updateFreeService',
                body, {params}
            )
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const deleteFreeservice = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .delete('/deleteFreeservice',{params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};


export const freeServiceAPI = {
    getListFreeService,
    updateFreeService,
    addFreeService,
    deleteFreeservice
}
