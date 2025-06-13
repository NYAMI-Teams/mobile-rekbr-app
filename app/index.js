import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import OnboardingScreen from "./Onboarding/index";

export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <OnboardingScreen />
    </View>
  );
}
