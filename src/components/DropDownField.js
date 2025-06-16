import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DropDownField = ({
  title,
  placeholder,
  value,
  onChangeText,
  iconName = "chevron-down",
  iconColor = "#999",
  secureTextEntry = false,
  keyboardType = "default",
  editable = true,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          editable={editable}
        />
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // marginHorizontal: 20,
  },
  title: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
});

export default DropDownField;
