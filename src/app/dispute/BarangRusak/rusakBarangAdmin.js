import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClipboardPaste, ChevronLeft, ChevronDown } from "lucide-react-native";

import CopyField from "../../../components/dispute/copyField";
import TextView from "../../../components/dispute/textView";
import { InfoBanner } from "../../../components/dispute/InfoBanner";
import { StatusKomplain } from "../../../components/dispute/statusKomplain";
import StepProgressBar from "../../../components/ProgressBar";
import { TrackDispute } from "../../../components/dispute/TrackDispute";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function AdminPage() {
  const router = useRouter();
  const { rejected } = useLocalSearchParams();
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [ditolak, setDitolak] = useState(rejected === "true");

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between py-4 px-4">
        <TouchableOpacity
          onPress={() => router.replace("../../(tabs)/dispute")}
        >
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-base font-semibold">Detail Komplain</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Stepper */}
      <StepProgressBar
        currentStep={1}
        steps={["Seller", "Admin", "Kembaliin", "Refunded"]}
        rejectedSteps={ditolak ? [0, 1] : [0]}
      />

      <ScrollView className="px-4">
        {/* Status Komplain */}
        <StatusKomplain
          status={ditolak ? "Komplain Ditolak" : "Menunggu Persetujuan Admin"}
        />

        {ditolak && (
          <InfoBanner contentBefore="Setelah ditinjau, bukti belum cukup kuat. Dana diteruskan ke seller dan transaksi dianggap selesai." />
        )}

        {/* Pengajuan */}
        <TrackDispute
          title="Penolakan komplain seller"
          dateTime="16 Juni 2025, 14 : 00 WIB"
          details={[
            {
              content:
                "Penolakan dikarenakan bukti buyer belum cukup kuat dan tidak ada alasan menerima hal seperti itu",
            },
            {
              imgTitle: "Bukti foto & video",
              images: [
                require("../../../assets/barangrusak.png"),
                require("../../../assets/barangrusak.png"),
              ],
            },
          ]}
        />
        <TrackDispute
          title="Pengajuan komplain buyer"
          dateTime="16 Juni 2025, 10:00 WIB"
          details={[
            {
              content:
                "Buyer mau ngembaliin barang yang bermasalah. Dana rekber bakal dikembalikan setelah komplain disetujui, ya!",
            },
            {
              content:
                "Layar barang pecah di bagian tengah dan ada goresan dalam di sisi kiri.",
            },
            {
              imgTitle: "Bukti foto & video",
              images: [
                require("../../../assets/barangrusak.png"),
                require("../../../assets/barangrusak.png"),
              ],
            },
          ]}
        />

        {/* Data Seller & Transaksi */}
        <TextView title="Seller" content="zhirazzi@gmail.com" />
        <TextView title="Nama Barang" content="iPhone 17 Pro" />
        <TextView title="Tagihan Rekber" content="Rp 8.080.000,00" />
        <CopyField title="No Resi" content="J X 3 4 7 4 1 2 4 0 1 3" />
        <TextView title="Ekspedisi" content="J&T Express Indonesia" />
        <CopyField title="ID Transaksi" content="1 2 3 4 5 6 7 8 9" />
        <CopyField
          title="Virtual Account"
          content="8 0 8 0 1 2 3 4 5 6 7 8 9"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
