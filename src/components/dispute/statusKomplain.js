import { View, Text, Image, StyleSheet } from "react-native";

export const StatusKomplain = ({ status }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Status Komplain : </Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 24,
    alignItems: "center",
  },
  label: {
    color: "#000",
    fontSize: 15,
  },
  status: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 15,
  },
});
