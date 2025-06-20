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
import { useRouter } from "expo-router";

export default function DetailKomplain() {
  const router = useRouter();
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [isNeedAdmin, setIsNeedAdmin] = useState(false);
  const [ditolak, setDitolak] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white ">
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
      <View className="items-center w-full">
        <StepProgressBar
          currentStep={0}
          steps={
            isNeedAdmin
              ? ["Menunggu", "Admin", "Kembaliin", "Refunded"]
              : ["Seller", "Kembaliin", "Refunded"]
          }
          isRejected={ditolak}
        />
      </View>
      <ScrollView className="px-4">
        {/* Alert Info */}
        <InfoBanner
          contentBefore="Jika seller nggak respon sampai"
          dateTime="18 Juni 2025, 10 : 00 WIB"
          contentAfter=" pengajuanmu bakal otomatis disetujui ya!"
        />

        {/* Status Komplain */}
        <StatusKomplain status="Menunggu" />

        {/* Pengajuan */}
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

      {/* Footer */}
      <View className="flex-row items-center px-4 py-3 border-t border-gray-100 bg-white">
        {/* Tombol titik tiga horizontal */}
        <TouchableOpacity
          onPress={() => setShowOptionModal(true)}
          className="h-11 w-16 bg-white rounded-xl border border-black items-center justify-center"
        >
          <Text className="text-black text-[20px] font-semibold">⋯</Text>
        </TouchableOpacity>

        {/* Tombol utama */}
        <TouchableOpacity
          className="flex-1 ml-2 h-11 bg-black rounded-xl items-center justify-center"
          onPress={() => router.push("../../(tabs)/dispute")}
        >
          <Text className="text-white font-semibold text-sm">
            Kirim Seller Email
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal Slide Popup - Lainnya */}
      <Modal
        visible={showOptionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptionModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowOptionModal(false)}>
          <View className="flex-1 bg-black/40" />
        </TouchableWithoutFeedback>

        <View className="bg-white rounded-t-3xl pt-3 pb-8 px-6">
          {/* Drag handle */}
          <View className="w-10 h-1.5 bg-gray-300 rounded-full self-center mb-5" />

          <Text className="text-base font-semibold text-black mb-4">
            Lainnya
          </Text>

          <TouchableOpacity
            className="mb-4"
            onPress={() => router.replace("/dispute/BarangRusak/rusakBarang")}
          >
            <Text className="text-sm font-medium text-black">
              Ubah Detail Komplain
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("../../(tabs)/dispute")}
            className="mb-4"
          >
            <Text className="text-sm font-medium text-black">
              Batalkan Komplain
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log("Simulate pressed")}
            className="mb-4"
          >
            <Text className="text-sm font-medium text-black">
              Simulate reject
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
