import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import NavigationBar from './src/components/NavigationBar';
import AccountBalance from './src/components/AccountBalance';
import QuickActions from './src/components/QuickActions';
import Onboarding from './src/screens/e-KYC/Onboarding';
import Success from './src/screens/e-KYC/Success';
import Seller from './src/screens/seller/homeScreen';
import BuyerEmptyContent from './src/screens/buyer';
import "./global.css"

import "./global.css";
import Pratinjau from "./src/screens/e-KYC/KYC_Pratinjau";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* <Welcoming /> */}
      {/* <DataDiri /> */}
      {/* <LainnyaPage /> */}
      {/* <Lampiran /> */}
      {/* <Pratinjau /> */}
      {/* <NavigationBar onMenuPress={() => console.log('Menu pressed')} />
      <AccountBalance balance={10000000} />
      <QuickActions /> */}
      <BuyerEmptyContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});
