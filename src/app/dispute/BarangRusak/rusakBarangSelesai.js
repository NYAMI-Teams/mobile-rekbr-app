import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import PrimaryButton from "../../../components/PrimaryButton";
import { InfoBanner } from "../../../components/dispute/InfoBanner";
import StepProgressBar from "../../../components/ProgressBar";
import { StatusKomplain } from "../../../components/dispute/statusKomplain";
import { TrackDispute } from "../../../components/dispute/TrackDispute";
import TextView from "../../../components/dispute/textView";
import Tagihan from "../../../components/DetailRekber/Tagihan";
import CopyField from "../../../components/dispute/copyField";
import { useRouter } from "expo-router";
import { getDetailBuyerComplaint } from "../../../utils/api/complaint";

export default function RusakBarangSelesai() {
  const router = useRouter();
  const [detailComplaint, setDetailComplaint] = useState({});
  const { complaintId } = useLocalSearchParams();

  useEffect(() => {
    fetchComplaintDetails();
  }, []);

  const fetchComplaintDetails = async () => {
    try {
      const res = await getDetailBuyerComplaint(complaintId);
      setDetailComplaint(res.data);
    } catch (err) {
      showToast(
        "Gagal",
        "Gagal mengambil data transaksi. Silahkan coba lagi.",
        "error"
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-base font-semibold">Detail Komplain</Text>
        <View style={{ width: 24 }} />
      </View>

      <StepProgressBar
        currentStep={3}
        steps={["Seller", "Admin", "Kembaliin", "Refund"]}
      />
      <StatusKomplain status={detailComplaint.status_label} />

      <View className="h-2 bg-[#f5f5f5] mt-3" />

      <ScrollView className="px-4 pt-4 pb-40">
        <TrackDispute
          title="Konfirmasi seller dan dana berhasil dikembalikan"
          dateTime="22 Juni 2025, 10 : 00 WIB"
        />
        <View className="h-2 bg-[#f5f5f5] mt-3" />
        <TrackDispute
          title="Admin meneruskan permintaan konfirmasi"
          dateTime="20 Juni 2025, 12 : 00 WIB"
        />
        <View className="h-2 bg-[#f5f5f5] mt-3" />

        <TrackDispute
          title="Permintaan konfirmasi buyer"
          dateTime="Melalui resi harusnya barang sudah sampai di seller"
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
        <View className="h-2 bg-[#f5f5f5] mt-3" />

        <TrackDispute
          title="Pengembalian barang oleh buyer"
          dateTime="20 Juni 2025, 10 : 00 WIB"
          details={[
            {
              resiNumber: "J X 3 4 7 4 1 2 4 0 1 3",
              expedition: "J&T Express Indonesia",
            },
          ]}
        />

        <View className="h-2 bg-[#f5f5f5] mt-3" />

        <TrackDispute
          title="Persetujuan komplain seller"
          dateTime="19 Juni 2025, 10 : 00 WIB"
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

        <View className="h-2 bg-[#f5f5f5] mt-3" />

        <TextView title="Seller" content="irgi168@gmail.com" />
        <TextView title="Nama Barang" content="IPhone 13 Pro Max" />
        <View className="p-3">
          <Tagihan
            caption="Tagihan Rekber"
            price="Rp 1.000.000"
            details={[
              { status: "Kembaliin", price: "Rp 1.000.000" },
              { status: "Refund", price: "Rp 1.000.000" },
            ]}
          />
        </View>

        <CopyField title="Nomor Resi" content="123456789" />
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
