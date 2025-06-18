import { View, Text, TextInput } from "react-native";

export const InputField = ({ title, placeholder }) => {
  return (
    <View>
      <Text className="text-sm font-semibold text-black mb-2">
        {title}
      </Text>
      <TextInput
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
          marginBottom: 24,
        }}
      />
    </View>
  );
};

