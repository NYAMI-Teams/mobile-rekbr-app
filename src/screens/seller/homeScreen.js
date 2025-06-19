import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import EmptyIllustration from "../../components/Ilustration";
import { useRouter } from "expo-router";

export default function SellerEmptyContent({ isKYCCompleted }) {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white pt-4 justify-start">
      {/* Warning Banner (jika belum KYC) */}
      {!isKYCCompleted && (
        <View className="mb-6">
          <View className="bg-[#FFF4D9] rounded-xl py-3 px-4">
            <View className="flex-row items-start">
              <Image
                source={require("../../assets/icon-warning.png")}
                className="w-5 h-5 mt-[2px] mr-2"
                resizeMode="contain"
              />
              <Text className="flex-1 text-sm text-black font-normal leading-5">
                Biar bisa lanjut bikin Rekber, kamu perlu selesain KYC dulu, ya!
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Empty Illustration + Text */}
      <View className="items-center mb-8">
        <EmptyIllustration
          text={`Kosong banget di sini...\nBikin Rekber pertama kamu, kuy!`}
        />
      </View>

      {/* CTA Button */}
      <View className="">
        <TouchableOpacity
          className="w-full py-4 rounded-xl bg-black items-center justify-center"
          onPress={() => {
            if (!isKYCCompleted) {
              router.push("E-kyc/KYC_Intro");
            } else {
              router.push("CreateTransaksi/CreateRekening/ChooseRekening");
            }
          }}>
          <Text className="text-white text-base font-semibold">
            {isKYCCompleted
              ? "Bikin Rekbr Baru"
              : "Lengkapi KYC & Bikin Rekber"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
