import { useRouter } from "expo-router";
import OTPScreen from "../../src/screens/OTPScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OTP() {
  const router = useRouter();
  return <OTPScreen />;
}
