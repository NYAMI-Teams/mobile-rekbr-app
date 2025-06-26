import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import NavigationBar from "@/components/NavigationBar";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { getProfile } from "@/utils/api/auth";
import { getAccessToken, removeAccessToken } from "@/store";
import { showToast } from "@/utils";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import BuyerCard from "@/components/card-transaction/BuyerCard";
import SellerCard from "@/components/card-transaction/SellerCard";
import EmptyIllustration from "@/components/Ilustration";
import { getHistoryBuyer } from "@/utils/api/buyer";
import { getHistorySeller } from "@/utils/api/seller";

export default function History() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("pembelian");

  const [historyBuyer, setHistoryBuyer] = useState([]);
  const [historySeller, setHistorySeller] = useState([]);

  useEffect(() => {
    if (selectedTab === "pembelian") {
      getHistoryBuyerData();
    }
    if (selectedTab === "penjualan") {
      getHistorySellerData();
    }
  }, [selectedTab]);

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (selectedTab === "pembelian") {
      await getHistoryBuyerData();
    } else {
      await getHistorySellerData();
    }
    setRefreshing(false);
  };

  const getHistoryBuyerData = async () => {
    try {
      const res = await getHistoryBuyer();
      if (res) {
        console.log("ini history buyer", res);
        setHistoryBuyer(res.data);
      }
    } catch (error) {
      console.log("Error get history buyer:", error);
      showToast("Gagal", "Gagal mendapatkan riwayat pembelian", "error");
    }
  };

  const getHistorySellerData = async () => {
    try {
      const res = await getHistorySeller();
      if (res) {
        console.log("ini history seller", res);
        setHistorySeller(res.data);
      }
    } catch (error) {
      console.log("Error get history seller:", error);
    }
  };

  const renderContent = () => {
    if (selectedTab === "pembelian") {
      if (historyBuyer.length === 0) {
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
      return historyBuyer.map((item) => (
        <BuyerCard key={item.id} data={item} />
      ));
    } else {
      if (historySeller.length === 0) {
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
      return historySeller.map((item) => (
        <SellerCard key={item.id} data={item} />
      ));
    }
  };

  return (
    <View className="flex-1 bg-white">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <View className="bg-white items-center w-full gap-2">
          <View className="flex-row w-full px-4 h-10">
            <TouchableOpacity
              onPress={() => handleTabPress("pembelian")}
              className={`flex-1 items-center justify-center h-full ${
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
              className={`flex-1 items-center justify-center h-full ${
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
          <ScrollView
            className="w-full px-4"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View className="mb-16">{renderContent()}</View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
