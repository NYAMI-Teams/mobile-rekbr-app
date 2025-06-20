import { View, StatusBar } from "react-native";
import NavigationBar from "../../components/NavigationBar";
import AccountBalance from "../../components/AccountBalance";
import QuickActions from "../../components/QuickActions";
import RusakBarangHome from "../dispute/BarangRusak/rusakBarangHome";
import RusakBarangKembaliinPage from "../dispute/BarangRusak/rusakBarangKembaliin";

export default function DisputeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      {/* <NavigationBar /> */}
      {/* <RusakBarangRefund /> */}
      {/* <RusakBarangKembaliinPage /> */}
      <RusakBarangHome />
    </View>
  );
}
