import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { icons } from "lucide-react-native";

const AttachmentFilled = ({
  title = "",
  caption = "",
  cardColor = "#FFF",
  captionColor = "#9E9E9E",
  iconName = "camera",
  boxColor = "#49DBC8",
  alertText = "",
  alertColor = "#C2C2C2",
  alertIconName = "alert-circle",
  alertIconColor = "#C2C2C2",
  onPress,
  iconsColor,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: cardColor }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={[styles.caption, { color: captionColor }]}>{caption}</Text>
        <View style={[styles.iconWrapper, { backgroundColor: boxColor }]}>
          <Ionicons name={iconName} size={24} color={iconsColor} />
        </View>
      </TouchableOpacity>

      <View style={styles.alertContainer}>
        <Ionicons name={alertIconName} size={20} color={alertIconColor} />
        <Text style={[styles.alertText, { color: alertColor }]}>
          {alertText}
        </Text>
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
    fontSize: 16,
    flex: 1,
  },
});

export default AttachmentFilled;
