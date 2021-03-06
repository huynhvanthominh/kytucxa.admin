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

export const addPaidService = (body) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                '/addPaidService',
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

export const updatePaidService = (body = {}, params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .put(
                '/updatePaidService',
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

export const deletePaidservice = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .delete('/deletePaidservice',{params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const addPriceofservice = (body) => {
    return new Promise((resolve, reject) => {
        axios
            .post('/addPriceofservice',
                    body)
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
    addPaidService,
    deletePaidservice,
    updatePaidService,
    addPriceofservice
}
