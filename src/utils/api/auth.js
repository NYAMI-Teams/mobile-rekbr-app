import Api from "../api";

export const login = async (email, password) => {
    try {
        const res = await Api.post(`/user/login`, {
            email,
            password,
        });
        if (res) {
            return res;
        }
    } catch (error) {
        throw error;
    }
}

export const register = async (email, password) => {
    try {
        const res = await Api.post(`/user/register`, {
            email,
            password,
        });
        if (res) {
            return res;
        }
    } catch (error) {
        throw error;
    }
}

export const verifyEmail = async (email, otpCode) => {
    try {
        const res = await Api.post(`/user/verify-email`, {
            email,
            otpCode,
        });
        if (res) {
            return res;
        }
    } catch (error) {
        throw error;
    }
}

export const verifyKyc = async () => {
    try {
        const res = await Api.post(`/user/verify-kyc`);
        if (res) {
            return res;
        }
    } catch (error) {
        throw error;
    }
}

export const getProfile = async () => {
    try {
        const res = await Api.get(`/user/profile`);
        if (res) {
            return res;
        }
    } catch (error) {
        throw error;
    }
}


