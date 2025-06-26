import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import PrimaryButton from "../../components/PrimaryButton";
import {
  getDetailBuyerComplaint,
  postBuyerComplaint,
  postBuyerCancelComplaint,
} from "@/utils/api/complaint";
import { showToast, formatCurrency } from "@/utils";

export default function DetailMasalahScreen() {
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const placeholderText =
    "Layar barang pecah di bagian tengah dan ada goresan dalam di sisi kiri.";

  const [media, setMedia] = useState([]);
  const [showTipsModal, setShowTipsModal] = useState(false);

  const [complaintDetail, setComplaintDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) fetchComplaintDetail();
  }, [id]);

  const fetchComplaintDetail = async () => {
    setLoading(true);
    try {
      const res = await getDetailBuyerComplaint(id);
      setComplaintDetail(res.data);
    } catch (err) {
      showToast("Gagal", err?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const cancelComplaint = async () => {
    setLoading(true);
    try {
      await postBuyerCancelComplaint(id);
      showToast("Berhasil", "Komplain berhasil dibatalkan", "success");
      router.replace("/(tabs)/complaint");
    } catch (err) {
      showToast("Gagal", err?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const type = "lost";
      const complaint = await postBuyerComplaint(id, type, description, media);
      if (!complaint?.id) throw new Error("Complaint tidak valid");
      showToast("Berhasil", "Komplain Berhasil dibuat", "success");
      router.replace("/(tabs)/complaint");
    } catch (err) {
      Alert.alert("Gagal", err?.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (!description) {
      showToast("Gagal", "Harap isi alasan kerusakan", "error");
      return;
    }
    if (media.length === 0) {
      showToast("Gagal", "Harap pilih minimal 1 bukti", "error");
      return;
    }
    cancelComplaint();
    handleSubmitComplaint();
  };

  const handlePickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Izin dibutuhkan", "Akses galeri diperlukan.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: false,
      quality: 1,
    });
    if (!result.canceled) {
      const picked = result.assets[0];
      const isVideo = picked.type === "video";
      const currentVideos = media.filter((m) => m.type === "video").length;
      const currentTotal = media.length;
      if (isVideo && currentVideos >= 1) {
        Alert.alert("Maksimal 1 video diperbolehkan");
        return;
      }
      if (currentTotal >= 5) {
        Alert.alert("Maksimal upload 5 file media");
        return;
      }
      setMedia([...media, picked]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Detail Masalah</Text>
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.statusTitle}>Komplain Dibatalkan</Text>
          <Text style={styles.statusSubtitle}>
            Kamu membatalkan komplain ini.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Masalah yang dipilih</Text>
        <View style={styles.issueBox}>
          <Image
            source={require("../../assets/belumsampai.png")}
            style={styles.issueIcon}
            resizeMode="contain"
          />
          <Text style={styles.issueText}>Barang belum sampai atau kesasar</Text>
        </View>

        <Text style={styles.sectionTitle}>Barang yang belum diterima</Text>
        <View style={styles.itemBox}>
          <Text style={styles.itemName}>
            {complaintDetail?.transaction?.itemName || "-"}
          </Text>
          <Text style={styles.itemCode}>
            {complaintDetail?.transaction?.transactionCode || "-"}
          </Text>

          <View style={styles.rowBetween}>
            <Text>Seller</Text>
            <Text>{complaintDetail?.transaction?.sellerEmail || "-"}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text>No Resi</Text>
            <Text style={{ color: "#3B82F6" }}>
              {complaintDetail?.transaction?.shipment?.trackingNumber || "-"}
            </Text>
          </View>
          <View style={styles.rowBetween}>
            <Text>Ekspedisi</Text>
            <Text>
              {complaintDetail?.transaction?.shipment?.courier || "-"}
            </Text>
          </View>

          <View>
            <Text style={styles.nominalLabel}>Nominal Rekber</Text>
            <Text style={styles.nominalValue}>
              {formatCurrency(complaintDetail?.transaction?.totalAmount || 0)}
            </Text>
          </View>
        </View>

        {/* Alasan kerusakan dan bukti media serta tips modal akan dilanjutkan di bagian bawah jika diinginkan */}
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <PrimaryButton title="Ajukan Komplain Kembali" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 16, paddingBottom: 32 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
    justifyContent: "center",
  },
  backButton: { position: "absolute", left: 0 },
  headerText: { fontSize: 18, fontWeight: "600", color: "#000" },
  statusBox: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusTitle: { fontWeight: "600", fontSize: 16, color: "#000" },
  statusSubtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  issueBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
  },
  issueIcon: { width: 20, height: 20, marginRight: 12 },
  issueText: { fontSize: 16, color: "#374151", fontWeight: "600", flex: 1 },
  itemBox: {
    backgroundColor: "#EAF7F9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemName: { fontSize: 18, fontWeight: "600", color: "#000", marginBottom: 4 },
  itemCode: { fontSize: 14, color: "#000", marginBottom: 12 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  nominalLabel: { fontSize: 16, color: "#000", marginBottom: 4 },
  nominalValue: { fontSize: 18, fontWeight: "600", color: "#000" },
  buttonWrapper: { paddingHorizontal: 16, marginBottom: 24 },
});
