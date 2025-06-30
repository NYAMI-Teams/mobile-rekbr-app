import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        <Text style={styles.content}>{content}</Text>
        <TouchableOpacity onPress={() => handleCopy(content)}>
          <Image
            source={require("../../assets/copy.png")}
            style={styles.copyIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    marginTop: 8,
  },
  title: {
    fontSize: 15,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    fontSize: 15,
    fontWeight: "500",
  },
  copyIcon: {
    marginLeft: 4,
    width: 17,
    height: 16,
  },
});

export default CopyField;
