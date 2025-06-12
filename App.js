import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
// import OTPScreen from "./src/screens/OTPScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import Welcoming from "./src/screens/e-KYC/Welcoming";
import Lampiran from "./src/screens/e-KYC/KYC_Lampiran";
import NavigationBar from "./src/components/NavigationBar";
import AccountBalance from "./src/components/AccountBalance";
import QuickActions from "./src/components/QuickActions";
import Welcoming from './src/screens/e-KYC/Welcoming';
import AttachmentFilled from "./src/components/AttachmentFilled";
import Register from "./src/screens/register";
import DataDiri from "./src/screens/e-KYC/KYC_DataDiri";
import LainnyaPage from "./src/screens/e-KYC/KYC_Lainnya";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import NavigationBar from './src/components/NavigationBar';
import AccountBalance from './src/components/AccountBalance';
import QuickActions from './src/components/QuickActions';
import Onboarding from './src/screens/e-KYC/Onboarding';
import Success from './src/screens/e-KYC/Success';
import Seller from './src/screens/seller/homeScreen';

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
      {/* <Seller /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

