import axios from "axios"

const getRoomAdmin = async() => {
    return await axios.get("/getRoomAdmin");
}

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

const getTroubleById= (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .get('/getTroubleById', {params})
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

export const updateRoom = (body = {}, params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .put('/updateRoom', body, {params})
            .then(function(response) {
                return resolve(response.data);
            })
            .catch(function(error) {
                return reject(error);
            });
    });
};

export const deleteRoom = (params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .delete('/deleteRoom',{params})
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
    getRoomAdmin,
    addRoom,
    updateRoom,
    getRoomByUser,
    getRoomById,
    deleteRoom,
    getTroubleById
}
