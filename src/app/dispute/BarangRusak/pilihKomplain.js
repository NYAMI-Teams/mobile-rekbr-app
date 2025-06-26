// DisputeDetail.js
import React, { useEffect, useState } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { getDetailBuyerTransaction } from "../../../utils/api/buyer";
import { postBuyerComplaint } from "../../../utils/api/complaint";
import { showToast } from "../../../utils";

export default function DisputeDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [problemType, setProblemType] = useState("damaged");
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [media, setMedia] = useState([]);
  const [detailTransaction, setDetailTransaction] = useState({});
  const [reason, setReason] = useState("");
  const [isLoading, setLoading] = useState(false);

  // console.log("data:", data.id);
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const res = await getDetailBuyerTransaction(id);
        setDetailTransaction(res.data);
      } catch (err) {
        showToast(
          "Gagal",
          "Gagal mengambil data transaksi. Silahkan coba lagi.",
          "error"
        );
      }
    };

    fetchTransactionDetails();
  }, [id]);

  const solutionOptions = [
    {
      title: "Pengembalian barang dan dana",
      desc: "Dana bakal balik ke buyer setelah seller atau pihak terkait terima barang bermasalah.",
    },
    {
      title: "Refund Barang",
      desc: "Seller mengirimkan barang pengganti setelah buyer mengembalikan barang",
      disabled: true,
    },
  ];

  const handleSubmit = () => setShowConfirmModal(true);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const problemType = "Barang rusak";

      console.log("==== Komplain Dikirim ====");
      console.log("ID Transaksi:", id);
      console.log("Problem Type:", problemType);
      console.log("Alasan:", reason);
      console.log("Media:", media);
      console.log("=========================");

      // Nanti tinggal aktifkan ini kalau sudah
      const res = await postBuyerComplaint(id, problemType, reason, media);
      showToast("Sukses", "Komplain berhasil dikirim", "success");
      setShowConfirmModal(false);
      router.push("../../(tabs)/complaint");
    } catch (error) {
      showToast("Gagal", "Komplain gagal dikirim", "error");
    } finally {
      setLoading(false);
    }
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
      <View className="relative items-center justify-center mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-0">
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-center">
          Detail Masalah
        </Text>
      </View>

      <ScrollView className="px-4 pb-10">
        {/* Masalah */}
        <ProblemDisplay
          image={require("../../../assets/barangrusak.png")}
          problemType="Barang rusak"
          action={() => router.back()}
        />

        {/* Info Barang */}
        <ProductCard
          productName={detailTransaction?.itemName}
          idx={detailTransaction?.transactionCode}
          sellerMail={detailTransaction?.sellerEmail}
          noResi={detailTransaction?.shipment?.trackingNumber}
          expedisi={detailTransaction?.shipment?.courier}
          itemPrice={detailTransaction?.itemPrice}
          insuranceFee={detailTransaction?.insuranceFee}
          platformFee={detailTransaction?.platformFee}
          totalAmount={detailTransaction?.totalAmount}
        />

        {/* Alasan */}
        <InputField
          title="Alasan kerusakan"
          placeholder="Jelaskan kerusakan barang dan lampirkan foto."
          value={reason}
          onChangeText={setReason}
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
      <View className="mx-4 mb-8 ">
        <PrimaryButton title="Kirim" onPress={handleSubmit} />
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
                disabled={isLoading}
                className={`w-[48%] py-[14px] border border-gray-300 rounded-xl items-center ${
                  isLoading ? "opacity-50" : ""
                }`}>
                <Text className="text-[16px] font-semibold text-black">
                  Kembali
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirm}
                disabled={isLoading}
                className={`w-[48%] py-[14px] rounded-xl items-center ${
                  isLoading ? "bg-blue-400" : "bg-blue-600"
                }`}>
                <Text className="text-[16px] font-semibold text-white">
                  {isLoading ? "Mengirim..." : "Konfirmasi"}
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
                disabled={item.disabled}
                className={`mb-3 p-4 rounded-xl border ${
                  selectedSolution === item.title
                    ? "border-gray-800 bg-gray-50"
                    : "border-gray-200"
                } ${item.disabled ? "opacity-50" : ""}`}
                onPress={() => {
                  if (!item.disabled) {
                    setSelectedSolution(item.title);
                    setShowModal(false);
                  }
                }}>
                <Text className="text-sm font-semibold text-black mb-1">
                  {item.title}
                </Text>
                <Text className="text-xs text-gray-600">{item.desc}</Text>
                {item.disabled && (
                  <Text className="text-[11px] text-red-500 mt-1 font-medium">
                    Tidak tersedia
                  </Text>
                )}
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
