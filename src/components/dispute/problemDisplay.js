import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { ChevronLeft, ClipboardPaste, ChevronDown } from "lucide-react-native";

const ProblemDisplay = ({ image, problemType, action }) => {
  return (
    <View>
      <Text style={styles.title}>
        Masalah yang dipilih
      </Text>
      <View style={styles.problemBox}>
        <View style={styles.problemRow}>
          <Image source={image} style={styles.problemIcon} resizeMode="contain" />
          <Text style={styles.problemType}>{problemType}</Text>
        </View>
        <TouchableOpacity onPress={action}>
          <Text style={styles.changeText}>Ganti</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    marginTop: 8,
  },
  problemBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  problemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  problemIcon: {
    width: 24,
    height: 24,
  },
  problemType: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 20,
    color: "#222",
  },
  changeText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
  },
});

export default ProblemDisplay;
