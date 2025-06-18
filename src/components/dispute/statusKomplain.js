import { View, Text, Image } from "react-native";

export const StatusKomplain = ({ status}) => {
  return (
    <View className="flex-row justify-between px-4 mt-6">
      <Text className="text-black text-[15px]">Status Komplain : </Text>
      <Text className="text-black font-bold">{status}</Text>
    </View>
  );
};
