import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import BuyerCard from "../../components/card-transaction/BuyerCard";
import SellerCard from "../../components/card-transaction/SellerCard";
import { mockAPIBuyer, mockAPISeller } from "../../services/apiMock/api";

export default function History() {
  const [selectedTab, setSelectedTab] = useState("pembelian");
  const mockDataLength = 0;

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
  };

  const renderContent = () => {
    if (selectedTab === "pembelian") {
      if (mockDataLength === 0) {
        return <Text>Tidak ada data</Text>;
      }
      return <BuyerCard data={mockAPIBuyer.data} />;
    }

    if (mockDataLength === 0) {
      return <Text>Tidak ada data</Text>;
    }
    return <SellerCard data={mockAPISeller.data} />;
  };

  return (
    <View className="flex-1 bg-white items-center pt-20 w-full">
      <View className="flex-row w-full mt-4 px-6">
        <TouchableOpacity
          onPress={() => handleTabPress("pembelian")}
          className={`flex-1 items-center justify-center h-8 ${
            selectedTab === "pembelian"
              ? "border-b-2 border-[#49DBC8]"
              : "border-b-2 border-gray-300"
          }`}>
          <Text
            className={`text-xs font-semibold ${
              selectedTab === "pembelian" ? "text-black" : "text-gray-400"
            }`}>
            Pembelian
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabPress("penjualan")}
          className={`flex-1 items-center justify-center h-8 ${
            selectedTab === "penjualan"
              ? "border-b-2 border-[#49DBC8]"
              : "border-b-2 border-gray-300"
          }`}>
          <Text
            className={`text-xs font-semibold ${
              selectedTab === "penjualan" ? "text-black" : "text-gray-400"
            }`}>
            Penjualan
          </Text>
        </TouchableOpacity>
      </View>
      <View className="w-full pt-8">{renderContent()}</View>
    </View>
  );
}
