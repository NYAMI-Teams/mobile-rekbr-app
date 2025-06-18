import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, ClipboardPaste, ChevronDown } from "lucide-react-native";
import { useNavigation } from "expo-router";
import PrimaryButton from "../../components/PrimaryButton";
import { InfoBanner } from "../../components/dispute/InfoBanner";
import StepProgressBar from "../../components/ProgressBar";
import { StatusKomplain } from "../../components/dispute/statusKomplain";
import { TrackDispute } from "../../components/dispute/TrackDispute";

export default function RusakBarangKembaliinPage() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4 pt-4 pb-40">
        {/* Header */}
        <View className="relative items-center justify-center mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-0"
          >
            <ChevronLeft size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-center">
            Detail Komplain
          </Text>
        </View>

        <StepProgressBar
          currentStep={1}
          steps={["Menunggu", "Kembaliin", "Refund", "Selesai"]}
        />
        <InfoBanner contentBefore="Pastikan barang dalam kondisi baik, kemasan terjaga, dan lampirkan bukti pengiriman!" />
        <StatusKomplain status="Menunggu Pengembalian Barang" />

        <View className="h4 bg-[#f5f5f5]"/>

        <TrackDispute
          title="Riwayat Dispute"
          dateTime="18 Juni 2025, 10:00 WIB"
          details={[
            { content: "Seller sudah kirim bukti." },
            { content: "Buyer setuju refund." },
            {
              imgTitle: "Bukti Barang & Transfer",
              images: [
                require("../../assets/barangrusak.png"),
                require("../../assets/barangrusak.png"),
              ],
            },
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
