import { View, Text, Image } from "react-native";

export default function RekeningKamu({ bankData }) {
  return (
    <View className="flex flex-col items-center gap-4 py-0 relative self-stretch w-full">
      {/* Bank Account Section */}
      <View className="gap-2 self-stretch w-full flex flex-col items-start relative">
        <Text className="text-[15px] text-black font-normal mb-2">
          Rekening Kamu
        </Text>

        <View className="bg-[#EDFBFA] rounded-lg px-4 py-2 flex flex-col gap-2 justify-between w-full">
          <View className="flex flex-col items-start gap-2 w-full">
            <Text className="text-neutral-950 text-[15px] font-medium whitespace-nowrap">
              {bankData?.accountHolderName}
            </Text>
          </View>

          <View className="flex-row items-center gap-2 w-full">
            {/* Logo Bank */}
            <View className="items-center justify-center px-2 py-2">
              <Image
                style={{ width: 40, height: 40, resizeMode: "contain" }}
                source={{ uri: bankData?.bank?.logoUrl }}
              />
            </View>

            {/* Info Bank */}
            <View className="flex-1 items-start justify-center gap-1">
              <Text
                className="text-neutral-950 text-[14px] font-normal"
                numberOfLines={1}>
                {bankData?.bank?.bankName || "-"}
              </Text>
              <Text
                className="text-neutral-950 text-[14px] font-normal"
                numberOfLines={1}>
                {bankData?.accountNumber || "-"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
