import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export const InputField = ({ title, placeholder, value = "", onChangeText = () => { } }) => {
  // Hitung jumlah kata
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

  const handleChangeText = (inputText) => {
    const words = inputText.trim().split(/\s+/).filter(Boolean);
    if (words.length <= 200) {
      onChangeText(inputText);
    }
  };

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <TextInput
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
        style={styles.input}
      />
      <Text style={styles.counter}>
        {wordCount}/200 kata
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    textAlignVertical: "top",
    marginBottom: 8,
  },
  counter: {
    textAlign: "right",
    color: "#666",
  },
});
