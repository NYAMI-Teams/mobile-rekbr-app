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
  ActivityIndicator,
} from "react-native";
import { ChevronLeft, ChevronDown, ChevronUp, Copy } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { getDetailBuyerTransaction } from "@/utils/api/buyer";
import { postBuyerComplaint } from "@/utils/api/complaint";
import { formatCurrency, showToast } from "../../utils";

export default function CreateComplaintScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [ajukanUlang, setAjukanUlang] = useState(false);

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(transaction?.shipment?.trackingNumber || "");
    Alert.alert("Disalin", "Nomor resi berhasil disalin.");
  };

  const fetchTransaction = async () => {
    try {
      const res = await getDetailBuyerTransaction(id);
      setTransaction(res?.data);
      setAjukanUlang(res?.data?.Complaint?.length > 0);
    } catch (err) {
      console.log(
        "❌ Error saat fetchTransaction:",
        err?.response?.data || err.message || err
      );
    }
  };

  const handleSubmitComplaint = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const type = "lost";
      const reason = "Barang belum sampai atau kesasar";
      const photo = null;

      await postBuyerComplaint(id, type, reason, photo);

      showToast("Berhasil", "Komplain Berhasil dibuat", "success");
      router.replace("/(tabs)/complaint");
    } catch (err) {
      console.log("❌ Error saat createComplaint:", err?.message);
      showToast("Gagal", err?.message, "error");
    } finally {
      setIsSubmitting(false);
      setModalVisible(false);
    }
  };

  if (!transaction) // Loading state with activity indicator
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );

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

        <View style={styles.infoBox}>
          <Image
            source={require("../../assets/admin1.png")}
            style={styles.avatar}
            resizeMode="contain"
          />
          <Text style={styles.infoText}>
            FYI dulu nih! Pengiriman udah ada SOP jelas dengan dimana kurir
            wajib foto penerima + titik koordinat.
          </Text>
        </View>

        <View style={styles.investigationBox}>
          <Text style={styles.investigationTitle}>
            Minta Rekbr by BNI Care Investigasi Pengiriman
          </Text>
          <Text style={styles.investigationText}>
            Rekbr by BNI akan menghubungi pihak kurir. Dana bermasalah akan
            dikembalikan setelah komplainmu disetujui.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Masalah yang dipilih</Text>
        <View style={styles.infoBox}>
          <Image
            source={require("../../assets/belumsampai.png")}
            style={styles.avatar}
            resizeMode="contain"
          />
          <Text style={styles.infoText}>Barang belum sampai atau kesasar</Text>
        </View>

        <Text style={styles.sectionHeader}>Barang yang belum diterima</Text>
        <View style={styles.itemBox}>
          <Text style={styles.itemTitle}>{transaction.itemName}</Text>
          <Text style={styles.itemCode}>{transaction.transactionCode}</Text>

          <View style={styles.detailsList}>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Seller</Text>
              <Text style={styles.value}>{transaction.sellerEmail}</Text>
            </View>

            <View style={styles.rowBetween}>
              <Text style={styles.label}>No Resi</Text>
              <Pressable onPress={handleCopy} style={styles.copyButton}>
                <Copy size={16} color="#999" />
                <Text style={styles.copyText}>
                  {transaction.shipment?.trackingNumber || "-"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.rowBetween}>
              <Text style={styles.label}>Ekspedisi</Text>
              <Text style={styles.value}>
                {transaction.shipment?.courier || "-"}
              </Text>
            </View>

            <Pressable
              onPress={() => setShowBreakdown(!showBreakdown)}
              style={styles.breakdownToggle}
            >
              <View style={styles.rowBetween}>
                <Text style={styles.breakdownLabel}>Nominal Rekber</Text>
                {showBreakdown ? (
                  <ChevronUp size={16} color="black" />
                ) : (
                  <ChevronDown size={16} color="black" />
                )}
              </View>
              {showBreakdown ? (
                <View style={styles.breakdownContent}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>Nominal Barang</Text>
                    <Text style={styles.value}>
                      {formatCurrency(transaction.itemPrice)}
                    </Text>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>Asuransi BNI Life</Text>
                    <Text style={styles.value}>
                      {formatCurrency(transaction.insuranceFee)}
                    </Text>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>Biaya Aplikasi</Text>
                    <Text style={styles.value}>
                      {formatCurrency(transaction.platformFee)}
                    </Text>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalLabel}>
                      {formatCurrency(transaction.totalAmount)}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.rowBetween}>
                  <Text style={styles.breakdownLabel}>
                    {formatCurrency(transaction.totalAmount)}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={ajukanUlang ? "Ajukan Ulang Komplain" : "Kirim"}
          style={{ marginBottom: 24 }}
          onPress={() => setModalVisible(true)}
        />
        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalIcon}>
                  <Text style={styles.modalIconText}>i</Text>
                </View>
                <Text style={styles.modalTitle}>
                  Apakah kamu sudah yakin untuk ringkasan komplain ini?
                </Text>
              </View>
              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelText}>Kembali</Text>
                </Pressable>
                <Pressable
                  onPress={handleSubmitComplaint}
                  style={styles.confirmButton}
                >
                  <Text style={styles.confirmText}>
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: { fontSize: 18, fontWeight: "600" },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    position: "relative",
  },
  backButton: { position: "absolute", left: 0 },
  headerText: { fontSize: 18, fontWeight: "600", textAlign: "center" },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    gap: 12,
  },
  avatar: { width: 40, height: 40, borderRadius: 9999 },
  infoText: { fontSize: 14, color: "#374151", flex: 1 },
  investigationBox: {
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  investigationTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  investigationText: { fontSize: 14, color: "#374151" },
  sectionTitle: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  sectionHeader: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  itemBox: {
    backgroundColor: "#E5F7F9",
    borderRadius: 12,
    padding: 16,
    borderColor: "#D6F0F3",
    borderWidth: 1,
  },
  itemTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  itemCode: { fontSize: 16, color: "#6b7280", marginBottom: 12 },
  detailsList: { gap: 12 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: { fontSize: 16, color: "#6b7280" },
  value: { fontSize: 16, color: "#000" },
  copyButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  copyText: { fontSize: 16, fontWeight: "600", color: "#3b82f6" },
  breakdownToggle: { paddingTop: 8, borderTopWidth: 1, borderColor: "#e5e7eb" },
  breakdownLabel: { fontSize: 14, fontWeight: "600", color: "#000" },
  breakdownContent: { gap: 4, marginTop: 4 },
  totalLabel: { fontSize: 18, fontWeight: "700", color: "#000" },
  footer: { marginBottom: 24, marginHorizontal: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderColor: "#e5e7eb",
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 24,
  },
  modalIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalIconText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  modalTitle: { flex: 1, fontSize: 18, fontWeight: "500", color: "#000" },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginRight: 8,
  },
  cancelText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    color: "#000",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#dbeafe",
    borderRadius: 8,
    marginLeft: 8,
  },
  confirmText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    color: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20, // mt-5
  },
});
