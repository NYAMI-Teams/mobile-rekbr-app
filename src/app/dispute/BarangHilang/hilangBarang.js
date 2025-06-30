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
  StyleSheet,
} from "react-native";
import { ChevronLeft, ChevronDown, ChevronUp, Copy } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { getDetailBuyerTransaction } from "../../../utils/api/buyer";
import { postBuyerComplaint } from "../../../utils/api/complaint";
import PrimaryButton from "../../../components/PrimaryButton";
import { showToast } from "../../../utils";
import NavBackHeader from "@/components/NavBackHeader";

export default function HilangBarang() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const data = params.data ? JSON.parse(params.data) : null;
  const transactionId = data?.id;

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

      const complaint = await postBuyerComplaint(
        transactionId,
        type,
        reason,
        photo
      );

      if (!complaint?.id) throw new Error("Complaint tidak valid");

      showToast("Berhasil", "Komplain Berhasil dibuat", "success");
      router.push("../../(tabs)/complaint");
    } catch (err) {
      Alert.alert("Gagal", err?.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (transactionId) {
      getDetailBuyerTransaction(transactionId)
        .then((res) => setTransaction(res.data))
        .catch((err) => console.error("❌ Error loading transaction:", err));
    }
  }, [transactionId]);

  if (!transaction) return null;

  return (
    <View style={styles.container}>
      <NavBackHeader title={"Detail Masalah"} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBox}>
          <Image
            source={require("../../../assets/admin1.png")}
            style={styles.avatar}
          />
          <Text style={styles.infoText}>
            FYI dulu nih! Pengiriman udah ada SOP jelas dengan dimana kurir
            wajib foto penerima + titik koordinat.
          </Text>
        </View>

        <View style={styles.investigateBox}>
          <Text style={styles.investigateTitle}>
            Minta Rekbr by BNI Care Investigasi Pengiriman
          </Text>
          <Text style={styles.investigateText}>
            Rekbr by BNI akan menghubungi pihak kurir. Dana bermasalah akan
            dikembalikan setelah komplainmu disetujui.
          </Text>
        </View>

        <Text style={styles.label}>Masalah yang dipilih</Text>
        <View style={styles.issueBox}>
          <Image
            source={require("../../../assets/belumsampai.png")}
            style={styles.icon}
          />
          <Text style={styles.issueText}>Barang belum sampai atau kesasar</Text>
        </View>

        <Text style={styles.label}>Barang yang belum diterima</Text>
        <View style={styles.itemBox}>
          <Text style={styles.itemName}>{transaction.itemName}</Text>
          <Text style={styles.transactionCode}>
            {transaction.transactionCode}
          </Text>

          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>Seller</Text>
            <Text style={styles.blackText}>{transaction.sellerEmail}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>No Resi</Text>
            <Pressable onPress={handleCopy} style={styles.copyRow}>
              <Copy size={16} color="#999" />
              <Text style={styles.copyText}>
                {transaction.shipment?.trackingNumber || "-"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>Ekspedisi</Text>
            <Text style={styles.blackText}>
              {transaction.shipment?.courier || "-"}
            </Text>
          </View>

          <Pressable
            onPress={() => setShowBreakdown(!showBreakdown)}
            style={styles.breakdownBox}
          >
            <View style={styles.rowBetween}>
              <Text style={styles.boldText}>Nominal Rekber</Text>
              {showBreakdown ? (
                <ChevronUp size={16} color="black" />
              ) : (
                <ChevronDown size={16} color="black" />
              )}
            </View>
            {showBreakdown ? (
              <View>
                <View style={styles.rowBetween}>
                  <Text style={styles.grayText}>Nominal Barang</Text>
                  <Text style={styles.blackText}>
                    Rp. {transaction.itemPrice}
                  </Text>
                </View>
                <View style={styles.rowBetween}>
                  <Text style={styles.grayText}>Asuransi BNI Life</Text>
                  <Text style={styles.blackText}>
                    Rp. {transaction.insuranceFee}
                  </Text>
                </View>
                <View style={styles.rowBetween}>
                  <Text style={styles.grayText}>Biaya Aplikasi</Text>
                  <Text style={styles.blackText}>
                    Rp. {transaction.platformFee}
                  </Text>
                </View>
                <View style={[styles.rowBetween, styles.totalRow]}>
                  <Text style={styles.totalText}>Total</Text>
                  <Text style={styles.totalText}>
                    Rp. {transaction.totalAmount}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.boldText}>Rp. {transaction.totalAmount}</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Kirim" onPress={() => setModalVisible(true)} />
        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <View style={styles.infoCircle}>
                  <Text style={styles.infoTextBold}>i</Text>
                </View>
                <Text style={styles.modalTitle}>
                  Apakah kamu sudah yakin untuk ringkasan komplain ini?
                </Text>
              </View>
              <View style={styles.modalButtons}>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.btnText}>Kembali</Text>
                </Pressable>
                <Pressable
                  onPress={handleSubmitComplaint}
                  style={styles.confirmBtn}
                >
                  <Text style={styles.btnText}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: { position: "relative", alignItems: "center", marginBottom: 16 },
  backButton: { position: "absolute", left: 0 },
  headerTitle: { fontSize: 18, fontWeight: "600", textAlign: "center" },
  scrollContent: { paddingTop: 16, paddingBottom: 160 },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    alignItems: "flex-start",
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  infoText: { fontSize: 14, color: "#374151", marginLeft: 16, flex: 1 },
  investigateBox: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  investigateTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  investigateText: { fontSize: 14, color: "#374151" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  issueBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    marginBottom: 16,
  },
  icon: { width: 40, height: 40, borderRadius: 20 },
  issueText: { fontSize: 14, color: "#374151", marginLeft: 16, flex: 1 },
  itemBox: {
    backgroundColor: "#E5F7F9",
    borderRadius: 12,
    padding: 16,
    borderColor: "#D6F0F3",
    borderWidth: 1,
  },
  itemName: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  transactionCode: { fontSize: 16, color: "#6b7280", marginBottom: 12 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  grayText: { fontSize: 16, color: "#6b7280" },
  blackText: { fontSize: 16, color: "black" },
  copyRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  copyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
    marginLeft: 4,
  },
  breakdownBox: { paddingTop: 8, borderTopWidth: 1, borderColor: "#E5E7EB" },
  boldText: { fontSize: 14, fontWeight: "600", color: "black" },
  totalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    marginTop: 4,
    borderColor: "#E5E7EB",
  },
  totalText: { fontSize: 18, fontWeight: "bold", color: "black" },
  footer: { position: "absolute", bottom: 16, left: 16, right: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  infoCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextBold: { color: "white", fontWeight: "bold", fontSize: 12 },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    marginLeft: 12,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: "#DBEAFE",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    color: "black",
  },
});
