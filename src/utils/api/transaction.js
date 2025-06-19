import Api from "../api";

export const checkUser = async (email) => {
    try {
        const res = await Api.get("/user/check-user", {
            params: { email }
        });

        if (res) {
            return res;
        }
    } catch (error) {
        throw error;
    }
}

export const sellerCreateTransaction = async ({ email, itemName, itemPrice, withdrawalBankAccountId, isInsurance }) => {
    try {
        const res = await Api.post("/seller/transactions", {
            email: email,
            item_name: itemName,
            item_price: itemPrice,
            withdrawal_bank_account_id: withdrawalBankAccountId,
            isInsurance: isInsurance
        })
        return res;
    } catch (error) {
        throw error;
    }
}