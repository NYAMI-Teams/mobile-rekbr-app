import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Modal,
  Pressable,
} from "react-native";
import { ChevronLeft, Info, ChevronDown, ChevronUp } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { router, useNavigation } from "expo-router";

export default function DetailMasalahScreen({ onCancel, onConfirm }) {
  const navigation = useNavigation();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4 pt-4">
        {/* Header dengan tombol kembali */}
        <View className="relative items-center justify-center mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-0"
          >
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
            Harap tinjau kembali dan pastikan seluruh data kamu sebelum
            melanjutkan, ya!
          </Text>
        </View>

        {/* Barang yang belum diterima */}
       <Text className="text-base font-semibold mb-2">
          Barang yang belum diterima
        </Text>
        <View  className="bg-[#E5F7F9] rounded-xl p-4 border border-[#D6F0F3]">
          <Text className="font-semibold text-base mb-2">
            iPhone 13 Pro Max
          </Text>
          <Text className="text-base text-gray-500 mb-3">
            RKB - 8080123456789
          </Text>

          <View className="space-y-2">
            <View className="flex-row justify-between mb-2">
              <Text className="text-base text-gray-600">Seller</Text>
              <Text className="text-base text-black">irgil68@gmail.com</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-base text-gray-600">No Resi</Text>
              <Text
                className="text-base text-blue-600 underline"
                onPress={() => Linking.openURL("https://cekresi.com")}
              >
                JX3474124013
              </Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-base text-gray-600">Ekspedisi</Text>
              <Text className="text-base text-black">
                J&T Express Indonesia
              </Text>
            </View>

            {/* Nominal Rekber with Toggle */}
            <Pressable
              onPress={() => setShowBreakdown(!showBreakdown)}
              className="pt-2 border-t border-gray-200"
            >
              {/* Header */}
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

              {/* Breakdown */}
              {showBreakdown ? (
                <View className="space-y-1">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-base text-gray-600">
                      Nominal Barang
                    </Text>
                    <Text className="text-base text-black">
                      Rp. 8.000.000,00
                    </Text>
                  </View>

                  <View className="flex-row justify-between mb-1">
                    <Text className="text-base text-gray-600">
                      Asuransi BNI Life (2%)
                    </Text>
                    <Text className="text-base text-black">Rp. 160.000,00</Text>
                  </View>

                  <View className="flex-row justify-between mb-1">
                    <Text className="text-base text-gray-600">
                      Biaya Aplikasi (0.8%)
                    </Text>
                    <Text className="text-base text-black">Rp. 64.000,00</Text>
                  </View>

                  <View className="flex-row justify-between pt-1 border-t border-gray-200 mt-1">
                    <Text className="text-lg font-bold text-black">Total</Text>
                    <Text className="text-lg font-bold text-black">
                      Rp. 8.080.000,00
                    </Text>
                  </View>
                </View>
              ) : (
                <View className="flex-row justify-between">
                  <Text className="text-sm text-black font-semibold">
                    Rp. 8.080.000,00
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Tombol Kirim */}
      </ScrollView>

      <View className="mb-6">
        {/* Tombol yang membuka modal */}
        <PrimaryButton
          title="Diskusi via email dengan penjual"
          className="mb-6"
          onPress={() => setModalVisible(true)}
        />

        {/* Modal */}
        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="absolute inset-0 z-50 justify-center items-center bg-black/30">
            <View className="w-[90%] bg-white rounded-xl shadow-md p-5 border border-gray-200">
              {/* Header */}
              <View className="flex-row items-start space-x-3 mb-6">
                <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
                  <Text className="text-white font-bold text-xs">i</Text>
                </View>
                <Text className="flex-1 text-lg font-medium text-black">
                  Apakah kamu sudah yakin untuk ringkasan komplain ini?
                </Text>
              </View>

              {/* Buttons */}
              <View className="flex-row justify-between">
                <Pressable
                  onPress={() => setModalVisible(false)} // ← close modal
                  className="flex-1 py-3 rounded-lg bg-gray-100 mr-2"
                >
                  <Text className="text-center text-black font-semibold text-base">
                    Kembali
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    console.log("Konfirmasi komplain dikirim.");
                    setModalVisible(false);
                    router.replace({
                      pathname: "/Dispute/HilangDisputeDetail", // pastikan file-nya app/disputedetail.jsx
                      params: {
                        status: "Investigasi", // ini bisa kamu ganti sesuai logikamu
                      },
                    });
                  }}
                  className="flex-1 py-3 rounded-lg bg-blue-100 ml-2"
                >
                  <Text className="text-center text-black font-semibold text-base">
                    Konfirmasi
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
