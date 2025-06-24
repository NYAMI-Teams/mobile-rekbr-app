import React, { useEffect, useState } from "react";
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
import { getDetailBuyerComplaint } from "../../../utils/api/complaint";

export default function AdminPage() {
  const router = useRouter();
  const { status, rejectedAdmin } = useLocalSearchParams();
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [ditolak, setDitolak] = useState(rejectedAdmin === "true");
  const [detailComplaint, setDetailComplaint] = useState({});
  const { complaintId } = useLocalSearchParams();

  useEffect(() => {
    if (complaintId) {
      fetchComplaintDetails();
    }
  }, [complaintId]);

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

  // useEffect(() => {
  //   console.log("Complaints:", JSON.stringify(detailComplaint, null, 2));
  // }, [detailComplaint]);

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

        {rejectedAdmin === "false" && (
          <>
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
            <View className="h-2 bg-[#f5f5f5] mt-3" />
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
          </>
        )}

        {rejectedAdmin === "true" && (
          <>
            <TrackDispute
              title="Penolakan komplain admin"
              dateTime="16 Juni 2025, 15 : 00 WIB"
              details={[
                {
                  content:
                    "Setelah bukti ditinjau, pengajuan tidak memenuhi syarat. Komplain dinyatakan tidak valid dan dana tetap diteruskan ke seller.",
                },
              ]}
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
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
            <View className="h-2 bg-[#f5f5f5] mt-3" />
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
          </>
        )}

        {/* Data Seller & Transaksi */}
        <TextView
          title="Seller"
          content={detailComplaint?.transaction?.sellerEmail}
        />
        <TextView
          title="Nama Barang"
          content={detailComplaint?.transaction?.itemName}
        />
        <TextView
          title="Tagihan Rekber"
          content={detailComplaint?.transaction?.totalAmount}
        />
        <CopyField
          title="No Resi"
          content={
            detailComplaint?.transaction?.trackingNumber?.split("").join(" ") ||
            "-"
          }
        />
        <TextView
          title="Ekspedisi"
          content={detailComplaint?.transaction?.courier?.name || "-"}
        />
        <CopyField
          title="ID Transaksi"
          content={detailComplaint?.transaction?.transactionCode
            ?.split("")
            .join(" ")}
        />
        <CopyField
          title="Virtual Account"
          content={detailComplaint?.transaction?.virtualAccount
            ?.split("")
            .join(" ")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
