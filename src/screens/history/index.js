import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import BuyerCard from "../../components/card-transaction/BuyerCard";
import SellerCard from "../../components/card-transaction/SellerCard";
import { mockAPIBuyer, mockAPISeller } from "../../services/apiMock/api";
import EmptyIllustration from "../../components/Ilustration";

export default function History() {
  const [selectedTab, setSelectedTab] = useState("pembelian");
  //   const mockDataLength = 0;

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
  };

  const renderContent = () => {
    if (selectedTab === "pembelian") {
      if (mockAPIBuyer.data.length === 0) {
        return (
          <View className="justify-center items-center">
            <EmptyIllustration
              text={
                "Belum ada riwayat pembelian, semua masih kosong\nTunggu sampai kamu mulai rekber pertama!"
              }
            />
          </View>
        );
      }
      return <BuyerCard data={mockAPIBuyer.data} />;
    }

    if (mockAPISeller.data.length === 0) {
      return (
        <View className="justify-center items-center">
          <EmptyIllustration
            text={
              "Belum ada riwayat penjualan, semua masih kosong\nTunggu sampai kamu mulai rekber pertama!"
            }
          />
        </View>
      );
    }
    return <SellerCard data={mockAPISeller.data} />;
  };

  return (
    <View className="bg-white items-center w-full h-[80%]">
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
      <View className="w-full pt-8 px-6">{renderContent()}</View>
    </View>
  );
}
