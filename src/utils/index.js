import Toast from "react-native-toast-message";

export const showToast = (text1, text2, type) => {
    console.log(`Toast: ${text1}, ${text2}, ${type}`);
    Toast.show({
        type: type || 'success',
        text1: text1 || 'Success',
        text2: text2 || 'Operation completed successfully',
        visibilityTime: 3000,
        onPress: () => {
            Toast.hide();
        }
    });
}

// change 700000 to Rp 700.000,00
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount).replace('IDR', 'Rp');
};
