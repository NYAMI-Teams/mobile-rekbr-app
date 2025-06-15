import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import PrimaryButton from "../../src/components/PrimaryButton";
import SellerEmptyContent from "../../src/screens/seller/homeScreen";
import { useState } from "react";
import NavigationBar from "../../src/components/NavigationBar";
import { StatusBar } from "expo-status-bar";
import SellerCard from "../../src/components/card-transaction/SellerCard";
import { mockAPISeller } from "../../src/services/apiMock/api";

export default function Seller() {
  const router = useRouter();
  const [isKYCCompleted, setIsKYCCompleted] = useState(true);
  const [isEmptyTransaction, setIsEmptyTransaction] = useState(false);

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
            <SellerEmptyContent isKYCCompleted={isKYCCompleted} />
          ) : (
            <SellerCard data={mockAPISeller.data} />
          )}
        </ScrollView>
        {isKYCCompleted && !isEmptyTransaction && (
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
              bottom: 30,
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
        )}
      </View>
    </View>
  );
}
