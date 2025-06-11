import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import OTPScreen from "./src/screens/OTPScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <OTPScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});
