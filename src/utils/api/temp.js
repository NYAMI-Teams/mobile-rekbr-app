import Api from "../api";

export const temp = async () => {
    try {
        const res = await Api.get(`/temp`);

        if (res) {
            return res;
        }
    } catch (error) {
        throw error;
    }
}

export const tempPost = async (data) => {
    try {
        const res = await Api.post(`/temp`, data);
        if (res) {
            return res;
        }
    } catch (error) {
        throw error;
    }
}

export const tempPut = async (data) => {
    try {
        const res = await Api.put(`/temp`, data);
        if (res) {
            return res;
        }
    } catch (error) {
        throw error;
    }
}

export const tempDelete = async (id) => {
    try {
        const res = await Api.delete(`/temp/${id}`);
        if (res) {
            return res;
        }
    } catch (error) {
        throw error;
    }
}