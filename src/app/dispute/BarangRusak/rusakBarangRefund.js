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

export default function DetailKomplain() {
  const [showOptionModal, setShowOptionModal] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4">
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
        currentStep={2}
        steps={["Menunggu", "Kembaliin", "Refund", "Selesai"]}
      />

      <ScrollView className="px-4">
        {/* Alert Info */}
        {/* <InfoBanner
          contentBefore="Jika seller nggak respon sampai "
          dateTime="18 Juni 2025, 10 : 00 WIB"
          contentAfter="pengajuanmu bakal otomatis disetujui ya!"
        /> */}

        {/* Status Komplain */}
        <StatusKomplain status="Menunggu Refund Dana" />

        {/* Pengajuan */}
        <TrackDispute
          title="Konfirmasi seller barang diterima"
          dateTime="22 Juni 2025, 10:00 WIB"
        />
        <TrackDispute
          title="Admin meneruskan permintaan konfirmasi"
          dateTime="20 Juni 2025, 10:00 WIB"
        />
        <TrackDispute
          title="Permintaan konfirmasi buyer"
          dateTime="21 Juni 2025, 10:00 WIB"
          details={[
            {
              content: "Melalui resi harusnya barang sudah sampai di seller",
            },
            {
              imgTitle: "Bukti foto & video",
              images: [require("../../../assets/barangrusak.png")],
            },
          ]}
        />
        <TrackDispute
          title="Refund bayar oleh buyer"
          dateTime="20 Juni 2025, 10:00 WIB"
          details={[
            {
              resiNumber: "J X 3 4 7 4 1 2 4 0 1 3",
              expedition: "J&T Express Indonesia",
            },
          ]}
        />
        <TrackDispute
          title="Persetujuan komplain seller"
          dateTime="19 Juni 2025, 10:00 WIB"
          details={[
            {
              content:
                "Seller setuju untuk Refund dana pada barang yang bermasalah.",
            },
            {
              imgTitle: "Bukti foto & video",
              images: [require("../../../assets/barangrusak.png")],
            },
          ]}
        />
        <TrackDispute
          title="Pengajuan komplain buyer"
          dateTime="16 Juni 2025, 10:00 WIB"
          details={[
            {
              content:
                "Buyer mau ngembaliin barang yang bermasalah. Barang yg bermasalah bakalan diganti yang baru.",
            },
            {
              content:
                "Layar barang pecah di bagian tengah dan ada goresan dalam di sisi kiri.",
            },
            {
              imgTitle: "Bukti foto & video",
              images: [require("../../../assets/barangrusak.png")],
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
