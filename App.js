import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import "./global.css";
import TransaksiBuyer from "./src/components/DetailRekber/DetailTransaksiBuyer";
import TransaksiSeller from "./src/components/DetailRekber/DetailTransaksiSeller";
import { mockAPIBuyer, mockAPISeller } from "./src/services/apiMock/api";
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Hapus Dari sini (TULISAN INI JANGAN DI HAPUS) */}
      <TransaksiSeller data={mockAPISeller.data} />
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
