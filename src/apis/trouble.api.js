import axios from "axios"

const getTrouble = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getTroubleByUser', {params})
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

export const addTrouble = (body) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                '/addTrouble',
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

export const updateTrouble = (body = {}, params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .put('/updateTrouble', body, {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const deleteTrouble = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .delete('/deleteTrouble',{params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const troubleAPI = {
    getListArea,
    getTrouble,
    addTrouble,
    updateTrouble,
    deleteTrouble
}
