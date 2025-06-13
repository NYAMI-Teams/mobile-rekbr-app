import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import NavigationBar from "./src/components/NavigationBar";
import AccountBalance from "./src/components/AccountBalance";
import QuickActions from "./src/components/QuickActions";
import Onboarding from "./src/screens/e-KYC/Onboarding";
import Success from "./src/screens/e-KYC/Success";
import Seller from "./src/screens/seller/homeScreen";
import BuyerEmptyContent from "./src/screens/buyer";
import "./global.css";
import BankScreen from "./src/screens/bank";
import TransactionSummaryScreen from "./src/screens/summary";

export default function App() {
  const bankData = {
    accountHolder: "Sdr Bayu Saptaji Rahman",
    bankName: "Bank Negara Indonesia",
    accountNumber: "0900604501",
    // Gunakan require untuk gambar lokal di React Native
    logoSrc: require("./assets/bni-logo2.png"), // Sesuaikan path sesuai lokasi gambar Anda
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* <NavigationBar /> */}
      {/* <NavigationBar onMenuPress={() => console.log('Menu pressed')} />
      <AccountBalance balance={10000000} />
      <QuickActions /> */}
      {/* <BuyerEmptyContent /> */}
      {/* <BankScreen/> */}
      <TransactionSummaryScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});