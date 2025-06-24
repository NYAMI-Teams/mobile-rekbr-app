import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { ChevronLeft, ChevronDown, ChevronUp, Copy } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { getDetailBuyerTransaction } from "@/utils/api/buyer";
import { postBuyerComplaint } from "@/utils/api/complaint";
import { formatCurrency, showToast } from "../../utils";

export default function CreateComplaintScreen() {
  const navigation = useNavigation();
  const { transactionId } = useLocalSearchParams();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transaction, setTransaction] = useState(null);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(transaction?.shipment?.trackingNumber || "");
    Alert.alert("Disalin", "Nomor resi berhasil disalin.");
  };

  const handleSubmitComplaint = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const type = "lost";
      const reason = "Barang belum sampai atau kesasar";
      const photo = null;

      console.log("🧾 Payload:", {
        transactionId,
        type,
        reason,
        photo,
      });

      const complaint = await postBuyerComplaint(
        transactionId,
        type,
        reason,
        photo
      );

      if (!complaint?.id) throw new Error("Complaint tidak valid");

      showToast("Berhasil", "Komplain Berhasil dibuat", "success");
      router.replace("/(tabs)/complaint");
    } catch (err) {
      console.log(
        "❌ Error saat createComplaint:",
        err?.response?.data || err.message || err
      );
      Alert.alert("Gagal", err?.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (transactionId) {
      getDetailBuyerTransaction(transactionId)
        .then((res) => {
          console.log("📦 Transaction loaded:", res.data);
          setTransaction(res.data);
        })
        .catch((err) => console.error("❌ Error loading transaction:", err));
    }
  }, [transactionId]);

  if (!transaction) return null;

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="px-4 pt-4">
        {/* Header */}
        <View className="relative items-center justify-center mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-0">
            <ChevronLeft size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-center">
            Detail Masalah
          </Text>
        </View>

        {/* Info SOP */}
        <View className="flex-row items-start bg-white p-4 rounded-xl mb-4 border border-gray-100 space-x-3">
          <Image
            source={require("../../assets/admin1.png")}
            className="w-10 h-10 rounded-full"
            resizeMode="contain"
          />
          <Text className="text-sm text-gray-700 flex-1">
            FYI dulu nih! Pengiriman udah ada SOP jelas dengan dimana kurir
            wajib foto penerima + titik koordinat.
          </Text>
        </View>

        {/* Box Investigasi */}
        <View className="bg-white border border-gray-100 p-4 rounded-xl mb-4">
          <Text className="font-semibold text-sm mb-1">
            Minta Rekbr by BNI Care Investigasi Pengiriman
          </Text>
          <Text className="text-sm text-gray-700">
            Rekbr by BNI akan menghubungi pihak kurir. Dana bermasalah akan
            dikembalikan setelah komplainmu disetujui.
          </Text>
        </View>

        {/* Masalah yang dipilih */}
        <Text className="text-sm font-semibold mb-2">Masalah yang dipilih</Text>
        <View className="flex-row items-start bg-white p-4 rounded-xl mb-4 border border-gray-100 space-x-3">
          <Image
            source={require("../../assets/belumsampai.png")}
            className="w-10 h-10 rounded-full"
            resizeMode="contain"
          />
          <Text className="text-sm text-gray-700 flex-1">
            Barang belum sampai atau kesasar
          </Text>
        </View>

        {/* Info Barang */}
        <Text className="text-base font-semibold mb-2">
          Barang yang belum diterima
        </Text>
        <View className="bg-[#E5F7F9] rounded-xl p-4 border border-[#D6F0F3]">
          <Text className="font-semibold text-base mb-2">
            {transaction.itemName}
          </Text>
          <Text className="text-base text-gray-500 mb-3">
            {transaction.transactionCode}
          </Text>

          <View className="space-y-2">
            <View className="flex-row justify-between mb-2">
              <Text className="text-base text-gray-600">Seller</Text>
              <Text className="text-base text-black">
                {transaction.sellerEmail}
              </Text>
            </View>

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base text-black">No Resi</Text>
              <Pressable
                onPress={handleCopy}
                className="flex-row items-center space-x-1">
                <Copy size={16} color="#999" />
                <Text className="text-base text-blue-500 font-semibold">
                  {transaction.shipment?.trackingNumber || "-"}
                </Text>
              </Pressable>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-base text-gray-600">Ekspedisi</Text>
              <Text className="text-base text-black">
                {transaction.shipment?.courier || "-"}
              </Text>
            </View>

            {/* Nominal Rekber */}
            <Pressable
              onPress={() => setShowBreakdown(!showBreakdown)}
              className="pt-2 border-t border-gray-200">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm font-semibold text-black">
                  Nominal Rekber
                </Text>
                {showBreakdown ? (
                  <ChevronUp size={16} color="black" />
                ) : (
                  <ChevronDown size={16} color="black" />
                )}
              </View>
              {showBreakdown && (
                <View className="space-y-1">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-base text-gray-600">
                      Nominal Barang
                    </Text>
                    <Text className="text-base text-black">
                      {formatCurrency(transaction.itemPrice)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-base text-gray-600">
                      Asuransi BNI Life
                    </Text>
                    <Text className="text-base text-black">
                      {formatCurrency(transaction.insuranceFee)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-base text-gray-600">
                      Biaya Aplikasi
                    </Text>
                    <Text className="text-base text-black">
                      {formatCurrency(transaction.platformFee)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between pt-1 border-t border-gray-200 mt-1">
                    <Text className="text-lg font-bold text-black">Total</Text>
                    <Text className="text-lg font-bold text-black">
                      {formatCurrency(transaction.totalAmount)}
                    </Text>
                  </View>
                </View>
              )}
              {!showBreakdown && (
                <View className="flex-row justify-between">
                  <Text className="text-sm text-black font-semibold">
                    {formatCurrency(transaction.totalAmount)}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Tombol Kirim dan Modal */}
      <View className="mb-6">
        <PrimaryButton
          title="Kirim"
          className="mb-6"
          onPress={() => setModalVisible(true)}
        />
        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}>
          <View className="absolute inset-0 z-50 justify-center items-center bg-black/30">
            <View className="w-[90%] bg-white rounded-xl shadow-md p-5 border border-gray-200">
              <View className="flex-row items-start space-x-3 mb-6">
                <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
                  <Text className="text-white font-bold text-xs">i</Text>
                </View>
                <Text className="flex-1 text-lg font-medium text-black">
                  Apakah kamu sudah yakin untuk ringkasan komplain ini?
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Pressable
                  onPress={() => setModalVisible(false)}
                  className="flex-1 py-3 rounded-lg bg-gray-100 mr-2">
                  <Text className="text-center text-black font-semibold text-base">
                    Kembali
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleSubmitComplaint}
                  className="flex-1 py-3 rounded-lg bg-blue-100 ml-2">
                  <Text className="text-center text-black font-semibold text-base">
                    {isSubmitting ? "Mengirim..." : "Konfirmasi"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
