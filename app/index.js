import { StatusBar } from "expo-status-bar";
import { View, ScrollView, Text } from "react-native";
import NavigationBar from "../src/components/NavigationBar";
import BuyerCard from "../src/components/card-transaction/BuyerCard";
import { mockAPIBuyer } from "../src/services/apiMock/api";
import { useRouter } from "expo-router";
import PrimaryButton from "../src/components/PrimaryButton";

export default function Home() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, padding: 16 }}>
        <NavigationBar
          name="irgi168@gmail.commmmmmmmmm"
          onNotificationPress={() => console.log("Notification pressed")}
          onProfilePress={() => router.push("/profile")}
        />
        <ScrollView
          className="flex flex-col gap-12"
          showsVerticalScrollIndicator={false}>
          <BuyerCard data={mockAPIBuyer.data} />
          <BuyerCard data={mockAPIBuyer.data} />
          <BuyerCard data={mockAPIBuyer.data} />
          <BuyerCard data={mockAPIBuyer.data} />
          <BuyerCard data={mockAPIBuyer.data} />
          <BuyerCard data={mockAPIBuyer.data} />
          <BuyerCard data={mockAPIBuyer.data} />
        </ScrollView>
        <PrimaryButton
          title={"+ Rekbr Baru"}
          onPress={() =>
            router.push("/CreateTransaksi/CreateRekening/ChooseRekening")
          }
          btnColor="black"
          textColor="#fff"
          width="50%"
          height={50}
          style={{
            position: "absolute",
            bottom: 120,
            right: 16,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 8,
            zIndex: 10,
          }}
        />
        <NavigationBar
          name="irgi168@gmail.commmmmmmmmm"
          onNotificationPress={() => console.log("Notification pressed")}
          onProfilePress={() => router.push("/profile")}
        />
      </View>
    </View>
  );
}
