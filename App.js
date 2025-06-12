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
import SellerCard from "./src/components/card-transaction/SellerCard";
import BuyerCard from "./src/components/card-transaction/BuyerCard";
import Toast from "react-native-toast-message";
import { mockAPIBuyer, mockAPISeller } from "./src/services/apiMock/api";
import History from "./src/screens/history";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Hapus Dari sini (TULISAN INI JANGAN DI HAPUS) */}
      <View className="gap-4">
        <History />
      </View>
      {/* Hapus Sampai sini (TULISAN INI JANGAN DI HAPUS) */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
