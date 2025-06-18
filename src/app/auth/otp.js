import { useLocalSearchParams } from "expo-router";
import OTPScreen from "../../screens/OTPScreen";

export default function OTP() {
  const { email } = useLocalSearchParams();
  return <OTPScreen email={email}/>;
}
