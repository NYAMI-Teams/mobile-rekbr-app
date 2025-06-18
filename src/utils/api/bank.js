import Api from "../api";

export const checkAccountBank = async (email, password) => {
    try {
        const res = await Api.get(`/bank/account`, {
            params: {
                account_number,
                bank_id,
            }
        });
        if (res) {
            return res;
        }
    } catch (error) {
        throw error;
    }
}

export const saveAccountBank = async (bankId, accountNumber, accountName) => {
    console.log(bankId, "==========>");
    try {
        const res = await Api.post(`/bank/account`, {
            bank_id: bankId,
            account_number: accountNumber,
            account_holder_name: accountName
        });
        if (res) {
            return res;
        }
    } catch (error) {
        throw error;
    }
}