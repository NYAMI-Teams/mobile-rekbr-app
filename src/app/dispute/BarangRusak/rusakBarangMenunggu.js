import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";

import CopyField from "../../../components/dispute/copyField";
import TextView from "../../../components/dispute/textView";
import { InfoBanner } from "../../../components/dispute/InfoBanner";
import { StatusKomplain } from "../../../components/dispute/statusKomplain";
import StepProgressBar from "../../../components/ProgressBar";
import { TrackDispute } from "../../../components/dispute/TrackDispute";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getDetailBuyerComplaint,
  postBuyerCancelComplaint,
} from "../../../utils/api/complaint";
import moment from "moment";
import NavBackHeader from "@/components/NavBackHeader";

export default function DetailKomplain() {
  const router = useRouter();
  const { complaintId } = useLocalSearchParams();
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [isNeedAdmin, setIsNeedAdmin] = useState(false);
  const [ditolak, setDitolak] = useState(false);
  const [detailComplaint, setDetailComplaint] = useState({});

  useEffect(() => {
    if (complaintId) {
      fetchComplaintDetails();
    }
  }, [complaintId]);

  const formatDateWIB = (dateTime) => {
    if (!dateTime) return "Invalid date";
    return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
  };

  const fetchComplaintDetails = async () => {
    try {
      const res = await getDetailBuyerComplaint(complaintId);
      setDetailComplaint(res.data);
      // console.log(
      //   "ini detail complaint as buyer",
      //   JSON.stringify(res.data, null, 2)
      // );
    } catch (err) {
      showToast(
        "Gagal",
        "Gagal mengambil data transaksi. Silahkan coba lagi.",
        "error"
      );
    }
  };

  const handleCancelComplaint = () => {
    Alert.alert(
      "Konfirmasi",
      "Yakin ingin membatalkan komplain?",
      [
        { text: "Tidak", style: "cancel" },
        {
          text: "Ya, Batalkan",
          style: "destructive",
          onPress: () => {
            postBuyerCancelComplaint(complaintId)
              .then(() => router.replace("../../(tabs)/complaint"))
              .catch((err) => {
                showToast(
                  "Gagal",
                  "Gagal membatalkan komplain. Coba lagi.",
                  "error"
                );
                // console.log("Cancel error:", err);
              });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <NavBackHeader title={"Detail Komplain"} />

      <View style={styles.stepperWrapper}>
        <StepProgressBar
          key="rusak_barang_menunggu"
          currentStep={0}
          steps={
            isNeedAdmin
              ? ["Menunggu", "Admin", "Kembaliin", "Refunded"]
              : ["Seller", "Kembaliin", "Refunded"]
          }
          isRejected={ditolak}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <InfoBanner
          contentBefore="Jika seller nggak respon sampai"
          dateTime={
            formatDateWIB(detailComplaint?.seller_response_deadline) || "null"
          }
          contentAfter=" pengajuanmu bakal otomatis diteruskan ke admin"
        />

        <StatusKomplain status="Menunggu Persetujuan Seller" />

        {detailComplaint?.timeline
          ?.slice()
          .reverse()
          .map((item, index) => (
            <TrackDispute
              key={index}
              title={item?.label}
              dateTime={formatDateWIB(item?.timestamp)}
              details={[
                { content: item?.reason || item?.message || "-" },
                item?.evidence?.length > 0 && {
                  imgTitle: "Bukti foto & video",
                  images: item?.evidence.map((url, key) => ({ uri: url, key })),
                },
              ]}
            />
          ))}

        <TextView
          title="Seller"
          content={detailComplaint?.transaction?.sellerEmail}
        />
        <TextView
          title="Nama Barang"
          content={detailComplaint?.transaction?.itemName}
        />
        <TextView
          title="Tagihan Rekber"
          content={detailComplaint?.transaction?.totalAmount}
        />
        <CopyField
          title="No Resi"
          content={
            detailComplaint?.transaction?.shipment?.trackingNumber || "-"
          }
        />
        <TextView
          title="Ekspedisi"
          content={detailComplaint?.transaction?.shipment?.courier || "-"}
        />
        <CopyField
          title="ID Transaksi"
          content={detailComplaint?.transaction?.transactionCode}
        />
        <CopyField
          title="Virtual Account"
          content={detailComplaint?.transaction?.virtualAccount}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => setShowOptionModal(true)}
          style={styles.moreButton}>
          <Text style={styles.moreButtonText}>⋯</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => router.push("../../(tabs)/complaint")}>
          <Text style={styles.emailButtonText}>Kirim Seller Email</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showOptionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptionModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowOptionModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Lainnya</Text>

          <TouchableOpacity
            style={styles.modalItem}
            onPress={() =>
              router.replace("/dispute/BarangRusak/pilihKomplain")
            }>
            <Text style={styles.modalItemText}>Ubah Detail Komplain</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCancelComplaint}
            style={styles.modalItem}>
            <Text style={styles.modalItemText}>Batalkan Komplain</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log("Simulate pressed")}
            style={styles.modalItem}>
            <Text style={styles.modalItemText}>Simulate reject</Text>
          </TouchableOpacity>
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
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  stepperWrapper: {
    alignItems: "center",
    width: "100%",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#f3f4f6",
    backgroundColor: "white",
  },
  moreButton: {
    height: 44,
    width: 64,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  moreButtonText: {
    fontSize: 20,
    color: "black",
    fontWeight: "600",
  },
  emailButton: {
    flex: 1,
    height: 44,
    backgroundColor: "black",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  emailButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  modalHandle: {
    width: 40,
    height: 6,
    backgroundColor: "#D1D5DB",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    marginBottom: 16,
  },
  modalItem: {
    marginBottom: 16,
  },
  modalItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "black",
  },
});
