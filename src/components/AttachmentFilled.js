import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";

const AttachmentFilled = ({ title, caption, iconName, alertText }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.card}>
        <Text style={styles.caption}>{caption}</Text>
        <View style={styles.iconWrapper}>
          <AntDesign name={iconName} size={24} color="#FFF" />
        </View>
      </View>

      <View style={styles.alertContainer}>
        <Ionicons name="alert-circle" size={20} color="#C2C2C2" />
        <Text style={styles.alertText}>{alertText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  title: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  card: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  caption: {
    color: "#9E9E9E",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  iconWrapper: {
    backgroundColor: "#49DBC8",
    borderRadius: 8,
    padding: 8,
  },
  alertContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  alertText: {
    marginLeft: 5,
    color: "#616161",
    fontSize: 16,
    flex: 1,
  },
});

export default AttachmentFilled;
