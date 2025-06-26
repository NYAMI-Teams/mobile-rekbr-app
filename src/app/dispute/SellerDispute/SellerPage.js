import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import StepProgressBar from "../../../components/ProgressBar";
import { InfoBanner } from "../../../components/dispute/InfoBanner";
import { StatusKomplain } from "../../../components/dispute/statusKomplain";
import { TrackDispute } from "../../../components/dispute/TrackDispute";
import TextView from "../../../components/dispute/textView";
import CopyField from "../../../components/dispute/copyField";
import PrimaryButton from "../../../components/PrimaryButton";
import ModalSeller from "../../../components/dispute/modalSeller";
import { useEffect, useState } from "react";
import { getDetailSellerComplaint } from "../../../utils/api/complaint";
import { showToast, formatCurrency } from "../../../utils";
import moment from "moment";

const formatDateWIB = (dateTime) => {
  if (!dateTime) return "Invalid date";
  return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
};

export default function SellerPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [detailComplaint, setDetailComplaint] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [isTolak, setIsTolak] = useState(false);
  const [rejectedAdmin, setRejectedAdmin] = useState(false);
  const [rejectedSeller, setRejectedSeller] = useState(false);

  const handleSubmitTolak = () => {
    setIsTolak(true);
    setShowPopup(true);
  };

  const handleSubmitSetuju = () => {
    setIsTolak(false);
    setShowPopup(true);
  };

  useEffect(() => {
    if (id) {
      fetchComplaintDetails();
    }
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      const res = await getDetailSellerComplaint(id);
      setDetailComplaint(res.data);
      setRejectedAdmin(res.data.admin_decision === "rejected");
      setRejectedSeller(res.data.seller_decision === "rejected");
    } catch (error) {
      console.error("Error fetching complaint details:", error);
      showToast("Gagal", error?.message, "error");
    }
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

      {/* Stepper */}
      <StepProgressBar
        currentStep={rejectedSeller ? 1 : rejectedAdmin ? 2 : 0}
        steps={["Seller", "Admin", "Kembaliin", "Refunded"]}
        rejectedSteps={rejectedSeller ? [0] : rejectedAdmin ? [0, 1] : []}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <InfoBanner
          contentBefore="Jika kamu nggak respon sampai"
          dateTime={
            formatDateWIB(detailComplaint?.seller_response_deadline) || "null"
          }
          contentAfter=" pengajuan ini bakal otomatis disetujui, ya!"
        />

        <StatusKomplain status="Menunggu Seller Setuju" />

        <View style={styles.separator} />

        {/* Pengajuan */}
        {detailComplaint?.timeline
          ?.slice()
          .reverse()
          .map((item, index) => (
            <TrackDispute
              key={index}
              title={item.label}
              dateTime={formatDateWIB(item.timestamp) || "null"}
              details={[
                {
                  content:
                    index === detailComplaint.timeline.length - 1
                      ? detailComplaint?.buyer_reason
                      : "Proses komplain sedang berjalan.",
                },
                ...(index === detailComplaint.timeline.length - 1 &&
                detailComplaint?.buyer_evidence_urls?.length
                  ? [
                      {
                        imgTitle: "Bukti foto & video",
                        images: detailComplaint.buyer_evidence_urls.map(
                          (url) => ({ uri: url })
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          ))}

        {/* Data Transaksi */}
        <TextView
          title="Buyer"
          content={detailComplaint?.transaction?.buyerEmail}
        />
        <TextView
          title="Nama Barang"
          content={detailComplaint?.transaction?.itemName}
        />
        <TextView
          title="Tagihan Rekber"
          content={formatCurrency(detailComplaint?.transaction?.totalAmount)}
        />
        <CopyField
          title="No Resi"
          content={detailComplaint?.transaction?.trackingNumber || "-"}
        />
        <TextView
          title="Ekspedisi"
          content={detailComplaint?.transaction?.courier?.name || "-"}
        />
        <CopyField
          title="ID Transaksi"
          content={detailComplaint?.transaction?.transactionCode || "-"}
        />
        <CopyField
          title="Virtual Account"
          content={detailComplaint?.transaction?.virtualAccount || "-"}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Action */}
      {!rejectedAdmin && (
        <View style={styles.bottomActions}>
          <PrimaryButton
            title="Tolak"
            onPress={handleSubmitTolak}
            width="48%"
            btnColor="#F9F9F9"
            textColor="#000000"
            style={{ marginRight: 8 }}
          />
          <PrimaryButton
            title="Setuju"
            onPress={handleSubmitSetuju}
            width="48%"
          />
        </View>
      )}

      {showPopup && (
        <ModalSeller
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          isTolak={isTolak}
          id={id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  separator: {
    height: 8,
    backgroundColor: "#f5f5f5",
    marginTop: 12,
  },
  bottomSpacing: {
    height: 80,
  },
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: "#ffffff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
