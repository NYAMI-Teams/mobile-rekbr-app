import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import NavigationBar from './src/components/NavigationBar';
import AccountBalance from './src/components/AccountBalance';
import QuickActions from './src/components/QuickActions';
import Onboarding from './src/screens/e-KYC/Onboarding';
import ChooseRekening from './src/screens/seller/chooseRekening';
import "./global.css"

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
      <StatusBar style="dark" />
      {/* Hapus Dari sini (TULISAN INI JANGAN DI HAPUS) */}
      <CreateRekber bankData={bankData} />
      {/* Hapus Sampai sini (TULISAN INI JANGAN DI HAPUS) */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});