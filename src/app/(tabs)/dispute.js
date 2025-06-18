import { View, StatusBar } from "react-native";
import NavigationBar from "../../components/NavigationBar";
import AccountBalance from "../../components/AccountBalance";
import QuickActions from "../../components/QuickActions";
import RusakBarangMenunggu from "../dispute/rusakBarangMenunggu";
import RusakBarangKembaliinPage from "../dispute/rusakBarangKembaliin";
import PengembalianForm from "../dispute/pengembalianForm";
import KonfirmasiSellerForm from "../dispute/konfirmasiSellerForm";
import RusakBarangSelesai from "../dispute/rusakBarangSelesai";


export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      {/* <NavigationBar /> */}
      {/* <RusakBarangMenunggu /> */}
      <RusakBarangKembaliinPage />
      {/* <PengembalianForm /> */}
      {/* <KonfirmasiSellerForm/> */}
      {/* <RusakBarangSelesai /> */}
    </View>
  );
}
