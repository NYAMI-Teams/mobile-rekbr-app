import { View } from "react-native";
import NavigationBar from "../../src/components/NavigationBar";
import AccountBalance from "../../src/components/AccountBalance";
import QuickActions from "../../src/components/QuickActions";

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
      <AccountBalance bankData={bankData} />
      <QuickActions />
    </View>
  );
}
