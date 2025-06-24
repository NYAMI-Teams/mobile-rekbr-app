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

export default function SelesaiPage() {
  const router = useRouter();
  const { status, sellerRejected } = useLocalSearchParams();
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

  const renderStatusSection = () => {
    switch (sellerRejected) {
      case "false":
        return (
          <>
            <TrackDispute
              title="Konfirmasi seller barang diterima"
              dateTime="22 Juni 2025, 10 : 00 WIB"
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
            <TrackDispute
              title="Admin meneruskan permintaan konfirmasi"
              dateTime="20 Juni 2025, 12 : 00 WIB"
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
            <TrackDispute
              title="Permintaan konfirmasi buyer"
              dateTime="21 Juni 2025, 10 : 00 WIB"
              details={[
                {
                  content:
                    "Melalui resi harusnya barang sudah sampai di seller",
                },
                {
                  imgTitle: "Bukti foto & video",
                  images: [require("../../../assets/barangrusak.png")],
                },
              ]}
            />

            <View className="h-2 bg-[#f5f5f5] mt-3" />
            <TrackDispute
              title="Refund barang oleh buyer"
              dateTime="20 Juni 2025, 10 : 00 WIB"
              details={[
                {
                  resiNumber: "J X 3 4 7 4 1 2 4 0 1 3",
                  expedition: "J&T Express Indonesia",
                },
              ]}
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
            <TrackDispute
              title="Persetujuan komplain seller"
              dateTime="19 Juni 2025, 10:00 WIB"
              details={[
                {
                  content:
                    "Seller setuju untuk Refund dana pada barang yang bermasalah.",
                },
              ]}
            />
          </>
        );
      case "true":
        return (
          <>
            <TrackDispute
              title="Konfirmasi seller dan dana berhasil dikembalikan"
              dateTime="22 Juni 2025, 10 : 00 WIB"
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
            <TrackDispute
              title="Pengembalian barang oleh buyer"
              dateTime="20 Juni 2025, 10 : 00 WIB"
              details={[
                {
                  resiNumber: "J X 3 4 7 4 1 2 4 0 1 3",
                  expedition: "J&T Express Indonesia",
                },
              ]}
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
            <TrackDispute
              title="Persetujuan komplain seller"
              dateTime="19 Juni 2025, 10:00 WIB"
              details={[
                {
                  content:
                    "Seller setuju untuk Refund dana pada barang yang bermasalah.",
                },
              ]}
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
            <TrackDispute
              title="Penolakan komplain seller"
              dateTime="16 Juni 2025, 14:00 WIB"
              details={[
                { content: "Bukti buyer belum cukup kuat." },
                {
                  imgTitle: "Bukti foto & video",
                  images: [
                    require("../../../assets/barangrusak.png"),
                    require("../../../assets/barangrusak.png"),
                  ],
                },
              ]}
            />
          </>
        );
      default:
        return null;
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
        {renderStatusSection()}
        <View className="h-2 bg-[#f5f5f5] mt-3" />
        {/* Timeline Komplain */}
        <TrackDispute
          title="Pengajuan komplain buyer"
          dateTime="16 Juni 2025, 10:00 WIB"
          details={[
            {
              content:
                "Buyer ingin mengembalikan barang. Dana rekber akan dikembalikan setelah komplain disetujui.",
            },
            { content: "Layar barang pecah di tengah, goresan di sisi kiri." },
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

        {/* Data Transaksi */}
        <TextView
          title="Seller"
          content={detailComplaint?.transaction?.sellerEmail}
        />
        <TextView
          title="Nama Barang"
          content={detailComplaint?.transaction?.itemName}
        />
        <View className="p-3">
          <Tagihan
            caption="Tagihan Rekber"
            price="Rp 1.000.000"
            details={[
              { status: "Kembaliin", price: "Rp 1.000.000" },
              { status: "Refund", price: "Rp 1.000.000" },
            ]}
          />
        </View>
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
    </View>
  );
}
