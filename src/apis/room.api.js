import axios from "axios"

const getRoomById = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getRoomById', {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

const getRoomByType = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getRoomByType', {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

const getRoomByUser= (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getRoom', {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const addRoom = (body) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                '/addRoom',
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

export const roomAPI = {
    getRoomByType,
    addRoom,
    updateArea,
    deleteArea,
    getRoomByUser,
    getRoomById
}
