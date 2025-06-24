import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClipboardPaste, ChevronLeft, ChevronDown } from "lucide-react-native";
import StepProgressBar from "../../../components/ProgressBar";
import { InfoBanner } from "../../../components/dispute/InfoBanner";
import { StatusKomplain } from "../../../components/dispute/statusKomplain";
import { TrackDispute } from "../../../components/dispute/TrackDispute";
import TextView from "../../../components/dispute/textView";
import CopyField from "../../../components/dispute/copyField";
import PrimaryButton from "../../../components/PrimaryButton";
import { useState } from "react";
import ModalSeller from "../../../components/dispute/modalSeller";
import { useLocalSearchParams } from "expo-router";
import { getDetailSellerComplaint } from "../../../utils/api/complaint";
import { useEffect } from "react";
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
  const handleSubmit = () => setShowPopup(true);

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
    } catch (error) {
      console.error("Error fetching complaint details:", error);
      showToast("Gagal", error?.message, "error");
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
        currentStep={0}
        steps={["Seller", "Admin", "Kembaliin", "Refunded"]}
        rejectedSteps={[]}
      />

      <ScrollView className="px-4">
        <InfoBanner
          contentBefore="Jika kamu nggak respon sampai "
          dateTime={
            formatDateWIB(detailComplaint?.seller_confirm_deadline) || "null"
          }
          contentAfter="pengajuan ini bakal otomatis disetujui, ya!"
        />

        <StatusKomplain status="Menunggu Seller Setuju" />

        <View className="h-2 bg-[#f5f5f5] mt-3" />

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
                          (url) => ({
                            uri: url,
                          })
                        ),
                      },
                    ]
                  : []),
              ]}
            />
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

        <View className="h-2 bg-[#f5f5f5] mt-3" />
      </ScrollView>

      {/* Bottom Action */}
      <View
        className="flex-row px-4 pb-4 pt-2 bg-white"
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <PrimaryButton
          title="Tolak"
          onPress={handleSubmit}
          width="48%"
          btnColor="#F9F9F9"
          textColor="#000000"
          style={{ marginRight: 8 }}
        />
        <PrimaryButton title="Setuju" onPress={handleSubmit} width="48%" />
      </View>

      {showPopup && (
        <ModalSeller
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          id={id}
        />
      )}
    </View>
  );
}
