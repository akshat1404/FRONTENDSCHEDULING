import axios from 'axios';

export const post = async (url, payload,res) => {

    try {
        const response = await axios.post(`http://localhost:800/${url}`, payload);
        res(response.data);
        return response;
    } catch (error) {   
        alert(error.message);
        res(error);
        return error;
    }
}

export const get = async (url,res,q) => {
    try {
        const response = await axios.get(`http://localhost:800/${url}`,{params:q});
        res(response.data);
        return response;
    } catch (error) {   
        alert(error.message);
        res(error);
        return error;
    }
}
