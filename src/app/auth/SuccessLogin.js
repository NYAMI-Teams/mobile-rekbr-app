import Success from "../../components/Success";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function SuccessLogin() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white">
      <Success
        title="Pendaftaran Akun Selesai"
        subTitle="Kamu Seller atau bukan? Biar bisa create Rekber, jangan lupa KYC dulu, ya!"
        fromRegister={true}
      />
    </View>
  );
}
