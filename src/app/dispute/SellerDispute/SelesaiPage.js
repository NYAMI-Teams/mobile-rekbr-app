import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import StepProgressBar from "../../../components/ProgressBar";
import { StatusKomplain } from "../../../components/dispute/statusKomplain";
import TextView from "../../../components/dispute/textView";
import Tagihan from "../../../components/DetailRekber/Tagihan";
import CopyField from "../../../components/dispute/copyField";
import { TrackDispute } from "../../../components/dispute/TrackDispute";
import { getDetailSellerComplaint } from "@/utils/api/complaint";
import { useEffect, useState } from "react";
import { showToast, formatCurrency } from "@/utils";
import moment from "moment";

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
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-base font-semibold">Detail Komplain</Text>
        <View style={{ width: 24 }} />
      </View>

      <StepProgressBar
        currentStep={3}
        steps={["Seller", "Admin", "Kembaliin", "Refund"]}
        rejectedSteps={sellerRejected === "true" ? [0] : []}
      />

      <StatusKomplain status="Transaksi Selesai" />

      <ScrollView className="px-4 pt-4 pb-40">
        <View className="h-2 bg-[#f5f5f5] mt-3" />

        {detailComplaint?.timeline
          ?.slice()
          .reverse()
          .map((item, index) => (
            <>
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
              <View className="h-2 bg-[#f5f5f5] mt-3" />
            </>
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
        <View className="p-3">
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
