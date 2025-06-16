import Success from "../../components/Success";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SuccessLogin() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Success
        title="Pendaftaran Akun Selesai"
        subTitle="Kamu Seller atau bukan? Biar bisa create Rekber, jangan lupa KYC dulu, ya!"
        fromRegister={true}
      />
    </SafeAreaView>
  );
}
