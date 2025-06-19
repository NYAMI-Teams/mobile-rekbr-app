import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import StepKomplainBar from "../../components/KomplainBar";
import { ChevronLeft, Copy } from "lucide-react-native";
import { useNavigation } from "expo-router";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";

export default function DisputeDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const status = "rejected"; // bisa juga "approved", "pending", dll

  const steps = [
    "Investigasi",
    status === "approved" ? "Disetujui" : "Ditolak",
  ];

  const currentStep = 0;

  const getStatusLabel = (status) => {
    switch (status) {
      case "investigasi":
        return "Dalam Investigasi";
      case "approved":
        return "Disetujui";
      case "rejected":
        return "Ditolak";
      case "selesai":
        return "Selesai";
      default:
        return "-";
    }
  };

  const resi = "JX3474124013";
  const tranksaksi = "123456789";
  const handleCopy = async () => {
    await Clipboard.setStringAsync(resi);
    Alert.alert("Disalin", "Nomor resi berhasil disalin.");
  };

  const [showPopup, setShowPopup] = useState(false);

  const handleEdit = () => {
    // Aksi ubah detail
    setShowPopup(false);
  };

  const handleCancel = () => {
    // Aksi batalkan komplain
    setShowPopup(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="relative items-center justify-center mb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute left-0"
        >
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-center">
          Detail Komplain
        </Text>
      </View>
      {/* Step Progress Bar */}
      <View className="items-center">
        <StepKomplainBar
          currentStep={currentStep}
          steps={steps}
          status={status}
        />
      </View>
      <ScrollView className="px-4 pt-4">
        {/* Header Title */}

        {/* Status Box */}
        <View className="bg-white p-3 rounded-xl border border-gray-100 mb-4">
          <Text className="text-sm font-semibold mb-1">
            Hey, kami lagi cek pengiriman barang kamu di ekspedisi, nih.
          </Text>
          <Text className="text-gray-600 text-xs">
            Kita bakal nilai kesalahan ini dan cari solusi terbaik!
          </Text>
        </View>

        {/* Status */}
        <View className="p-4">
          {/* Status Komplain */}
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600 text-sm">Status Komplain :</Text>
            <Text className="text-black font-semibold text-sm">
              {getStatusLabel(status)}
            </Text>
          </View>

          {currentStep >= 1 && (
            <View className="border-t border-b border-gray-200 py-4">
              <Text className="text-base font-semibold">
                {status === "approved"
                  ? "Tim kami memberikan Refund dana"
                  : "Admin menolak atas komplain kamu"}
              </Text>
              <Text className="text-sm text-gray-500">
                17 Juni 2025, 10:05 WIB
              </Text>
              {status === "rejected" && (
                <View className="bg-gray-100 mt-3 p-3 rounded-md">
                  <Text className="text-sm text-gray-700">
                    Sayangnya, kami tidak bisa memproses klaim barang hilang
                    karena pengiriman sudah terkonfirmasi sukses oleh kurir.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Step 0 selalu ditampilkan */}
          <View className="border-b border-gray-200 py-4">
            <Text className="text-base font-semibold">
              Investigasi barang pada pengiriman kamu
            </Text>
            <Text className="text-sm text-gray-500">
              16 Juni 2025, 10:00 WIB
            </Text>
          </View>
        </View>

        {/* Info Detail */}
        <View className="space-y-3">
          <View className="mb-2">
            <Text className="text-gray-600 text-base">Seller</Text>
            <Text className="text-black text-xl font-medium">
              irgil68@gmail.com
            </Text>
          </View>
          <View className="mb-2">
            <Text className="text-gray-600 text-base">Nama Barang</Text>
            <Text className="text-black text-xl font-medium">
              IPhone 13 Pro Max
            </Text>
          </View>
          <View className="mb-2">
            <Text className="text-gray-600 text-base">Tagihan Rekber</Text>
            <Text className="text-black text-xl font-medium">
              Rp. 8.080.000,00
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 text-base mb-1">ID Transaksi</Text>
            <View className="flex-row justify-start items-center space-x-1">
              <Text className="text-black text-xl font-medium mr-2">123456789</Text>
              <Pressable onPress={() => handleCopy("123456789")}>
                <Copy size={20} color="#999" />
              </Pressable>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 text-base mb-1">No Resi</Text>
            <View className="flex-row justify-start items-center space-x-1">
              <Text className="text-black text-xl font-medium mr-2">
                JX3474124013
              </Text>
              <Pressable onPress={() => handleCopy("JX3474124013")}>
                <Copy size={20} color="#999" />
              </Pressable>
            </View>
          </View>
          <View className="mb-2">
            <Text className="text-gray-600 text-base">Ekspedisi</Text>
            <Text className="text-black text-xl font-medium">
              J&T Express Indonesia
            </Text>
          </View>
          <View className="mb-2">
            <Text className="text-gray-600 text-base">ID Transaksi</Text>
            <Text className="text-black text-xl font-medium">-</Text>
          </View>
        </View>
        {/* Button */}
        <View className="mt-8 px-4 pb-6">
          <Pressable className="flex-row items-center">
            {/* Tombol ikon titik tiga */}
            <View className="justify-center items-center">
              {/* Tombol titik tiga */}
              <TouchableOpacity
                onPress={() => setShowPopup(true)}
                className="w-11 h-11 border border-gray-300 rounded-xl justify-center items-center bg-white mr-3"
              >
                <Text className="text-black text-xl">•••</Text>
              </TouchableOpacity>

              {/* Popup Modal */}
              <Modal
                visible={showPopup}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPopup(false)}
              >
                <Pressable
                  className="flex-1 bg-black/40 justify-end"
                  onPress={() => setShowPopup(false)}
                >
                  <Pressable
                    className="bg-white rounded-t-2xl pt-2 pb-6 px-4"
                    onPress={() => {}}
                  >
                    <View className="items-center">
                      <View className="w-12 h-1.5 bg-gray-300 rounded-full mb-4" />
                    </View>
                    <Text className="text-lg font-semibold mb-8">Lainnya</Text>
                    <TouchableOpacity
                      onPress={() => router.push("/Dispute/HilangKomplain")}
                      className="mb-4"
                    >
                      <Text className="text-black text-base font-medium mb-6">
                        Ubah Detail Komplain
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => router.push("../(tabs)/dispute")}
                    >
                      <Text className="text-black text-base font-medium mb-10">
                        Batalkan Komplain
                      </Text>
                    </TouchableOpacity>
                  </Pressable>
                </Pressable>
              </Modal>
            </View>

            {/* Tombol teks */}
            <Pressable
              onPress={() => router.push("../(tabs)/dispute")} // ganti dengan path tujuanmu
              className="flex-1 bg-black py-3 rounded-xl justify-center items-center"
            >
              <Text className="text-white font-semibold text-base">
                Kirim Seller Email
              </Text>
            </Pressable>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
