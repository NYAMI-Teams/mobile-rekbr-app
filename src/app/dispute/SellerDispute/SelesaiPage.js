import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import StepProgressBar from "../../../components/ProgressBar";
import { StatusKomplain } from "../../../components/dispute/statusKomplain";
import TextView from "../../../components/dispute/textView";
import Tagihan from "../../../components/DetailRekber/Tagihan";
import CopyField from "../../../components/dispute/copyField";
import { TrackDispute } from "../../../components/dispute/TrackDispute";
import { getDetailSellerComplaint } from "@/utils/api/complaint";
import { showToast, formatCurrency } from "@/utils";
import moment from "moment";
import NavBackHeader from "@/components/NavBackHeader";

const formatDateWIB = (dateTime) => {
  if (!dateTime) return "Invalid date";
  return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
};

export default function SelesaiPage() {
  const router = useRouter();
  const { status, complaintId } = useLocalSearchParams();
  const [detailComplaint, setDetailComplaint] = useState({});
  const [sellerRejected, setSellerRejected] = useState(false);

  useEffect(() => {
    if (complaintId) {
      fetchComplaintDetails();
    }
  }, [complaintId]);

  const fetchComplaintDetails = async () => {
    try {
      const res = await getDetailSellerComplaint(complaintId);
      setDetailComplaint(res.data);
      setSellerRejected(res.data?.seller_decision);
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
        currentStep={3}
        steps={["Seller", "Admin", "Kembaliin", "Refund"]}
        rejectedSteps={sellerRejected === "true" ? [0] : []}
      />

      {/* Status */}
      <StatusKomplain status="Transaksi Selesai" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.separator} />

        {detailComplaint?.timeline
          ?.slice()
          .reverse()
          .map((item, index) => (
            <View key={index}>
              <TrackDispute
                title={item.label}
                dateTime={formatDateWIB(item.timestamp)}
                details={[
                  {
                    content: item?.reason || item?.message || "-",
                  },
                  item?.evidence?.length > 0 && {
                    imgTitle: "Bukti foto & video",
                    images: item?.evidence.map((url, key) => ({
                      uri: url,
                      key,
                    })),
                  },
                  item?.trackingNumber !== null && {
                    resiNumber: item?.trackingNumber,
                    expedition: item?.courier,
                  },
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
        <View style={styles.tagihanContainer}>
          <Tagihan
            caption="Tagihan Rekber"
            price={formatCurrency(detailComplaint?.transaction?.totalAmount)}
            details={[
              {
                status: "Kembaliin",
                price: formatCurrency(
                  detailComplaint?.transaction?.totalAmount
                ),
              },
              {
                status: "Refund",
                price: formatCurrency(
                  detailComplaint?.transaction?.totalAmount
                ),
              },
            ]}
          />
        </View>
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
          content={detailComplaint?.transaction?.transactionCode}
        />
        <CopyField
          title="Virtual Account"
          content={detailComplaint?.transaction?.virtualAccount}
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
    padding: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  headerSpacer: {
    width: 24,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 160,
  },
  separator: {
    height: 8,
    backgroundColor: "#f5f5f5",
    marginTop: 12,
  },
  tagihanContainer: {
    padding: 12,
  },
});
