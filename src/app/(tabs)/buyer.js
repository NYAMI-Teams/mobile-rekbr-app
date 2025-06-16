import { View } from "react-native";
import NavigationBar from "../../components/NavigationBar";
import { useState } from "react";
import BuyerEmptyContent from "../../screens/buyer/index";
import { mockAPIBuyer } from "../../services/apiMock/api";
import { StatusBar } from "expo-status-bar";
import BuyerCard from "../../components/card-transaction/BuyerCard";
import { ScrollView } from "react-native";

export default function Home() {
  const [isEmptyTransaction, setIsEmptyTransaction] = useState(false);
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
        <ScrollView
          className="flex flex-col gap-12"
          showsVerticalScrollIndicator={false}>
          {isEmptyTransaction ? (
            <BuyerEmptyContent />
          ) : (
            <BuyerCard data={mockAPIBuyer.data} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}
