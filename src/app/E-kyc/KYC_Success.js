import Success from "../../components/Success";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SuccessKYC() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white">
      <Success
        title="Pendaftaran KYC Selesai"
        subTitle="Kamu sudah siap untuk mulai transaksi! Sekarang kamu bisa menikmati pengalaman transaksi rekber yang lebih aman dan nyaman."
        fromRegister={false}
      />
    </View>
  );
}
