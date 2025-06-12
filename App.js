import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import NavigationBar from "./src/components/NavigationBar";
import AccountBalance from "./src/components/AccountBalance";
import QuickActions from "./src/components/QuickActions";
// import Welcoming from './src/screens/e-KYC/Welcoming';
import AttachmentFilled from "./src/components/AttachmentFilled";
// import Register from './src/screens/register';
import "./global.css";
import BuyerPopup from "./src/screens/buyerpopup";
// import BuyerSucces from "./src/screens/buyersucces";

export default function App() {
  return (
    <View style={styles.container}>
      <BuyerPopup />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});
