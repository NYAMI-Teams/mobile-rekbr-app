import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import RusakBarangCard from "../../../components/dispute/RusakBarangCard";

export default function RusakBarangHome() {
  const router = useRouter();

  // Function helper buat navigate ke rusakBarangKembaliin dengan params
  const navigateToKembaliin = (params) => {
    router.push({
      pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
      params,
    });
  };

  // List komplain data
  const komplainList = [
    // {
    //   status: "waitingSeller",
    //   onPress: () => router.push("/dispute/BarangRusak/rusakBarangMenunggu"),
    // },
    // {
    //   status: "disputeCancel",
    //   onPress: () => router.push("/dispute/BarangRusak/komplainBatal"),
    // },
    // {
    //   status: "disputeProved",
    //   onPress: () => navigateToKembaliin({}),
    // },
    // {
    //   status: "waitingAdmin",
    //   onPress: () => router.push("/dispute/BarangRusak/rusakBarangAdmin"),
    // },
    // {
    //   status: "adminReject",
    //   onPress: () =>
    //     router.push({
    //       pathname: "/dispute/BarangRusak/rusakBarangAdmin",
    //       params: { rejected: true },
    //     }),
    // },
    {
      status: "adminApprove",
      onPress: () =>
        navigateToKembaliin({ sellerRejected: true, ditolak: false }),
      onPressButton: () => router.push("/dispute/BarangRusak/pengembalianForm"),
    },
    {
      status: "adminApprove",
      onPress: () =>
        navigateToKembaliin({ sellerRejected: false, ditolak: false }),
      onPressButton: () => router.push("/dispute/BarangRusak/pengembalianForm"),
    },
    {
      status: "adminApprove",
      onPress: () =>
        navigateToKembaliin({ sellerRejected: false, ditolak: true }),
      onPressButton: () => router.push("/dispute/BarangRusak/pengembalianForm"),
    },

    ////////
    {
      status: "buyerResi",
      onPress: () =>
        navigateToKembaliin({
          sellerRejected: false,
          ditolak: false,
          resi: true,
        }),
      onPressButton: () =>
        router.push("/dispute/BarangRusak/konfirmasiSellerForm"),
    },
    {
      status: "requestSeller",
      onPress: () =>
        navigateToKembaliin({
          sellerRejected: false,
          ditolak: false,
          resi: true,
          mintaKonfirmasi: true,
        }),
    },
    {
      status: "waitSeller",
      onPress: () =>
        navigateToKembaliin({
          sellerRejected: false,
          ditolak: false,
          resi: true,
          mintaKonfirmasi: true,
          AdminResponse: true,
        }),
    },
    {
      status: "requestRejected",
      onPress: () =>
        navigateToKembaliin({
          sellerRejected: false,
          ditolak: false,
          resi: true,
          mintaKonfirmasi: true,
          AdminResponse: false,
        }),
    },
    // {
    //   status: "requestApprove",
    //   onPress: () => router.push("/dispute/BarangRusak/rusakBarangSelesai"),
    // },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4 pt-6">
        {/* Tab Header */}
        <View className="flex-row justify-between items-center border-b border-gray-200 mb-10">
          <View className="flex-1 items-center pb-2 border-b-2 border-[#00B7A0]">
            <Text className="text-sm font-semibold text-[#1D1D1D]">
              Pembelian
            </Text>
          </View>
          <View className="flex-1 items-center pb-2">
            <Text className="text-sm text-gray-400">Penjualan</Text>
          </View>
        </View>

        {/* Render Card List */}
        {komplainList.map((item, index) => (
          <RusakBarangCard
            key={index}
            namaBarang="Iphone 13 Pro Max"
            harga="Rp 10.000.000"
            seller="irgi168@gmail.com"
            noResi="JX12345678"
            expedisi="J&T"
            status={item.status}
            onPress={item.onPress}
            onPressButton={item.onPressButton}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
