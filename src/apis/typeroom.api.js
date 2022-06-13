import axios from "axios"

const getAreaById = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getAreaById', {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

const getListTypeofroom = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getListTypeofroom', {params})
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

export const typeOfRoomAPI = {
    getListTypeofroom,
    getAreaById,
    addArea,
    updateArea,
    deleteArea
}
