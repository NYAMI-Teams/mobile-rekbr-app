import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import "./global.css";
import Transaksi from "./src/components/DetailRekber/TransactionPage";
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Hapus Dari sini (TULISAN INI JANGAN DI HAPUS) */}
      <Transaksi />
      {/* Hapus Sampai sini (TULISAN INI JANGAN DI HAPUS) */}
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
