import { View, StatusBar } from "react-native";
import NavigationBar from "../../components/NavigationBar";
import AccountBalance from "../../components/AccountBalance";
import QuickActions from "../../components/QuickActions";
import RusakBarangMenunggu from "../dispute/rusakBarangMenunggu";

export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      {/* <NavigationBar /> */}
      <RusakBarangMenunggu />
    </View>
  );
}
