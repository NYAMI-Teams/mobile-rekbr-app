import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native"; // pastikan path sesuai struktur proyekmu
import OrderSummaryCard from "../../components/OrderSummaryCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrderScreen() {
  const [activeTab, setActiveTab] = useState("pembelian");
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", paddingTop: insets.top }}
    >
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
        <OrderSummaryCard status="selesai" />
        {/* investigasi, selesai, dibatalkan, ditolak */}
        {/* Tambahkan lebih banyak OrderSummaryCard jika diperlukan */}
      </ScrollView>
    </SafeAreaView>
  );
}
