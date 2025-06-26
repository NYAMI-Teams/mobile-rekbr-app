// DisputeDetail.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, ClipboardPaste, ChevronDown } from "lucide-react-native";
import { router, useNavigation } from "expo-router";
import PrimaryButton from "../../../components/PrimaryButton";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import ProblemDisplay from "../../../components/dispute/problemDisplay";
import ProductCard from "../../../components/dispute/productCard";
import { InputField } from "../../../components/dispute/InputField";
import { UploadProve } from "../../../components/dispute/UploadProve";
import { InfoBanner } from "../../../components/dispute/InfoBanner";
import { TrackDispute } from "../../../components/dispute/TrackDispute";
import { useRouter } from "expo-router";

export default function KomplainBatal() {
  const router = useRouter();
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [media, setMedia] = useState([]);

  const solutionOptions = [
    {
      title: "Pengembalian barang dan dana",
      desc: "Dana bakal balik ke buyer setelah seller atau pihak terkait terima barang bermasalah.",
    },
    {
      title: "Refund Barang",
      desc: "Seller mengirimkan barang pengganti setelah buyer mengembalikan barang",
    },
  ];

  const handleSubmit = () => setShowConfirmModal(true);

  const handleConfirm = () => {
    setShowConfirmModal(false);
    router.push("../../(tabs)/complaint");
  };

  const pickMedia = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Izinkan akses ke galeri untuk mengunggah bukti.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.assets || result.assets.length === 0) return;

    const selected = result.assets[0];
    const uri = selected.uri;
    const type = selected.type;
    const extension = uri.split(".").pop().toLowerCase();
    const sizeMB = (await FileSystem.getInfoAsync(uri)).size / (1024 * 1024);

    const allowedImages = ["jpg", "jpeg", "png"];
    const allowedVideos = ["mp4", "mov"];

    if (type === "image" && !allowedImages.includes(extension)) {
      alert("Format foto tidak didukung. Gunakan .jpg atau .png");
      return;
    }

    if (type === "video" && !allowedVideos.includes(extension)) {
      alert("Format video tidak didukung. Gunakan .mp4 atau .mov");
      return;
    }

    if (type === "image" && sizeMB > 10) {
      alert("Ukuran foto melebihi 10MB");
      return;
    }

    if (type === "video" && sizeMB > 50) {
      alert("Ukuran video melebihi 50MB");
      return;
    }

    if (type === "video") {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const info = await MediaLibrary.getAssetInfoAsync(asset);
      if (info.duration > 300) {
        alert("Durasi video melebihi 5 menit");
        return;
      }
    }

    const photoCount = media.filter((m) => m.type === "image").length;
    const videoCount = media.filter((m) => m.type === "video").length;

    if (
      (type === "image" && media.length >= 5) ||
      (type === "video" && (videoCount >= 1 || photoCount > 4))
    ) {
      alert("Maksimal 5 file atau 4 foto + 1 video.");
      return;
    }

    setMedia([...media, selected]);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-base font-semibold">Detail Komplain</Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="h-2 bg-[#f5f5f5] mt-3" />
      <ScrollView className="px-4 pt-2 pb-4">
        <TrackDispute
          title=" Komplain Dibatalkan"
          dateTime="19 Juni 2025, 10 : 00 WIB"
          details={[
            {
              content: "Kamu membatalkan komplain ini.",
            },
          ]}
        />
        <View className="h-2 bg-[#f5f5f5] mt-3" />

        {/* Masalah */}
        <ProblemDisplay
          image={require("../../../assets/barangrusak.png")}
          problemType="Barang rusak"
        />

        {/* Info Barang */}
        <ProductCard
          productName="iPhone 13 Pro Max"
          idx="RKB - 8080123456789"
          sellerMail="irgi168@gmail.com"
          noResi="JX3474124013"
          expedisi="J&T Express Indonesia"
          nominal="1000000"
        />

        {/* Alasan */}
        <InputField
          title="Alasan kerusakan"
          placeholder="Jelaskan kerusakan barang dan lampirkan foto."
        />

        {/* Bukti */}
        <UploadProve
          media={media}
          pickMedia={pickMedia}
          setShowTipsModal={setShowTipsModal}
        />

        {/* Solusi */}
        <Text className="text-sm font-semibold text-black mb-2">
          Solusi apa yang kamu inginkan
        </Text>
        <Text className="text-xs text-gray-600 mb-3">
          Solusi bisa berubah, sesuai kesepakatan antara Seller, Buyer dan Tim
          Rekbr by BNI
        </Text>
        <TouchableOpacity
          className="flex-row justify-between items-center bg-white border border-gray-300 rounded-xl px-4 py-4"
          onPress={() => setShowModal(true)}>
          <Text
            className={`text-sm ${
              selectedSolution ? "text-black" : "text-gray-400"
            }`}>
            {selectedSolution || "Pilih solusi kamu"}
          </Text>
          <ChevronDown size={16} color="#999" />
        </TouchableOpacity>
      </ScrollView>

      {/* Tombol Kirim */}
      <View className="absolute bottom-4 left-4 right-4">
        <PrimaryButton title="Ajukan Komplain Kembali" onPress={handleSubmit} />
      </View>

      {/* Modal Konfirmasi Kirim */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/40 px-6">
          <View className="bg-white rounded-2xl w-full px-6 pt-5 pb-5">
            <View className="flex-row items-start space-x-3 mb-7">
              <Image
                source={require("../../../assets/icon-info-blue.png")}
                className="w-5 h-5 mt-1"
                resizeMode="contain"
              />
              <Text className="text-[17px] text-black font-semibold leading-[22px] flex-1">
                Apakah kamu sudah yakin untuk ringkasan komplain ini?
              </Text>
            </View>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                className="w-[48%] py-[14px] border border-gray-300 rounded-xl items-center">
                <Text className="text-[16px] font-semibold text-black">
                  Kembali
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                className="w-[48%] py-[14px] bg-blue-600 rounded-xl items-center">
                <Text className="text-[16px] font-semibold text-white">
                  Konfirmasi
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Pilih Solusi */}
      <Modal visible={showModal} transparent animationType="slide">
        <View className="flex-1 justify-end">
          <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
            <View className="flex-1 bg-black/30" />
          </TouchableWithoutFeedback>
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10">
            <View className="w-10 h-1.5 bg-gray-300 rounded-full self-center mb-4" />
            <Text className="text-base font-semibold mb-4">Pilih Solusi</Text>
            {solutionOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                className={`mb-3 p-4 rounded-xl border ${
                  selectedSolution === item.title
                    ? "border-gray-800 bg-gray-50"
                    : "border-gray-200"
                }`}
                onPress={() => {
                  setSelectedSolution(item.title);
                  setShowModal(false);
                }}>
                <Text className="text-sm font-semibold text-black mb-1">
                  {item.title}
                </Text>
                <Text className="text-xs text-gray-600">{item.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Modal Tips Upload */}
      <Modal visible={showTipsModal} transparent animationType="slide">
        <View className="flex-1 justify-end">
          <TouchableWithoutFeedback onPress={() => setShowTipsModal(false)}>
            <View className="flex-1 bg-black/30" />
          </TouchableWithoutFeedback>
          <View
            className="bg-white rounded-t-3xl pt-4 px-6 pb-6"
            style={{ maxHeight: "85%" }}>
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />
            <Text className="text-lg font-semibold mb-4">
              Tips Upload Bukti
            </Text>
            {[
              "Tampilkan kondisi barang sebelum kemasan dibuka",
              "Tampilkan kondisi barang sebelum kemasan dibuka",
              "Jika kerusakan disebabkan oleh kurir, tampilkan penyebab kerusakan jika memungkinkan",
              "Khusus video, tampilkan kerusakan yang menunjukkan tidak berfungsinya barang.",
            ].map((tip, index) => (
              <View key={index} className="flex-row items-start mb-3">
                <Image
                  source={require("../../../assets/icon-check-green.png")}
                  className="w-5 h-5 mt-0.5 mr-2"
                  resizeMode="contain"
                />
                <Text className="text-sm text-black leading-snug flex-1">
                  {tip}
                </Text>
              </View>
            ))}

            <View
              style={{ backgroundColor: "#F3F4F6" }}
              className="p-4 rounded-xl mt-4">
              <Text className="text-sm font-semibold text-black mb-2">
                Format yang didukung:
              </Text>
              <Text className="text-sm text-black leading-tight mb-1">
                • Maksimal <Text className="font-semibold">5 foto</Text> atau{" "}
                <Text className="font-semibold">4 foto dan 1 video</Text>
              </Text>
              <Text className="text-sm text-black leading-tight mb-1">
                • Format yang diterima adalah{" "}
                <Text className="font-semibold">.jpg, .png, .mp4, .mov</Text>
              </Text>
              <Text className="text-sm text-black leading-tight mb-1">
                • Ukuran maksimal foto adalah{" "}
                <Text className="font-semibold">10 MB per file</Text>
              </Text>
              <Text className="text-sm text-black leading-tight mb-1">
                • Ukuran maksimal video adalah{" "}
                <Text className="font-semibold">50 MB per file</Text>
              </Text>
              <Text className="text-sm text-black leading-tight mb-1">
                • Durasi video maksimal adalah{" "}
                <Text className="font-semibold">5 menit</Text>
              </Text>
              <Text className="text-sm text-black leading-tight">
                • Jika video terlalu besar, gunakan video compressor atau{" "}
                <Text className="font-semibold">upload video ke YouTube</Text>{" "}
                dan sertakan link di field alasan
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
