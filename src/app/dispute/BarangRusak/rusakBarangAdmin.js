import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClipboardPaste, ChevronLeft, ChevronDown } from "lucide-react-native";

import CopyField from "../../../components/dispute/copyField";
import TextView from "../../../components/dispute/textView";
import { InfoBanner } from "../../../components/dispute/InfoBanner";
import { StatusKomplain } from "../../../components/dispute/statusKomplain";
import StepProgressBar from "../../../components/ProgressBar";
import { TrackDispute } from "../../../components/dispute/TrackDispute";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getDetailBuyerComplaint } from "../../../utils/api/complaint";
import moment from "moment";

export default function AdminPage() {
  const router = useRouter();
  const [ditolak, setDitolak] = useState(false);
  const [detailComplaint, setDetailComplaint] = useState({});
  const { complaintId } = useLocalSearchParams();

  useEffect(() => {
    if (complaintId) {
      fetchComplaintDetails();
    }
  }, [complaintId]);

  const fetchComplaintDetails = async () => {
    console.log("ini complaint id", complaintId);
    try {
      const res = await getDetailBuyerComplaint(complaintId);
      setDetailComplaint(res.data);
      setDitolak(res.data?.status === "awaiting_admin_approval" ? false : true);
      console.log(
        "ini detail complaint rusak barang admin",
        JSON.stringify(res.data, null, 2)
      );
    } catch (err) {
      showToast(
        "Gagal",
        "Gagal mengambil data transaksi. Silahkan coba lagi.",
        "error"
      );
    }
  };

  const formatDateWIB = (dateTime) => {
    if (!dateTime) return "Invalid date";
    return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between py-4 px-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-base font-semibold">Detail Komplain</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Stepper */}
      <StepProgressBar
        key={"admin_detail_complaint"}
        currentStep={1}
        steps={["Seller", "Admin", "Kembaliin", "Refunded"]} //MARKING
        rejectedSteps={
          detailComplaint?.seller_decision === "approved"
            ? []
            : ditolak
            ? [0, 1]
            : [0]
        }
      />

      <ScrollView className="px-4">
        {/* Status Komplain */}
        <StatusKomplain
          status={ditolak ? "Komplain Ditolak" : "Menunggu Persetujuan Admin"}
        />

        {ditolak && (
          <InfoBanner contentBefore="Setelah ditinjau, bukti belum cukup kuat. Dana diteruskan ke seller dan transaksi dianggap selesai." />
        )}

        {detailComplaint?.timeline
          ?.slice()
          .reverse()
          .map((item, index) => (
            <TrackDispute
              key={index}
              title={item?.label}
              dateTime={formatDateWIB(item?.timestamp)}
              details={[
                {
                  content: item?.reason || item?.message || "-",
                },
                {
                  imgTitle: "Bukti foto & video",
                  images:
                    item?.evidence?.map((url, key) => ({
                      uri: url,
                      key,
                    })) || [],
                },
              ]}
            />
          ))}

        {/* Data Seller & Transaksi */}
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
