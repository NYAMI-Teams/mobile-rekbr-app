import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
// import OTPScreen from "./src/screens/OTPScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import Welcoming from "./src/screens/e-KYC/Welcoming";
import Lampiran from "./src/screens/e-KYC/KYC_Lampiran";
import NavigationBar from "./src/components/NavigationBar";
import AccountBalance from "./src/components/AccountBalance";
import QuickActions from "./src/components/QuickActions";
// import Welcoming from './src/screens/e-KYC/Welcoming';
import AttachmentFilled from './src/components/AttachmentFilled';
import Register from './src/screens/register';
import "./global.css"


export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <Lampiran />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});
