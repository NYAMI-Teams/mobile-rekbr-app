import { View, Text, TouchableOpacity, Image } from "react-native";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";

// Fungsi salin teks ke clipboard
const handleCopy = async (text) => {
  if (!text) return;
  try {
    await Clipboard.setStringAsync(text);
    Toast.show({
      type: "success",
      text1: "Berhasil",
      text2: "Disalin ke clipboard",
      position: "bottom",
    });
    console.log("Copied to clipboard:", text);
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Gagal",
      text2: "Tidak dapat menyalin",
      position: "bottom",
    });
    console.log("Failed to copy to clipboard:", error);
  }
};

// Komponen utama
const CopyField = ({ title, content }) => {
  return (
    <View className="flex-col justify-center gap-2 mx-3 p-3">
      <Text className="text-[15px]">{title}</Text>
      <View className="flex-row items-center">
        <Text className="text-[15px] font-medium">{content}</Text>
        <TouchableOpacity onPress={() => handleCopy(content)}>
          <Image
            source={require("../../assets/copy.png")}
            style={{ marginLeft: 4, width: 17, height: 16 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CopyField;
