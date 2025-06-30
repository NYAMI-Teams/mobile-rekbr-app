import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import PrimaryButton from "../../../components/PrimaryButton";
import { InfoBanner } from "../../../components/dispute/InfoBanner";
import StepProgressBar from "../../../components/ProgressBar";
import { StatusKomplain } from "../../../components/dispute/statusKomplain";
import { TrackDispute } from "../../../components/dispute/TrackDispute";
import TextView from "../../../components/dispute/textView";
import Tagihan from "../../../components/DetailRekber/Tagihan";
import CopyField from "../../../components/dispute/copyField";
import { getDetailBuyerComplaint } from "../../../utils/api/complaint";
import { showToast, formatCurrency } from "../../../utils";
import moment from "moment";
import NavBackHeader from "@/components/NavBackHeader";

const formatDateWIB = (dateTime) => {
  if (!dateTime) return "Invalid date";
  return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
};

export default function RusakBarangSelesai() {
  const router = useRouter();
  const [detailComplaint, setDetailComplaint] = useState({});
  const { complaintId } = useLocalSearchParams();

  useEffect(() => {
    fetchComplaintDetails();
  }, []);

  const fetchComplaintDetails = async () => {
    try {
      const res = await getDetailBuyerComplaint(complaintId);
      setDetailComplaint(res.data);
      console.log("ini detail complaint", JSON.stringify(res.data, null, 2));
    } catch (err) {
      showToast("Gagal", err?.message, "error");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <NavBackHeader title={"Detail Komplain"} />

      <StepProgressBar
        currentStep={3}
        steps={["Seller", "Admin", "Kembaliin", "Refund"]}
      />

      <StatusKomplain
        status={
          detailComplaint.status === "completed"
            ? "Transaksi Selesai"
            : "Transaksi Dalam Proses"
        }
      />

      <View style={styles.separator} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {detailComplaint?.timeline
          ?.slice()
          .reverse()
          .map((item, index) => (
            <TrackDispute
              key={index}
              title={item.label}
              dateTime={formatDateWIB(item.timestamp)}
              details={[
                {
                  content: item?.reason || item?.message || "-",
                },
                item?.evidence?.length > 0 && {
                  imgTitle: "Bukti foto & video",
                  images: item?.evidence.map((url, key) => ({ uri: url, key })),
                },
              ]}
            />
          ))}

        <View style={styles.separator} />

        <TextView
          title="Seller"
          content={detailComplaint?.transaction?.sellerEmail || "-"}
        />
        <TextView
          title="Nama Barang"
          content={detailComplaint?.transaction?.itemName || "-"}
        />

        <View style={styles.tagihanContainer}>
          <Tagihan
            caption="Tagihan Rekber"
            price={formatCurrency(
              detailComplaint?.transaction?.totalAmount || 0
            )}
            details={[
              {
                status: "Kembaliin",
                price: formatCurrency(
                  detailComplaint?.transaction?.totalAmount || 0
                ),
              },
              {
                status: "Refund",
                price: formatCurrency(
                  detailComplaint?.transaction?.totalAmount || 0
                ),
              },
            ]}
          />
        </View>

        <CopyField
          title="Nomor Resi"
          content={detailComplaint?.returnShipment?.trackingNumber || "-"}
        />
        <TextView
          title="Ekspedisi"
          content={detailComplaint?.returnShipment?.courierName || "-"}
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
  separator: {
    height: 8,
    backgroundColor: "#f5f5f5",
    marginTop: 12,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 80,
  },
  tagihanContainer: {
    padding: 12,
  },
});
