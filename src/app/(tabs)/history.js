import { View, ActivityIndicator, Text, TouchableOpacity, ScrollView } from "react-native";
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

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        handleLogout();
        return;
      }
      const res = await getProfile();
      setProfile(res.data);
    } catch {
      showToast(
        "Sesi Berakhir",
        "Sesi Anda telah berakhir. Silahkan login kembali.",
        "error"
      );
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await removeAccessToken();
      router.replace("Onboarding");
    } catch (err) {
      showToast(
        "Logout Gagal",
        "Gagal logout. Silahkan coba lagi.",
        "error"
      );
    }
  };

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

  const getHistoryBuyerData = async () => {
    try {
      const res = await getHistoryBuyer();
      if (res) {
        console.log("ini history buyer", res);
        setHistoryBuyer(res.data);
      }
    } catch (error) {
      console.log("Error get history buyer:", error);
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
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, padding: 16 }}>
        <NavigationBar
          name={profile?.email}
          onNotificationPress={() =>
            Toast.show({
              type: "success",
              text1: "Notification pressed",
              position: "top",
            })
          }
          onLogoutPress={() => handleLogout()}
        />

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <View className="bg-white items-center w-full h-[80%] gap-2">
            <View className="flex-row w-full mt-4">
              <TouchableOpacity
                onPress={() => handleTabPress("pembelian")}
                className={`flex-1 items-center justify-center h-8 ${selectedTab === "pembelian"
                  ? "border-b-2 border-[#49DBC8]"
                  : "border-b-2 border-gray-300"
                  }`}>
                <Text
                  className={`text-xs font-semibold ${selectedTab === "pembelian" ? "text-black" : "text-gray-400"
                    }`}>
                  Pembelian
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleTabPress("penjualan")}
                className={`flex-1 items-center justify-center h-8 ${selectedTab === "penjualan"
                  ? "border-b-2 border-[#49DBC8]"
                  : "border-b-2 border-gray-300"
                  }`}>
                <Text
                  className={`text-xs font-semibold ${selectedTab === "penjualan" ? "text-black" : "text-gray-400"
                    }`}>
                  Penjualan
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
              {renderContent()}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}
