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

const getTypeOfRoomByArea = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getTypeOfRoomByArea', {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

const getTypeOfRoomByRoom = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getTypeOfRoomByRoom', {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const addTypeOfRoom = (body) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                '/addTypeOfRoom',
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

export const addImageOfRoom = (body) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                '/addImageOfRoom',
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

export const updateTypeOfRoom = (body = {}, params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .put('/updateTypeOfRoom', body, {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const deleteTypeOfRoom = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .delete('/deleteTypeOfRoom',{params})
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
    addTypeOfRoom,
    addImageOfRoom,
    updateTypeOfRoom,
    deleteTypeOfRoom,
    getTypeOfRoomByArea,
    getTypeOfRoomByRoom
}
