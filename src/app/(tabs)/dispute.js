import { View } from "react-native";
import NavigationBar from "../../components/NavigationBar";
import AccountBalance from "../../components/AccountBalance";
import QuickActions from "../../components/QuickActions";
import Dispute from "../dispute";

export default function Home() {
  const bankData = {
    accountHolder: "Sdr Bayu Saptaji Rahman",
    bankName: "Bank Negara Indonesia",
    accountNumber: "0900604501",
    logoSrc: require("../../assets/bni-logo2.png"),
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <NavigationBar />
      <Dispute />
    </View>
  );
}
