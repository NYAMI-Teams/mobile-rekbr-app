import { useRouter } from "expo-router";
import OTPScreen from "../../screens/OTPScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OTP() {
  const router = useRouter();
  return <OTPScreen />;
}
