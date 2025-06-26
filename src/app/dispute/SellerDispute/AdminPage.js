import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView, View } from "react-native";
import { ClipboardPaste, ChevronLeft, ChevronDown } from "lucide-react-native";
import StepProgressBar from "../../../components/ProgressBar";
import TextView from "../../../components/dispute/textView";
import CopyField from "../../../components/dispute/copyField";
import { StatusKomplain } from "../../../components/dispute/statusKomplain";
import { TrackDispute } from "../../../components/dispute/TrackDispute";
import { getDetailSellerComplaint } from "../../../utils/api/complaint";
import { useEffect, useState } from "react";
import { showToast, formatCurrency } from "../../../utils";
import moment from "moment";
import { InfoBanner } from "@/components/dispute/InfoBanner";

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
      setRejectedAdmin(res.data.admin_decision === "rejected" ? true : false);
      setRejectedSeller(res.data.seller_decision === "rejected" ? true : false);
      console.log(
        "ini detail complaint as seller",
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
        key="admin-step-progress"
        currentStep={1}
        steps={["Seller", "Admin", "Kembaliin", "Refund"]}
        rejectedSteps={rejectedAdmin ? [0, 1] : rejectedSeller ? [0] : []}
      />

      <ScrollView className="px-4" key="admin-scroll-view">
        {/* Status Komplain */}
        <StatusKomplain
          status={
            rejectedAdmin ? "Komplain Ditolak" : "Menunggu Persetujuan Admin"
          }
        />

        {rejectedAdmin && (
          <InfoBanner contentBefore="Setelah ditinjau, bukti belum cukup kuat. Dana diteruskan ke seller dan transaksi dianggap selesai." />
        )}
        <View className="h-2 bg-[#f5f5f5] mt-3" />

        {/* Pengajuan */}
        {detailComplaint?.timeline
          ?.slice()
          .reverse()
          .map((item, index) => (
            <>
              <TrackDispute
                key={index}
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
                          images: item.evidence.map((url, index) => ({
                            uri: url,
                            key: `evidence-${index}`,
                          })),
                          key: `evidence-section-${index}`,
                        },
                      ]
                    : []),
                ]}
              />
              <View className="h-2 bg-[#f5f5f5] mt-3" />
            </>
          ))}

        {/* Data Seller & Transaksi */}
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
