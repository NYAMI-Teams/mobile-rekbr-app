import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { StatusBar } from "expo-status-bar";

import ComplaintStepBar from "@/components/ComplaintStepBar";
import {
  getDetailBuyerComplaint,
  cancelComplaintById,
} from "@/utils/api/complaint";
import { showToast } from "@/utils";
import Modal from "react-native-modal";

export default function ComplaintDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [transactionDetail, setTransactionDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);

  useEffect(() => {
    if (id) fetchTransactionDetail();
  }, [id]);

  const fetchTransactionDetail = async () => {
    try {
      const res = await getDetailBuyerComplaint(id);
      setTransactionDetail(res.data);
      console.log("ini transaction detail", JSON.stringify(res.data, null, 2));
    } catch (err) {
      showToast("Gagal", "Gagal mengambil detail transaksi", "error");
    } finally {
      setLoading(false);
    }
  };

  const complaint = transactionDetail?.Complaint?.slice()?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )?.[0];


  const status = complaint?.status || "-";
  const type = complaint?.type || "-";

  const handleCancelComplaint = async () => {
    if (!complaint?.id) {
      showToast("Gagal", "ID komplain tidak ditemukan", "error");
      return;
    }

    try {
      await cancelComplaintById(complaint.id);
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
    switch (status) {
      case "under_investigation":
        return "Dalam Investigasi";
      case "approved_by_admin":
        return "Komplain Disetujui";
      case "rejected_by_seller":
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
      damaged: {
        under_investigation: "Barang kamu sedang kami cek kerusakannya.",
        approved_by_admin: "Komplain disetujui karena barang rusak.",
        rejected_by_seller: null,
      },
      not_as_described: {
        under_investigation: "Barang tidak sesuai sedang dievaluasi.",
        approved_by_admin: "Komplain disetujui karena tidak sesuai deskripsi.",
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
      ["rejected_by_seller", "rejected", "canceled"].includes(status)
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
          showsVerticalScrollIndicator={false}>
          {/* Pesan Status */}
          {message && (
            <View className="bg-white p-3 rounded-xl border border-gray-100 mb-4">
              <Text className="text-sm font-semibold mb-1">
                {getStatusLabel(status)}
              </Text>
              <Text className="text-gray-600 text-xs">{message}</Text>
            </View>
          )}

          {/* Status Ringkas */}
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600 text-sm">Status Komplain :</Text>
              <Text className="text-black font-semibold text-sm">
                {getStatusLabel(status)}
              </Text>
            </View>
          </View>

          {/* Info Transaksi */}
          <View className="space-y-3 mt-4">
            <InfoBlock label="Seller" value={transactionDetail?.sellerEmail} />
            <InfoBlock
              label="Nama Barang"
              value={transactionDetail?.itemName}
            />
            <InfoBlock
              label="Tagihan Rekber"
              value={`Rp. ${Number(
                transactionDetail?.totalAmount || 0
              ).toLocaleString("id-ID")},00`}
            />
            <InfoBlock
              label="ID Transaksi"
              value={transactionDetail?.transactionCode}
              copyable
            />
            <InfoBlock
              label="No Resi"
              value={transactionDetail?.shipment?.trackingNumber}
              copyable
            />
            <InfoBlock
              label="Ekspedisi"
              value={transactionDetail?.shipment?.courier}
            />
          </View>

          {/* Tombol Aksi */}
          {shouldShowActions && (
            <View className="mt-8 pb-6">
              <Pressable className="flex-row items-center">
                {/* Tombol More */}
                <View className="justify-center items-center">
                  <TouchableOpacity
                    onPress={() => setShowActionModal(true)}
                    className="w-11 h-11 border border-gray-300 rounded-xl justify-center items-center bg-white mr-3">
                    <Text className="text-black text-xl">•••</Text>
                  </TouchableOpacity>

                  {/* Modal Aksi */}
                  <Modal
                    isVisible={showActionModal}
                    onBackdropPress={() => setShowActionModal(false)}
                    onBackButtonPress={() => setShowActionModal(false)}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    style={{ margin: 0, justifyContent: "flex-end" }}>
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
                        className="mb-4">
                        <Text className="text-black text-base font-medium mb-6">
                          Ubah Detail Komplain
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setShowActionModal(false);
                          handleCancelComplaint();
                        }}>
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
                  className="flex-1 bg-black py-3 rounded-xl justify-center items-center">
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
            }}>
            <Copy size={20} color="#999" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
