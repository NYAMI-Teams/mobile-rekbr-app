import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { StatusBar } from "expo-status-bar";
import moment from "moment";
import Modal from "react-native-modal";

import ComplaintStepBar from "@/components/ComplaintStepBar";
import {
  getDetailBuyerComplaint,
  getDetailSellerComplaint,
  postBuyerCancelComplaint,
} from "@/utils/api/complaint";
import { showToast } from "@/utils";
import NavBackHeader from "@/components/NavBackHeader";

const formatDateWIB = (dateTime) => {
  if (!dateTime) return "Invalid date";
  return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
};

export default function ComplaintDetailScreen() {
  const { id, role } = useLocalSearchParams();
  const router = useRouter();

  const [complaintDetail, setComplaintDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);

  useEffect(() => {
    if (id) fetchComplaintDetail();
  }, [id]);

  const fetchComplaintDetail = async () => {
    try {
      const res =
        role === "buyer"
          ? await getDetailBuyerComplaint(id)
          : await getDetailSellerComplaint(id);
      setComplaintDetail(res.data);
    } catch (err) {
      showToast("Gagal", "Gagal mengambil detail komplain", "error");
    } finally {
      setLoading(false);
    }
  };

  const status = complaintDetail?.status || "-";
  const type = complaintDetail?.type || "-";

  const handleCancelComplaint = async () => {
    if (!complaintDetail?.id) return;
    try {
      await postBuyerCancelComplaint(complaintDetail.id);
      showToast("Berhasil", "Komplain berhasil dibatalkan", "success");
      router.replace("/(tabs)/complaint");
    } catch (err) {
      showToast(
        "Gagal",
        err?.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
    }
  };

  const handleUpdateComplaint = () => {
    router.push({ pathname: "/Complaint/HilangKomplain", params: { id } });
  };

  const getStatusLabel = (status) => {
    console.log("status", status);
    switch (status) {
      case "under_investigation":
        return "Dalam Investigasi";
      case "approved_by_admin":
        return "Tim Rekbr by BNI meminta maaf atas barang yang hilang , dan bukti kurir ekspedisi tidak memenuhi aturan SOP kami.";
      case "rejected_by_admin":
        return "Komplain Ditolak";
      case "canceled":
        return "Komplain Dibatalkan";
      case "completed":
        return "Selesai";
      default:
        return "-";
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case "under_investigation":
        return "Dalam Investigasi";
      case "approved_by_admin":
        return "Komplain disetujui";
      case "rejected_by_seller":
        return "Komplain Ditolak";
      case "rejected_by_admin":
        return "Komplain Ditolak";
      case "canceled":
        return "Komplain Dibatalkan";
      case "completed":
        return "Selesai";
      default:
        return "-";
    }
  };

  const getStatusMessage = (type, status) => {
    const messages = {
      lost: {
        under_investigation:
          "Hey, kami lagi cek pengiriman barang kamu di ekspedisi, nih. Kita bakal nilai kesalahan ini dan cari solusi terbaik!",
        approved_by_admin: "Barang hilang telah disetujui oleh admin.",
        rejected_by_seller: null,
        completed:
          "Tim Rekbr by BNI meminta maaf atas barang yang hilang , dan bukti kurir ekspedisi tidak memenuhi aturan SOP kami.",
      },
    };

    return (
      messages[type]?.[status] ?? "Kami sedang mengevaluasi komplain kamu."
    );
  };

  const getStepStatus = (status) => {
    if (status === "approved_by_admin") {
      return { steps: ["Investigasi", "Disetujui"], currentStep: 1 };
    } else if (
      [
        "rejected_by_seller",
        "rejected",
        "canceled",
        "rejected_by_admin",
      ].includes(status)
    ) {
      return { steps: ["Investigasi", "Ditolak"], currentStep: 1 };
    } else if (status === "completed") {
      return { steps: ["Investigasi", "Disetujui"], currentStep: 1 };
    } else {
      return { steps: ["Investigasi", "Menunggu"], currentStep: 0 };
    }
  };


  const { steps, currentStep } = getStepStatus(status);
  const message = getStatusMessage(type, status);
  const shouldShowActions = status === "under_investigation";

  if (loading) {
    return (
      <View style={styles.centeredView}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <NavBackHeader title={"Detail Komplain"} />

      <ComplaintStepBar
        currentStep={currentStep}
        steps={steps}
        status={status}
      />
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {message && (
            <View style={styles.messageBox}>
              {!status?.includes("rejected") && (
                <Image
                  source={require("../../assets/admin1.png")}
                  style={styles.avatar}
                  resizeMode="contain"
                />
              )}
              <View style={styles.messageContent}>
                {!status?.includes("rejected") && (
                  <Text style={styles.messageTitle}>{getStatusLabel(status)}</Text>
                )}
                <Text style={styles.messageText}>{message}</Text>
              </View>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status Komplain :</Text>
            <Text style={styles.infoValue}>
              {getStatus(complaintDetail?.status)}
            </Text>
          </View>

          <ComplaintTimeline
            timeline={complaintDetail?.timeline}
            message={complaintDetail?.messsage}
            status={complaintDetail?.status}
          />

          <View style={{ padding: 16 }}>
            <InfoBlock
              label={role === "buyer" ? "Seller" : "Buyer"}
              value={
                role === "buyer"
                  ? complaintDetail?.transaction?.sellerEmail
                  : complaintDetail?.transaction?.buyerEmail
              }
            />
            <InfoBlock
              label="Nama Barang"
              value={complaintDetail?.transaction?.itemName}
            />
            <InfoBlock
              label="Tagihan Rekber"
              value={`Rp. ${Number(
                complaintDetail?.transaction?.totalAmount || 0
              ).toLocaleString("id-ID")},00`}
            />
            <InfoBlock
              label="ID Transaksi"
              value={complaintDetail?.transaction?.transactionCode}
              copyable
            />
            <InfoBlock
              label="No Resi"
              value={
                role === "buyer"
                  ? complaintDetail?.transaction?.shipment?.trackingNumber
                  : complaintDetail?.transaction?.trackingNumber
              }
              copyable
            />
            <InfoBlock
              label="Ekspedisi"
              value={
                role === "buyer"
                  ? complaintDetail?.transaction?.shipment?.courier
                  : complaintDetail?.transaction?.courier?.name
              }
            />
          </View>
        </ScrollView>
        {/* Tombol Aksi */}
        {shouldShowActions && (
          <View style={[styles.actionContainer]}>
            <Pressable style={[styles.actionRow]}>
              {/* Tombol Batalkan Komplain */}
              <TouchableOpacity
                onPress={() => handleCancelComplaint()}
                style={styles.contactButton}
              >
                <Text style={styles.contactButtonText}>
                  Batalkan Komplain
                </Text>
              </TouchableOpacity>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

function InfoBlock({ label, value, copyable = false }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: "#4B5563", fontSize: 16, marginBottom: 4 }}>
        {label}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ color: "#000", fontSize: 18, fontWeight: "500" }}>
          {value || "-"}
        </Text>
        {copyable && value && (
          <Pressable
            onPress={() => {
              Clipboard.setStringAsync(value);
              Alert.alert("Disalin", `${label} berhasil disalin.`);
            }}
          >
            <Copy size={20} color="#999" style={{ marginLeft: 8 }} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

function ComplaintTimeline({ timeline, status }) {
  const isRejected = ["rejected_by_seller", "rejected_by_admin"].includes(
    status
  );
  if (!timeline || timeline.length === 0) {
    return (
      <Text style={{ color: "#9CA3AF", fontSize: 14, marginTop: 16 }}>
        Belum ada aktivitas dalam komplain ini.
      </Text>
    );
  }

  return (
    <View style={{  }}>
      {timeline
        .slice()
        .reverse()
        .map((item, index) => (
          <TimelineItem
            key={index}
            label={item.label}
            timestamp={item.timestamp}
            message={item.message}
            isRejected={isRejected && index === 0}
          />
        ))}
    </View>
  );
}

function TimelineItem({ label, timestamp, message, isRejected }) {
  return (
    <View
      style={{
        marginBottom: 0,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: isRejected ? "#DC2626" : "#000",
        }}
      >
        {label}
      </Text>
      {message && (
        <View
          style={{
            backgroundColor: "#F3F4F6",
            padding: 12,
            borderRadius: 12,
            marginTop: 8,
          }}
        >
          <Text style={{ fontSize: 14, color: "#000" }}>{message}</Text>
        </View>
      )}
      {timestamp && (
        <Text style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>
          {formatDateWIB(timestamp)}
        </Text>
      )}
      {isRejected && (
        <Text style={{ color: "#EF4444", fontSize: 14, marginTop: 8 }}>
          Komplain kamu telah ditolak oleh pihak terkait.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  stepContainer: { alignItems: "center", paddingHorizontal: 16 },
  scroll: {  },
  messageBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  messageContent: { flex: 1 },
  messageTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  messageText: { fontSize: 12, color: "#4B5563" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  infoLabel: { color: "#6B7280", fontSize: 14 },
  infoValue: { color: "#000", fontSize: 14, fontWeight: "600" },
  actionContainer: {
    paddingBottom: 24,
    margin: 20,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  moreButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginRight: 12,
  },
  moreButtonText: {
    color: "#000",
    fontSize: 22,
  },
  modalActionContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  modalActionBarContainer: {
    alignItems: "center",
  },
  modalActionBar: {
    width: 48,
    height: 6,
    backgroundColor: "#D1D5DB",
    borderRadius: 8,
    marginBottom: 16,
  },
  modalActionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 32,
    textAlign: "center",
  },
  modalActionBtn: {
    marginBottom: 8,
  },
  modalActionBtnText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 24,
  },
  contactButton: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  contactButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
