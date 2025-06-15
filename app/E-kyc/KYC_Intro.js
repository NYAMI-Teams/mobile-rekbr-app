import { SafeAreaView } from "react-native-safe-area-context";
import Welcoming from "../../src/screens/e-KYC/Welcoming";
import { useRouter } from "expo-router";

export default function KYCIntro() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Welcoming />
    </SafeAreaView>
  );
}
