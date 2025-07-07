import Toast from "react-native-toast-message";

export const showToast = (text1, text2, type) => {
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

// change 2025-07-03T07:23:21.649Z to 03 July 2025, 07:23 WIB
export const formatDateToWIB = (isoString) => {
    if (!isoString || isoString === "-" || !isoString.trim()) {
        return "-";
    }
    const date = new Date(isoString);

    // Konversi ke zona waktu WIB (UTC+7)
    const options = {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    const formatted = new Intl.DateTimeFormat('en-GB', options).format(date);
    return `${formatted.replace(',', '')} WIB`;
}
