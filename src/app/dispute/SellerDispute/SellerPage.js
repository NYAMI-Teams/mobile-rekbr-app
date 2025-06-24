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

export default function SellerPage() {
  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = () => setShowPopup(true);

  const detailComplaint = {
    transaction: {
      sellerEmail: "sellerku@mail.com",
      itemName: "Smart TV 50 Inch UHD",
      totalAmount: "Rp 7.500.000",
      trackingNumber: "JNE123456789",
      courier: {
        name: "JNE",
      },
      transactionCode: "INV123456789",
      virtualAccount: "1234567890123456",
    },
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between py-4 px-4">
        <TouchableOpacity
          onPress={() => router.replace("../../(tabs)/dispute")}
        >
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
          dateTime="18 Juni 2025, 10:00 WIB, "
          contentAfter="pengajuan ini bakal otomatis disetujui, ya!"
        />

        <StatusKomplain status="Menunggu Seller Setuju" />

        <View className="h-2 bg-[#f5f5f5] mt-3" />

        <TrackDispute
          title="Pengajuan komplain buyer"
          dateTime="16 Juni 2025, 10:00 WIB"
          details={[
            {
              content:
                "Buyer mau ngembaliin barang yang bermasalah. Dana rekber bakal dikembalikan setelah komplain disetujui, ya!",
            },
            {
              content:
                "Layar barang pecah di bagian tengah dan ada goresan dalam di sisi kiri.",
            },
            {
              imgTitle: "Bukti foto & video",
              images: [
                require("../../../assets/barangrusak.png"),
                require("../../../assets/barangrusak.png"),
              ],
            },
          ]}
        />

        {/* Data Seller & Transaksi */}
        <TextView
          title="Buyer"
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
            detailComplaint?.transaction?.trackingNumber?.split("").join(" ") ||
            "-"
          }
        />
        <TextView
          title="Ekspedisi"
          content={detailComplaint?.transaction?.courier?.name || "-"}
        />
        <CopyField
          title="ID Transaksi"
          content={detailComplaint?.transaction?.transactionCode
            ?.split("")
            .join(" ")}
        />
        <CopyField
          title="Virtual Account"
          content={detailComplaint?.transaction?.virtualAccount
            ?.split("")
            .join(" ")}
        />

        <View className="h-2 bg-[#f5f5f5] mt-3" />
      </ScrollView>

      {/* Bottom Action */}
      <View
        className="flex-row px-4 pb-4 pt-2 bg-white"
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
      >
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
        <ModalSeller showPopup={showPopup} setShowPopup={setShowPopup} />
      )}
    </SafeAreaView>
  );
}
