import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";

export const InputField = ({ title, placeholder }) => {
  const [text, setText] = useState("");

  const handleChangeText = (inputText) => {
    // Hitung jumlah kata
    const words = inputText.trim().split(/\s+/).filter(Boolean);

    // Jika jumlah kata <= 200, simpan teksnya
    if (words.length <= 200) {
      setText(inputText);
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <View>
      <Text className="text-sm font-semibold text-black mb-2">{title}</Text>
      <TextInput
        value={text}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#E0E0E0",
          borderRadius: 12,
          padding: 12,
          fontSize: 14,
          textAlignVertical: "top",
          marginBottom: 8,
        }}
      />
      <Text style={{ textAlign: "right", color: "#666" }}>
        {wordCount}/200 kata
      </Text>
    </View>
  );
};
