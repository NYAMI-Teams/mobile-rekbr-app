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