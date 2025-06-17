import { View, Text, Image } from "react-native";

export default function RekeningKamu({ bankData }) {
  return (
    <View className="flex flex-col items-center gap-4 py-0 relative self-stretch w-full">
      {/* Bank Account Section */}
      <View className="gap-2 self-stretch w-full flex flex-col items-start relative">
        <Text className="text-[15px] text-black font-normal mb-2">
          Rekening Kamu
        </Text>

        <View className="w-full bg-[#EDFBFA] rounded-lg h-[86px]">
          <View className="p-4 flex flex-col gap-2 justify-between w-full h-[86px]">
            <View className="flex flex-col items-start gap-2 w-full">
              <Text className="text-neutral-950 text-[15px] font-medium whitespace-nowrap">
                {bankData.accountHolderName}
              </Text>
            </View>

            <View className="flex-row items-center justify-start gap-2 w-full">
              <View className="flex items-center justify-center px-2 py-2 bg-[#EDFBFA]">
                <Image
                  className="w-10 h-4 object-contain"
                  source={{ uri: bankData.logoUrl }}
                />
              </View>

              <View className="items-start justify-center gap-1">
                <Text className="text-neutral-950 text-[14px] font-normal">
                  {bankData.detailBank.bankName}
                </Text>

                <Text className="self-stretch text-neutral-950 text-[14px] font-normal">
                  {bankData.accountNumber}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
