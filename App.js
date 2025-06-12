import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import NavigationBar from "./src/components/NavigationBar";
import AccountBalance from "./src/components/AccountBalance";
import QuickActions from "./src/components/QuickActions";
// import Welcoming from './src/screens/e-KYC/Welcoming';
import AttachmentFilled from "./src/components/AttachmentFilled";
import Register from "./src/screens/register";
import "./global.css";
import SellerCard from "./src/components/card-transaction/SellerCard";
import BuyerCard from "./src/components/card-transaction/BuyerCard";
import Toast from "react-native-toast-message";
import { mockAPIBuyer, mockAPISeller } from "./src/services/apiMock/api";


export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <NavigationBar />
      {/* <NavigationBar onMenuPress={() => console.log('Menu pressed')} />
      <AccountBalance balance={10000000} />
      <QuickActions /> */}
      <Seller />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
});
