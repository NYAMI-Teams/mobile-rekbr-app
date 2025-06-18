import { View, ScrollView, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import PrimaryButton from "../../components/PrimaryButton";
import SellerEmptyContent from "../../screens/seller/homeScreen";
import { useState } from "react";
import NavigationBar from "../../components/NavigationBar";
import { StatusBar } from "expo-status-bar";
import SellerCard from "../../components/card-transaction/SellerCard";
import { mockAPISeller } from "../../services/apiMock/api";
import Dispute from "../Dispute/HomeDispute";

export default function DisputeScreen() {
  const router = useRouter();
  const [isKYCCompleted, setIsKYCCompleted] = useState(true);
  const [isEmptyTransaction, setIsEmptyTransaction] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, padding: 16 }}>
        <Dispute/>
      </View>
    </View>
  );
}
