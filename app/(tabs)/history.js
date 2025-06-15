import { View } from "react-native";
import NavigationBar from "../../src/components/NavigationBar";
import History from "../../src/screens/history";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  const bankData = {
    accountHolder: "Sdr Bayu Saptaji Rahman",
    bankName: "Bank Negara Indonesia",
    accountNumber: "0900604501",
    logoSrc: require("../../assets/bni-logo2.png"),
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, padding: 16 }}>
        <NavigationBar
          name="irgi168@gmail.com"
          onNotificationPress={() => console.log("Notification pressed")}
          onProfilePress={() => console.log("Notification pressed")}
        />
        {/* <ScrollView
          className="flex flex-col gap-12"
          showsVerticalScrollIndicator={false}>
          {isEmptyTransaction ? (
            <BuyerEmptyContent />
          ) : (
            <BuyerCard data={mockAPIBuyer.data} />
          )}
        </ScrollView> */}
        <History />
      </View>
    </View>
  );
}
