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
      <StatusBar style="dark" />
      {/* Hapus Dari sini (TULISAN INI JANGAN DI HAPUS) */}
      <View className="gap-4">
        <Text>Ini Buyer Section</Text>
        <BuyerCard data={mockAPIBuyer.data} />
        <Text>Ini Seller Section</Text>
        <SellerCard data={mockAPISeller.data} />
      </View>
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
