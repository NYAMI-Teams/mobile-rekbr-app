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
  StyleSheet,
} from "react-native";
import { ChevronLeft, ChevronDown } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import PrimaryButton from "../../../components/PrimaryButton";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import ProblemDisplay from "../../../components/dispute/problemDisplay";
import ProductCard from "../../../components/dispute/productCard";
import { InputField } from "../../../components/dispute/InputField";
import { UploadProve } from "../../../components/dispute/UploadProve";
import { getDetailBuyerTransaction } from "../../../utils/api/buyer";
import { postBuyerComplaint } from "../../../utils/api/complaint";
import { showToast } from "../../../utils";
import NavBackHeader from "@/components/NavBackHeader";

export default function DisputeDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [problemType] = useState("damaged");
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [media, setMedia] = useState([]);
  const [detailTransaction, setDetailTransaction] = useState({});
  const [reason, setReason] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [ajukanUlang, setAjukanUlang] = useState(false);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const res = await getDetailBuyerTransaction(id);
        setDetailTransaction(res.data);
        setAjukanUlang(res.data?.Complaint?.length > 0);
      } catch (err) {
        showToast("Gagal", err?.message, "error");
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
      await postBuyerComplaint(id, problemType, reason, media);
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
    <View style={styles.container}>
      <NavBackHeader title={"Detail Masalah"} />

      <ScrollView contentContainerStyle={styles.scrollView}>
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

        <InputField
          title="Alasan kerusakan"
          placeholder="Jelaskan kerusakan barang dan lampirkan foto."
          value={reason}
          onChangeText={setReason}
        />

        <UploadProve
          media={media}
          pickMedia={pickMedia}
          setShowTipsModal={setShowTipsModal}
        />

        <Text style={styles.solutionTitle}>Solusi apa yang kamu inginkan</Text>
        <Text style={styles.solutionSub}>
          Solusi bisa berubah, sesuai kesepakatan antara Seller, Buyer dan Tim
          Rekbr by BNI
        </Text>

        <TouchableOpacity
          style={styles.solutionPicker}
          onPress={() => setShowModal(true)}
        >
          <Text
            style={[
              styles.solutionText,
              selectedSolution ? styles.blackText : styles.grayText,
            ]}
          >
            {selectedSolution || "Pilih solusi kamu"}
          </Text>
          <ChevronDown size={16} color="#999" />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={ajukanUlang ? "Ajukan Ulang Komplain" : "Kirim"}
          onPress={handleSubmit}
        />
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
                className={`w-[48%] py-[14px] border border-gray-300 rounded-xl items-center ${isLoading ? "opacity-50" : ""
                  }`}>
                <Text className="text-[16px] font-semibold text-black">
                  Kembali
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirm}
                disabled={isLoading}
                className={`w-[48%] py-[14px] rounded-xl items-center ${isLoading ? "bg-blue-400" : "bg-blue-600"
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
                className={`mb-3 p-4 rounded-xl border ${selectedSolution === item.title
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
        <View style={styles.modalTipsOuter}>
          <TouchableWithoutFeedback onPress={() => setShowTipsModal(false)}>
            <View style={styles.modalTipsBackdrop} />
          </TouchableWithoutFeedback>
          <View style={[styles.modalTipsContent, { maxHeight: "85%" }]}>
            <View style={styles.modalTipsBar} />
            <Text style={styles.modalTipsTitle}>
              Tips Upload Bukti
            </Text>
            {[
              "Tampilkan kondisi barang sebelum kemasan dibuka",
              "Tampilkan kondisi barang sebelum kemasan dibuka",
              "Jika kerusakan disebabkan oleh kurir, tampilkan penyebab kerusakan jika memungkinkan",
              "Khusus video, tampilkan kerusakan yang menunjukkan tidak berfungsinya barang.",
            ].map((tip, index) => (
              <View key={index} style={styles.modalTipsRow}>
                <Image
                  source={require("../../../assets/icon-check-green.png")}
                  style={styles.modalTipsIcon}
                  resizeMode="contain"
                />
                <Text style={styles.modalTipsText}>
                  {tip}
                </Text>
              </View>
            ))}

            <View style={styles.modalTipsFormatBox}>
              <Text style={styles.modalTipsFormatTitle}>
                Format yang didukung:
              </Text>
              <Text style={styles.modalTipsFormatText}>
                • Maksimal <Text style={styles.modalTipsFormatBold}>5 foto</Text> atau{" "}
                <Text style={styles.modalTipsFormatBold}>4 foto dan 1 video</Text>
              </Text>
              <Text style={styles.modalTipsFormatText}>
                • Format yang diterima adalah{" "}
                <Text style={styles.modalTipsFormatBold}>.jpg, .png, .mp4, .mov</Text>
              </Text>
              <Text style={styles.modalTipsFormatText}>
                • Ukuran maksimal foto adalah{" "}
                <Text style={styles.modalTipsFormatBold}>10 MB per file</Text>
              </Text>
              <Text style={styles.modalTipsFormatText}>
                • Ukuran maksimal video adalah{" "}
                <Text style={styles.modalTipsFormatBold}>50 MB per file</Text>
              </Text>
              <Text style={styles.modalTipsFormatText}>
                • Durasi video maksimal adalah{" "}
                <Text style={styles.modalTipsFormatBold}>5 menit</Text>
              </Text>
              <Text style={styles.modalTipsFormatText}>
                • Jika video terlalu besar, gunakan video compressor atau{" "}
                <Text style={styles.modalTipsFormatBold}>upload video ke YouTube</Text>{" "}
                dan sertakan link di field alasan
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  solutionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  solutionSub: {
    fontSize: 12,
    color: "#4B5563",
    marginBottom: 12,
  },
  solutionPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  solutionText: {
    fontSize: 14,
  },
  blackText: {
    color: "#000000",
  },
  grayText: {
    color: "#9CA3AF",
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  modalTipsOuter: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalTipsBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalTipsContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  modalTipsBar: {
    width: 48,
    height: 6,
    backgroundColor: "#D1D5DB",
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 24,
  },
  modalTipsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
  },
  modalTipsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  modalTipsIcon: {
    width: 20,
    height: 20,
    marginTop: 2,
    marginRight: 8,
  },
  modalTipsText: {
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
    flex: 1,
  },
  modalTipsFormatBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  modalTipsFormatTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  modalTipsFormatText: {
    fontSize: 14,
    color: "#000",
    lineHeight: 18,
    marginBottom: 4,
  },
  modalTipsFormatBold: {
    fontWeight: "600",
    color: "#000",
  },
});
