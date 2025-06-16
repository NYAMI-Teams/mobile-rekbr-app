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