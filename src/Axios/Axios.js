import axios from 'axios';
import store from 'store';

const getToken = () => {
    const data = store.get('token');
    if (data) {
        if (data.expiresAt < Date.now()) {
            store.remove('token');
            return null;
        }
        return data.token;
    }
    return null;
};

export const post = async (url, payload, res) => {
    try {
        const response = await axios.post(`http://localhost:800/${url}`, payload, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        res(response.data);
        return response;
    } catch (error) {
        alert(error.message);
        res(error);
        return error;
    }
};

export const get = async (url, res, q) => {
    try {
        const response = await axios.get(`http://localhost:800/${url}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            params: q
        });
        res(response.data);
        return response;
    } catch (error) {
        alert(error.message);
        res(error);
        return error;
    }
};
