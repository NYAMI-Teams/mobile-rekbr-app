import React, { Profiler, useState } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import OrderSummaryCard from "../../components/OrderSummaryCard";
import PrimaryButton from "../../components/PrimaryButton";
import NavigationBar from "../../components/NavigationBar";
import AccountBalance from "../../components/AccountBalance";
import QuickActions from "../../components/QuickActions";
import Dispute from "../Dispute";

export default function DisputeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState("pembelian");
  const [isKYCCompleted, setIsKYCCompleted] = useState(true);
  const [isEmptyTransaction, setIsEmptyTransaction] = useState(false);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <NavigationBar
        name={Profiler?.email}
        // onNotificationPress={() => console.log("Notification pressed")}
        onNotificationPress={() =>
          Toast.show({
            type: "success",
            text1: "Notification pressed",
            position: "top",
          })
        }
        onLogoutPress={() => handleLogout()}
      />

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          className="flex-1 items-center pb-2"
          onPress={() => setActiveTab("pembelian")}
        >
          <Text
            className={`text-lg font-semibold ${
              activeTab === "pembelian" ? "text-black" : "text-gray-400"
            }`}
          >
            Pembelian
          </Text>
          {activeTab === "pembelian" && (
            <View className="h-1 w-full bg-[#3ED9D0] rounded-full mt-1" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center pb-2"
          onPress={() => setActiveTab("penjualan")}
        >
          <Text
            className={`text-lg font-semibold ${
              activeTab === "penjualan" ? "text-black" : "text-gray-400"
            }`}
          >
            Penjualan
          </Text>
          {activeTab === "penjualan" && (
            <View className="h-1 w-full bg-[#3ED9D0] rounded-full mt-1" />
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="p-4">
        <Pressable onPress={() => router.push("/Dispute/HilangDisputeDetail")}>
          <OrderSummaryCard status="investigasi" />
        </Pressable>
        {/* Tambahkan lebih banyak OrderSummaryCard jika diperlukan */}
        <PrimaryButton
          title="Ajukan Komplain"
          onPress={() => {
            router.push("/Dispute/Index"); // Ganti dengan route yang kamu inginkan
          }}
          className="mt-4"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
