import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { StatusBar } from "expo-status-bar";
import dayjs from "dayjs";
import "dayjs/locale/id";

import ComplaintStepBar from "@/components/ComplaintStepBar";
import {
  getBuyerComplaintDetail,
  cancelComplaintById,
} from "@/utils/api/complaint";
import { showToast } from "@/utils";
import Modal from "react-native-modal";

dayjs.locale("id");

export default function ComplaintDetailScreen({ label, timestamp }) {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dateText = timestamp
    ? dayjs(timestamp).format("D MMMM YYYY, HH:mm [WIB]")
    : null;

  const [complaintDetail, setComplaintDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);

  useEffect(() => {
    if (id) fetchComplaintDetail();
  }, [id]);

  const fetchComplaintDetail = async () => {
    try {
      const res = await getBuyerComplaintDetail(id);
      console.log(res.data, "============>");
      setComplaintDetail(res.data);
    } catch (err) {
      showToast("Gagal", "Gagal mengambil detail komplain", "error");
    } finally {
      setLoading(false);
    }
  };

  const status = complaintDetail?.status || "-";
  const type = complaintDetail?.type || "-";

  const handleCancelComplaint = async () => {
    if (!complaintDetail?.id) {
      showToast("Gagal", "ID komplain tidak ditemukan", "error");
      return;
    }

    try {
      await cancelComplaintById(complaintDetail.id);
      showToast("Berhasil", "Komplain berhasil dibatalkan", "success");
      router.replace("/(tabs)/complaint");
    } catch (err) {
      showToast(
        "Gagal",
        err?.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
    }
  };

  const getStatusLabel = (status) => {
    console.log("status", status);
    switch (status) {
      case "under_investigation":
        return "Dalam Investigasi";
      case "approved_by_admin":
        return "Tim Rekbr by BNI meminta maaf atas barang yang hilang , dan bukti kurir ekspedisi tidak memenuhi aturan SOP kami.";
      case "rejected_by_admin":
        return "Komplain Ditolak";
      case "canceled":
        return "Komplain Dibatalkan";
      case "completed":
        return "Selesai";
      default:
        return "-";
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case "under_investigation":
        return "Dalam Investigasi";
      case "approved_by_admin":
        return "Komplain disetujui";
      case "rejected_by_seller":
        return "Komplain Ditolak";
      case "rejected_by_admin":
        return "Komplain Ditolak";
      case "canceled":
        return "Komplain Dibatalkan";
      case "completed":
        return "Selesai";
      default:
        return "-";
    }
  };

  const getStatusMessage = (type, status) => {
    const messages = {
      lost: {
        under_investigation: "Kami sedang cek pengiriman barang kamu.",
        approved_by_admin: "Barang hilang telah disetujui oleh admin.",
        rejected_by_seller: null,
      },
    };

    return (
      messages[type]?.[status] ?? "Kami sedang mengevaluasi komplain kamu."
    );
  };

  const getStepStatus = (status) => {
    if (status === "approved_by_admin") {
      return { steps: ["Investigasi", "Disetujui"], currentStep: 1 };
    } else if (
      [
        "rejected_by_seller",
        "rejected",
        "canceled",
        "rejected_by_admin",
      ].includes(status)
    ) {
      return { steps: ["Investigasi", "Ditolak"], currentStep: 1 };
    } else {
      return { steps: ["Investigasi", "Menunggu"], currentStep: 0 };
    }
  };

  const { steps, currentStep } = getStepStatus(status);
  const message = getStatusMessage(type, status);
  const shouldShowActions = status === "under_investigation";

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-base font-semibold text-black">
          Detail Komplain
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Step Bar */}
      <View className="items-center px-4">
        <ComplaintStepBar
          currentStep={currentStep}
          steps={steps}
          status={status}
        />
      </View>

      {/* Konten Scrollable */}
      <View className="flex-1">
        <ScrollView
          className="px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Pesan Status */}
          {message && (
            <View className="flex-row items-start bg-white p-4 rounded-xl mb-4 border border-gray-100 space-x-3">
              {/* Tampilkan gambar dan title hanya jika status bukan rejected */}
              {!status?.includes("rejected") && (
                <Image
                  source={require("../../assets/admin1.png")}
                  className="w-10 h-10 rounded-full"
                  resizeMode="contain"
                />
              )}

              <View className="flex-1">
                {!status?.includes("rejected") && (
                  <Text className="text-sm font-semibold mb-1">
                    {getStatusLabel(status)}
                  </Text>
                )}
                <Text className="text-gray-600 text-xs">{message}</Text>
              </View>
            </View>
          )}

          {/* Status Ringkas */}
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600 text-sm">Status Komplain :</Text>
              <Text className="text-black font-semibold text-sm">
                {getStatus(complaintDetail?.status)}
              </Text>
            </View>
          </View>

          <ComplaintTimeline
            timeline={complaintDetail?.timeline}
            message={complaintDetail?.messsage}
            status={complaintDetail?.status}
          />

          {/* Info Transaksi */}
          <View className="space-y-3 mt-4">
            <InfoBlock
              label="Seller"
              value={complaintDetail?.transaction?.sellerEmail}
            />
            <InfoBlock
              label="Nama Barang"
              value={complaintDetail?.transaction?.itemName}
            />
            <InfoBlock
              label="Tagihan Rekber"
              value={`Rp. ${Number(
                complaintDetail?.transaction?.totalAmount || 0
              ).toLocaleString("id-ID")},00`}
            />
            <InfoBlock
              label="ID Transaksi"
              value={complaintDetail?.transaction?.transactionCode}
              copyable
            />
            <InfoBlock
              label="No Resi"
              value={complaintDetail?.transaction?.shipment?.trackingNumber}
              copyable
            />
            <InfoBlock
              label="Ekspedisi"
              value={complaintDetail?.transaction?.shipment?.courier}
            />
          </View>

          {/* Timeline */}

          {/* Tombol Aksi */}
          {shouldShowActions && (
            <View className="mt-8 pb-6">
              <Pressable className="flex-row items-center">
                {/* Tombol More */}
                <View className="justify-center items-center">
                  <TouchableOpacity
                    onPress={() => setShowActionModal(true)}
                    className="w-11 h-11 border border-gray-300 rounded-xl justify-center items-center bg-white mr-3"
                  >
                    <Text className="text-black text-xl">•••</Text>
                  </TouchableOpacity>

                  {/* Modal Aksi */}
                  <Modal
                    isVisible={showActionModal}
                    onBackdropPress={() => setShowActionModal(false)}
                    onBackButtonPress={() => setShowActionModal(false)}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    style={{ margin: 0, justifyContent: "flex-end" }}
                  >
                    <View className="bg-white rounded-t-2xl pt-2 pb-6 px-4">
                      <View className="items-center">
                        <View className="w-12 h-1.5 bg-gray-300 rounded-full mb-4" />
                      </View>
                      <Text className="text-lg font-semibold mb-8">
                        Lainnya
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          setShowActionModal(false);
                          router.push("/Complaint/Edit?id=" + id);
                        }}
                        className="mb-4"
                      >
                        <Text className="text-black text-base font-medium mb-6">
                          Ubah Detail Komplain
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setShowActionModal(false);
                          handleCancelComplaint();
                        }}
                      >
                        <Text className="text-black text-base font-medium mb-10">
                          Batalkan Komplain
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                </View>

                {/* Tombol Hubungi Seller */}
                <Pressable
                  onPress={() => router.push("/Complaint")}
                  className="flex-1 bg-black py-3 rounded-xl justify-center items-center"
                >
                  <Text className="text-white font-semibold text-base">
                    Hubungi Seller
                  </Text>
                </Pressable>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Komponen InfoBlock
function InfoBlock({ label, value, copyable = false }) {
  return (
    <View className="mb-4">
      <Text className="text-gray-600 text-base mb-1">{label}</Text>
      <View className="flex-row items-center space-x-2">
        <Text className="text-black text-xl font-medium">{value || "-"}</Text>
        {copyable && value && (
          <Pressable
            onPress={() => {
              Clipboard.setStringAsync(value);
              Alert.alert("Disalin", `${label} berhasil disalin.`);
            }}
          >
            <Copy size={20} color="#999" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

// Komponen Timeline
function ComplaintTimeline({ timeline, status, message }) {
  const isRejected =
    status === "rejected_by_seller" || status === "rejected_by_admin";

  if (!timeline || timeline.length === 0) {
    return (
      <Text className="text-gray-400 text-sm mt-4">
        Belum ada aktivitas dalam komplain ini.
      </Text>
    );
  }

  const filteredTimeline = timeline.filter(
    (item) => item.label !== "Komplain Selesai"
  );

  return (
    <View className="mt-6">
      {timeline
        .slice()
        .reverse()
        .map((item, index) => (
          <TimelineItem
            key={index}
            label={item.label}
            timestamp={item.timestamp}
            message={item.message}
            isRejected={isRejected && index === 0}
          />
        ))}
    </View>
  );
}

// Komponen TimelineItem
function TimelineItem({ label, timestamp, isRejected, message }) {
  const formattedDate = timestamp
    ? dayjs(timestamp).format("D MMMM YYYY, HH:mm [WIB]")
    : null;

  return (
    <View className="mb-5 border-b border-gray-200 pb-3">
      <Text
        className={`text-base font-semibold ${
          isRejected ? "text-red-600" : "text-black"
        }`}
      >
        {label}
      </Text>
      {message && (
        <View className="bg-gray-100 p-3 rounded-xl mt-2">
          <Text className="text-black text-sm">{message}</Text>
        </View>
      )}
      {formattedDate && (
        <Text className="text-gray-500 text-sm mt-1">{formattedDate}</Text>
      )}

      {isRejected && (
        <Text className="text-red-500 text-sm mt-2">
          Komplain kamu telah ditolak oleh pihak terkait.
        </Text>
      )}
    </View>
  );
}
