import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";

import CopyField from "../../../components/dispute/copyField";
import TextView from "../../../components/dispute/textView";
import { InfoBanner } from "../../../components/dispute/InfoBanner";
import { StatusKomplain } from "../../../components/dispute/statusKomplain";
import StepProgressBar from "../../../components/ProgressBar";
import { TrackDispute } from "../../../components/dispute/TrackDispute";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getDetailBuyerComplaint,
  postBuyerCancelComplaint,
} from "../../../utils/api/complaint";
import moment from "moment";

export default function DetailKomplain() {
  const router = useRouter();
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [isNeedAdmin, setIsNeedAdmin] = useState(false);
  const [ditolak, setDitolak] = useState(false);
  const [detailComplaint, setDetailComplaint] = useState({});
  const { complaintId } = useLocalSearchParams();

  useEffect(() => {
    if (complaintId) {
      fetchComplaintDetails();
    }
  }, [complaintId]);

  const formatDateWIB = (dateTime) => {
    if (!dateTime) return "Invalid date";
    return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
  };

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

  useEffect(() => {
    console.log("Complaints:", JSON.stringify(detailComplaint, null, 2));
  }, [detailComplaint]);

  const handleCancelComplaint = () => {
    Alert.alert(
      "Konfirmasi",
      "Yakin ingin membatalkan komplain?",
      [
        {
          text: "Tidak",
          style: "cancel",
        },
        {
          text: "Ya, Batalkan",
          style: "destructive",
          onPress: () => {
            postBuyerCancelComplaint(complaintId)
              .then(() => {
                router.replace("../../(tabs)/complaint");
              })
              .catch((err) => {
                showToast(
                  "Gagal",
                  "Gagal membatalkan komplain. Coba lagi.",
                  "error"
                );
                console.log("Cancel error:", err);
              });
          },
        },
      ],
      { cancelable: true }
    );
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
          dateTime={
            formatDateWIB(detailComplaint?.seller_confirm_deadline) || "null"
          }
          contentAfter=" pengajuanmu bakal otomatis disetujui ya!"
        />

        {/* Status Komplain */}
        <StatusKomplain status="Menunggu Persetujuan Seller" />

        {/* Pengajuan */}
        {detailComplaint?.timeline
          ?.slice()
          .reverse()
          .map((item, index) => (
            <TrackDispute
              key={index}
              title={item.label}
              dateTime={new Date(item.timestamp).toLocaleString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              details={[
                {
                  content:
                    index === detailComplaint.timeline.length - 1
                      ? detailComplaint?.buyer_reason
                      : "Proses komplain sedang berjalan.",
                },
                ...(index === detailComplaint.timeline.length - 1 &&
                detailComplaint?.buyer_evidence_urls?.length
                  ? [
                      {
                        imgTitle: "Bukti foto & video",
                        images: detailComplaint.buyer_evidence_urls.map(
                          (url) => ({
                            uri: url,
                          })
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          ))}

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
            detailComplaint?.transaction?.shipment.trackingNumber
              ?.split("")
              .join(" ") || "-"
          }
        />
        <TextView
          title="Ekspedisi"
          content={detailComplaint?.transaction?.shipment?.courier || "-"}
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

      {/* Footer */}
      <View className="flex-row items-center px-4 py-3 border-t border-gray-100 bg-white">
        <TouchableOpacity
          onPress={() => setShowOptionModal(true)}
          className="h-11 w-16 bg-white rounded-xl border border-black items-center justify-center">
          <Text className="text-black text-[20px] font-semibold">⋯</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 ml-2 h-11 bg-black rounded-xl items-center justify-center"
          onPress={() => router.push("../../(tabs)/complaint")}>
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
        onRequestClose={() => setShowOptionModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowOptionModal(false)}>
          <View className="flex-1 bg-black/40" />
        </TouchableWithoutFeedback>

        <View className="bg-white rounded-t-3xl pt-3 pb-8 px-6">
          <View className="w-10 h-1.5 bg-gray-300 rounded-full self-center mb-5" />

          <Text className="text-base font-semibold text-black mb-4">
            Lainnya
          </Text>

          <TouchableOpacity
            className="mb-4"
            onPress={() => router.replace("/dispute/BarangRusak/rusakBarang")}>
            <Text className="text-sm font-medium text-black">
              Ubah Detail Komplain
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCancelComplaint} className="mb-4">
            <Text className="text-sm font-medium text-black">
              Batalkan Komplain
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log("Simulate pressed")}
            className="mb-4">
            <Text className="text-sm font-medium text-black">
              Simulate reject
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
