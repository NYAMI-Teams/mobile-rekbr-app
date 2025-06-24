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

const formatDateWIB = (dateTime) => {
  if (!dateTime) return "Invalid date";
  return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
};

export default function AdminPage() {
  const router = useRouter();
  const { id, status, rejectedAdmin } = useLocalSearchParams();
  const [detailComplaint, setDetailComplaint] = useState({});

  useEffect(() => {
    if (id) {
      fetchComplaintDetails();
    }
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      const res = await getDetailSellerComplaint(id);
      setDetailComplaint(res.data);
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
        currentStep={1}
        steps={["Seller", "Admin", "Kembaliin", "Refund"]}
        rejectedSteps={rejectedAdmin === "true" ? [0, 1] : [0]}
      />

      <ScrollView className="px-4">
        <StatusKomplain status="Menunggu Persetujuan Admin" />
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
                    content: item?.reason,
                  },
                  ...(item?.evidence?.length
                    ? [
                        {
                          imgTitle: "Bukti foto & video",
                          images: item.evidence.map((url) => ({
                            uri: url,
                          })),
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
