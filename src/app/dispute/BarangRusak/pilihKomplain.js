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
  Pressable,
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
      showToast("Gagal", error?.message, "error");
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

      <View style={styles.footer}>
        <PrimaryButton
          title={ajukanUlang ? "Ajukan Ulang Komplain" : "Kirim"}
          style={{ marginBottom: 24 }}
          onPress={() => handleSubmit()}
        />
        <Modal
          transparent
          visible={showConfirmModal}
          animationType="fade"
          onRequestClose={() => setShowConfirmModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={styles.modalIconCircle}>
                  <Text style={styles.modalIconText}>i</Text>
                </View>
                <Text style={styles.modalTitleText}>
                  Apakah kamu sudah yakin untuk ringkasan komplain ini?
                </Text>
              </View>

              <View style={styles.modalButtonRow}>
                <Pressable
                  onPress={() => setShowConfirmModal(false)}
                  style={[styles.modalButton, styles.modalCancelButton]}
                >
                  <Text style={styles.modalButtonText}>Kembali</Text>
                </Pressable>

                <Pressable
                  onPress={handleConfirm}
                  style={[styles.modalButton, styles.modalConfirmButton]}
                  disabled={isLoading}
                >
                  <Text style={styles.modalButtonText}>
                    {isLoading ? 'Mengirim...' : 'Konfirmasi'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>

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

  footer: { marginBottom: 24, marginHorizontal: 20 },

  modalOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb', // gray-200
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  modalIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6', // blue-500
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalIconText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalTitleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalCancelButton: {
    backgroundColor: '#f3f4f6', // gray-100
    marginRight: 8,
  },
  modalConfirmButton: {
    backgroundColor: '#dbeafe', // blue-100
    marginLeft: 8,
  },
  modalButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    color: '#000000',
  },
});
