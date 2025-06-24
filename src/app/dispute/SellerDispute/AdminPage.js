import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView, View } from "react-native";
import { ClipboardPaste, ChevronLeft, ChevronDown } from "lucide-react-native";
import StepProgressBar from "../../../components/ProgressBar";
import TextView from "../../../components/dispute/textView";
import CopyField from "../../../components/dispute/copyField";
import { StatusKomplain } from "../../../components/dispute/statusKomplain";
import { TrackDispute } from "../../../components/dispute/TrackDispute";

export default function AdminPage() {
  const router = useRouter();
  const { status, rejectedAdmin } = useLocalSearchParams();

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
        currentStep={1}
        steps={["Seller", "Admin", "Kembaliin", "Refund"]}
        rejectedSteps={rejectedAdmin === "true" ? [0, 1] : [0]}
      />

      <ScrollView className="px-4">
        <StatusKomplain status="Menunggu Persetujuan Admin" />
        <View className="h-2 bg-[#f5f5f5] mt-3" />

        <TrackDispute
          title="Penolakan komplain seller"
          dateTime="16 Juni 2025, 14 : 00 WIB"
          details={[
            {
              content:
                "Penolakan dikarenakan bukti buyer belum cukup kuat dan tidak ada alasan menerima hal seperti itu",
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
        <View className="h-2 bg-[#f5f5f5] mt-3" />
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
      </ScrollView>
    </SafeAreaView>
  );
}
