import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import StepProgressBar from "../../../components/ProgressBar";
import TextView from "../../../components/dispute/textView";
import CopyField from "../../../components/dispute/copyField";
import { StatusKomplain } from "../../../components/dispute/statusKomplain";
import { TrackDispute } from "../../../components/dispute/TrackDispute";
import { getDetailSellerComplaint } from "../../../utils/api/complaint";
import { showToast, formatCurrency } from "../../../utils";
import moment from "moment";
import { InfoBanner } from "@/components/dispute/InfoBanner";
import NavBackHeader from "@/components/NavBackHeader";

const formatDateWIB = (dateTime) => {
  if (!dateTime) return "Invalid date";
  return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
};

export default function AdminPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [detailComplaint, setDetailComplaint] = useState({});
  const [rejectedAdmin, setRejectedAdmin] = useState(false);
  const [rejectedSeller, setRejectedSeller] = useState(false);

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
      // // console.log(
      //   "ini detail complaint as seller",
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <NavBackHeader title={"Detail Komplain"} />

      {/* Stepper */}
      <StepProgressBar
        key="admin-step-progress"
        currentStep={1}
        steps={["Seller", "Admin", "Kembaliin", "Refund"]}
        rejectedSteps={rejectedAdmin ? [0, 1] : rejectedSeller ? [0] : []}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        key="admin-scroll-view">
        <StatusKomplain
          status={
            rejectedAdmin ? "Komplain Ditolak" : "Menunggu Persetujuan Admin"
          }
        />

        {rejectedAdmin && (
          <InfoBanner contentBefore="Setelah ditinjau, bukti belum cukup kuat. Dana diteruskan ke seller dan transaksi dianggap selesai." />
        )}

        <View style={styles.separator} />

        {/* Pengajuan Komplain */}
        {detailComplaint?.timeline
          ?.slice()
          .reverse()
          .map((item, index) => (
            <View key={index}>
              <TrackDispute
                title={item.label}
                dateTime={formatDateWIB(item.timestamp) || "null"}
                details={[
                  {
                    content: item?.reason || item?.message || "-",
                  },
                  ...(item?.evidence?.length > 0
                    ? [
                        {
                          imgTitle: "Bukti foto & video",
                          images: item.evidence.map((url, idx) => ({
                            uri: url,
                            key: `evidence-${idx}`,
                          })),
                        },
                      ]
                    : []),
                ]}
              />
              <View style={styles.separator} />
            </View>
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
      </ScrollView>
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
    color: "#000",
  },
  headerSpacer: {
    width: 24,
  },
  scrollContent: {},
  separator: {
    height: 8,
    backgroundColor: "#f5f5f5",
    marginTop: 12,
  },
});
