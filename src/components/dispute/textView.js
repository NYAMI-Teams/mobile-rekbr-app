import { View, Text, TouchableOpacity, Image } from "react-native";

// Komponen utama
const TextView = ({ title, content }) => {
  return (
    <View className="flex-col justify-center gap-2 p-3 mt-2">
      <Text className="text-[15px]">{title}</Text>
      <View className="flex-row items-center">
        <Text className="text-[15px] font-medium">{content}</Text>
      </View>
    </View>
  );
};

export default TextView;
