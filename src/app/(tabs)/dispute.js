import React, { Profiler, useEffect, useState } from "react";
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
import Dispute from "../Dispute/Index";
import { getDetailBuyerTransaction } from "@/utils/api/buyer";
import { RefreshControl } from "react-native";
import { getListComplainBuyer } from "@/utils/api/complaint";
import { showToast } from "@/utils";

export default function DisputeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState("pembelian");
  const [isKYCCompleted, setIsKYCCompleted] = useState(true);
  const [isEmptyTransaction, setIsEmptyTransaction] = useState(false);
  const [complainTransactions, setComplainTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchComplainData();
  }, []);

  const fetchComplainData = async () => {
    try {
      const res = await getListComplainBuyer();
      setComplainTransactions(res.data);
      setIsEmptyTransaction(res.data.length === 0);
    } catch (err) {
      showToast("Gagal", "Gagal mengambil data komplain", "error");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplainData().finally(() => setRefreshing(false));
  };

  // useEffect(() => {
  //   const fetchTransactionDetails = async () => {
  //     try {
  //       const res = await getDetailBuyerTransaction(id);
  //       setData(res.data);
  //     } catch (err) {
  //       showToast(
  //         "Gagal",
  //         "Gagal mengambil data transaksi. Silahkan coba lagi.",
  //         "error"
  //       );
  //     }
  //   };

  //   fetchTransactionDetails();
  // }, [id]);
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
      <ScrollView
        className="p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {complainTransactions.length > 0 ? (
          complainTransactions.map((item) => (
            <Pressable
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: "/Dispute/HilangDisputeDetail",
                  params: { id: item.id },
                })
              }
            >
              <OrderSummaryCard
                productName={item.itemName}
                sellerEmail={item.sellerEmail}
                price={item.totalAmount}
                resi={item.shipment?.trackingNumber || "-"}
                ekspedisi={item.shipment?.courier || "-"}
                status={item.complaint?.status || "unknown"}
                issue={
                  item.complaint?.type === "lost"
                    ? "Barang belum sampai atau kesasar"
                    : "Masalah lainnya"
                }
              />
            </Pressable>
          ))
        ) : (
          <Text className="text-gray-400 text-center mt-8">
            Belum ada transaksi komplain.
          </Text>
        )}

        <PrimaryButton
          title="Ajukan Komplain"
          onPress={() => {
            router.push("/Dispute/Index");
          }}
          className="mt-4"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
