// DisputeDetail.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { ChevronLeft, ChevronDown } from "lucide-react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import PrimaryButton from "../../../components/PrimaryButton";
import ProblemDisplay from "../../../components/dispute/problemDisplay";
import ProductCard from "../../../components/dispute/productCard";
import { InputField } from "../../../components/dispute/InputField";
import { UploadProve } from "../../../components/dispute/UploadProve";
import { TrackDispute } from "../../../components/dispute/TrackDispute";

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Komplain</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.separator} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TrackDispute
          title=" Komplain Dibatalkan"
          dateTime="19 Juni 2025, 10 : 00 WIB"
          details={[{ content: "Kamu membatalkan komplain ini." }]}
        />
        <View style={styles.separator} />

        <ProblemDisplay
          image={require("../../../assets/barangrusak.png")}
          problemType="Barang rusak"
        />
        <ProductCard
          productName="iPhone 13 Pro Max"
          idx="RKB - 8080123456789"
          sellerMail="irgi168@gmail.com"
          noResi="JX3474124013"
          expedisi="J&T Express Indonesia"
          nominal="1000000"
        />
        <InputField
          title="Alasan kerusakan"
          placeholder="Jelaskan kerusakan barang dan lampirkan foto."
        />
        <UploadProve
          media={media}
          pickMedia={pickMedia}
          setShowTipsModal={setShowTipsModal}
        />

        {/* Solusi */}
        <Text style={styles.solutionTitle}>Solusi apa yang kamu inginkan</Text>
        <Text style={styles.solutionSubtitle}>
          Solusi bisa berubah, sesuai kesepakatan antara Seller, Buyer dan Tim
          Rekbr by BNI
        </Text>
        <TouchableOpacity
          style={styles.solutionSelector}
          onPress={() => setShowModal(true)}
        >
          <Text
            style={
              selectedSolution
                ? styles.solutionText
                : styles.solutionPlaceholder
            }
          >
            {selectedSolution || "Pilih solusi kamu"}
          </Text>
          <ChevronDown size={16} color="#999" />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <PrimaryButton title="Ajukan Komplain Kembali" onPress={handleSubmit} />
      </View>

      {/* Modal Konfirmasi Kirim */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Image
                source={require("../../../assets/icon-info-blue.png")}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.modalTitle}>
                Apakah kamu sudah yakin untuk ringkasan komplain ini?
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Kembali</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmText}>Konfirmasi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Pilih Solusi */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBottomOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
            <View style={styles.modalDimmed} />
          </TouchableWithoutFeedback>
          <View style={styles.modalBottomSheet}>
            <View style={styles.handleBar} />
            <Text style={styles.modalOptionTitle}>Pilih Solusi</Text>
            {solutionOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.solutionOption,
                  selectedSolution === item.title &&
                    styles.solutionOptionSelected,
                ]}
                onPress={() => {
                  setSelectedSolution(item.title);
                  setShowModal(false);
                }}
              >
                <Text style={styles.solutionOptionTitle}>{item.title}</Text>
                <Text style={styles.solutionOptionDesc}>{item.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Modal Tips Upload */}
      <Modal visible={showTipsModal} transparent animationType="slide">
        <View style={styles.modalBottomOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowTipsModal(false)}>
            <View style={styles.modalDimmed} />
          </TouchableWithoutFeedback>
          <View style={styles.modalTips}>
            <View style={styles.handleBarWide} />
            <Text style={styles.tipsTitle}>Tips Upload Bukti</Text>
            {[
              "Tampilkan kondisi barang sebelum kemasan dibuka",
              "Tampilkan kondisi barang sebelum kemasan dibuka",
              "Jika kerusakan disebabkan oleh kurir, tampilkan penyebab kerusakan jika memungkinkan",
              "Khusus video, tampilkan kerusakan yang menunjukkan tidak berfungsinya barang.",
            ].map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <Image
                  source={require("../../../assets/icon-check-green.png")}
                  style={styles.tipIcon}
                  resizeMode="contain"
                />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}

            <View style={styles.tipBox}>
              <Text style={styles.tipBoxTitle}>Format yang didukung:</Text>
              <Text style={styles.tipBoxText}>
                • Maksimal <Text style={styles.bold}>5 foto</Text> atau{" "}
                <Text style={styles.bold}>4 foto dan 1 video</Text>
              </Text>
              <Text style={styles.tipBoxText}>
                • Format yang diterima:{" "}
                <Text style={styles.bold}>.jpg, .png, .mp4, .mov</Text>
              </Text>
              <Text style={styles.tipBoxText}>
                • Ukuran maksimal foto: <Text style={styles.bold}>10 MB</Text>
              </Text>
              <Text style={styles.tipBoxText}>
                • Ukuran maksimal video: <Text style={styles.bold}>50 MB</Text>
              </Text>
              <Text style={styles.tipBoxText}>
                • Durasi video maksimal:{" "}
                <Text style={styles.bold}>5 menit</Text>
              </Text>
              <Text style={styles.tipBoxText}>
                • Jika video terlalu besar, gunakan video compressor atau{" "}
                <Text style={styles.bold}>upload ke YouTube</Text> dan sertakan
                link-nya
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#000" },
  separator: { height: 8, backgroundColor: "#f5f5f5", marginTop: 12 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  solutionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  solutionSubtitle: { fontSize: 12, color: "#6B7280", marginBottom: 12 },
  solutionSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  solutionText: { fontSize: 14, color: "#000" },
  solutionPlaceholder: { fontSize: 14, color: "#9CA3AF" },
  buttonContainer: { position: "absolute", bottom: 16, left: 16, right: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 24,
  },
  modalBox: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 24,
  },
  modalTitle: { fontSize: 17, fontWeight: "600", color: "#000", flex: 1 },
  icon: { width: 20, height: 20, marginTop: 4 },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  cancelButton: {
    width: "48%",
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButton: {
    width: "48%",
    paddingVertical: 14,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    alignItems: "center",
  },
  cancelText: { fontSize: 16, fontWeight: "600", color: "#000" },
  confirmText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  modalBottomOverlay: { flex: 1, justifyContent: "flex-end" },
  modalDimmed: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  modalBottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  modalOptionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 16 },
  handleBar: {
    width: 40,
    height: 6,
    backgroundColor: "#D1D5DB",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 12,
  },
  solutionOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  solutionOptionSelected: {
    borderColor: "#111827",
    backgroundColor: "#F9FAFB",
  },
  solutionOptionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  solutionOptionDesc: { fontSize: 12, color: "#6B7280" },
  modalTips: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: "85%",
  },
  handleBarWide: {
    width: 48,
    height: 6,
    backgroundColor: "#D1D5DB",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 24,
  },
  tipsTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  tipRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  tipIcon: { width: 20, height: 20, marginTop: 2, marginRight: 8 },
  tipText: { fontSize: 14, color: "#000", flex: 1, lineHeight: 20 },
  tipBox: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  tipBoxTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  tipBoxText: { fontSize: 14, color: "#000", lineHeight: 20, marginBottom: 4 },
  bold: { fontWeight: "600" },
});
