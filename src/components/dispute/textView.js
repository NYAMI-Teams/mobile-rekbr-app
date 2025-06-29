import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

// Komponen utama
const TextView = ({ title, content }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        <Text style={styles.content}>{content}</Text>
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
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    fontSize: 15,
    fontWeight: "500",
  },
});

export default TextView;
