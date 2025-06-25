import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, SafeAreaView, TouchableOpacity, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { Text } from "react-native";
import StepProgressBar from "../../../components/ProgressBar";
import { ScrollView } from "react-native-gesture-handler";
import { TrackDispute } from "../../../components/dispute/TrackDispute";
import TextView from "../../../components/dispute/textView";
import Tagihan from "../../../components/DetailRekber/Tagihan";
import CopyField from "../../../components/dispute/copyField";
import { InfoBanner } from "../../../components/dispute/InfoBanner";
import { StatusKomplain } from "../../../components/dispute/statusKomplain";
import PrimaryButton from "../../../components/PrimaryButton";
import {
  getDetailSellerComplaint,
  postSellerConfirmReturn,
} from "@/utils/api/complaint";
import { useEffect, useState } from "react";
import { showToast, formatCurrency } from "@/utils";
import moment from "moment";

const formatDateWIB = (dateTime) => {
  if (!dateTime) return "Invalid date";
  return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
};

export default function KembaliinPage() {
  const router = useRouter();
  const { id, status } = useLocalSearchParams();
  const [detailComplaint, setDetailComplaint] = useState({});
  const [sellerRejected, setSellerRejected] = useState(false);
  const [buyerExpiredDate, setBuyerExpiredDate] = useState(false);

  useEffect(() => {
    fetchDetailComplaint();
  }, []);

  const fetchDetailComplaint = async () => {
    try {
      const res = await getDetailSellerComplaint(id);
      setDetailComplaint(res.data);
      setSellerRejected(res.data.seller_decision === "rejected" ? true : false);
      setBuyerExpiredDate(res.data.updated_at); // ini kurang response di DB untuk dapetin buyerExpiredDate
      console.log("Detail Complaint:", JSON.stringify(res.data, null, 2));
    } catch (error) {
      console.error("Gagal mengambil data detail komplain:", error);
      showToast("Gagal", error?.message, "error");
    }
  };

  const renderStatusSection = () => {
    switch (status) {
      case "adminApprove":
        return (
          <>
            <InfoBanner contentBefore="Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali ! Proses maksimal 1 x 24 jam." />
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
            {sellerRejected ? (
              <>
                <TrackDispute
                  title="Persetujuan komplain oleh admin"
                  dateTime="16 Juni 2025, 16:00 WIB"
                  details={[
                    {
                      content:
                        "Setelah tinjau bukti yang kamu kirim, komplain dinyatakan valid. Refund akan diproses meski seller menolak.",
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
                <View className="h-2 bg-[#f5f5f5] mt-3" />
              </>
            ) : (
              <TrackDispute
                title="Persetujuan komplain oleh admin"
                dateTime="16 Juni 2025, 16:00 WIB"
                details={[
                  {
                    content:
                      "Setelah tinjau bukti, komplain dinyatakan valid. Refund akan diproses meski seller menolak.",
                  },
                ]}
              />
            )}
          </>
        );

      case "disputeProved":
        return (
          <>
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <InfoBanner contentBefore="Seller nggak kasih kabar, jadi sekarang giliran kamu buat lanjut prosesnya. Ayo upload bukti pengembalian barang!" />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
            <TrackDispute
              title="Seller nggak respon dalam 2x24 jam."
              dateTime="18 Juni 2025, 10:00 WIB"
              details={[
                {
                  content:
                    "Sekarang giliran kamu kirim balik barangnya. Jangan lupa upload bukti pengiriman supaya proses refund lanjut!",
                },
              ]}
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
          </>
        );

      case "buyerResi":
        return (
          <>
            <InfoBanner contentBefore="Barang harus segera kamu kirim. Pastikan aman dan lampirkan bukti resi." />
            <StatusKomplain status="Menunggu Pengembalian Barang" />
          </>
        );

      case "requestSeller":
        return (
          <>
            <InfoBanner contentBefore="Konfirmasi resi udah dikirim ke seller, tunggu approval mereka ya!" />
            <StatusKomplain status="Menunggu Seller" />
          </>
        );

      case "waitSeller":
        return (
          <>
            <InfoBanner contentBefore="Admin meneruskan permintaan konfirmasi ke seller." />
            <StatusKomplain status="Menunggu Seller Konfirmasi" />
          </>
        );

      case "requestRejected":
        return (
          <>
            <InfoBanner contentBefore="Komplain ditolak karena bukti tidak valid. Silakan hubungi kami." />
            <StatusKomplain status="Transaksi Selesai" />
          </>
        );

      case "disputeCancel":
        return (
          <>
            <InfoBanner contentBefore="Komplain dibatalkan. Transaksi dinyatakan selesai." />
            <StatusKomplain status="Transaksi Selesai" />
          </>
        );

      case "returnRequested":
        return (
          <>
            <InfoBanner contentBefore="Tunggu konfirmasi dari seller soal barang yang kamu kembalikan, baru deh dana bakal kembali ke kamu." />
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <View className="h-2 bg-[#f5f5f5] mt-3" />

            {sellerRejected === false ? (
              <TrackDispute
                title="Persetujuan komplain seller"
                dateTime="19 Juni 2025, 10:00 WIB"
                details={[
                  {
                    content:
                      "Seller mau nerima barang kembaliin agar dapat ditukar, kirim bukti Refund.",
                  },
                ]}
              />
            ) : (
              <>
                <TrackDispute
                  title="Persetujuan komplain oleh admin"
                  dateTime="16 Juni 2025, 16:00 WIB"
                  details={[
                    {
                      content:
                        "Setelah tinjau bukti, komplain dinyatakan valid. Refund akan diproses meski seller menolak.",
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
                <View className="h-2 bg-[#f5f5f5] mt-3" />
              </>
            )}
          </>
        );

      case "returnInTransit":
        return (
          <>
            {ditolak === true ? (
              <InfoBanner
                contentBefore="Karena pengembalian barang sudah lewat 1 x 24 jam, komplain"
                dateTime=" dianggap selesai dan tidak bisa diproses lagi"
              />
            ) : (
              <InfoBanner contentBefore="Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali ! Proses maksimal 1 x 24 jam." />
            )}

            <StatusKomplain
              status={
                ditolak === true
                  ? "Transaksi Selesai"
                  : "Menunggu Pengembalian Barang"
              }
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />

            {ditolak === true ? (
              <>
                <TouchableOpacity
                  onPress={() => console.log("Hubungi kami di klik!")}>
                  <View className="items-end px-4 mt-4">
                    <Text className="text-[#3267E3] font-bold">
                      Silahkan Hubungi Kami
                    </Text>
                  </View>
                </TouchableOpacity>
                <TrackDispute
                  title="Status Pengembalian Barang - Lewat 1 x 24 Jam"
                  dateTime="20 Juni 2025, 10:00 WIB"
                  titleColor="#CB3A31"
                />
              </>
            ) : (
              <TrackDispute
                title="Pengembalian barang oleh buyer"
                dateTime="20 Juni 2025, 10:00 WIB"
                details={[
                  {
                    resiNumber: "J X 3 4 7 4 1 2 4 0 1 3",
                    expedition: "J&T Express Indonesia",
                  },
                ]}
              />
            )}

            <View className="h-2 bg-[#f5f5f5] mt-3" />

            {sellerRejected === false ? (
              <TrackDispute
                title="Persetujuan komplain seller"
                dateTime="19 Juni 2025, 10:00 WIB"
                details={[
                  {
                    content:
                      "Seller mau nerima barang kembaliin agar dapat ditukar, kirim bukti Refund.",
                  },
                ]}
              />
            ) : (
              <>
                <TrackDispute
                  title="Persetujuan komplain oleh admin"
                  dateTime="16 Juni 2025, 16:00 WIB"
                  details={[
                    {
                      content:
                        "Setelah tinjau bukti, komplain dinyatakan valid. Refund akan diproses meski seller menolak.",
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
                <View className="h-2 bg-[#f5f5f5] mt-3" />
              </>
            )}
          </>
        );

      case "awaitingSellerConfirmation":
        return (
          <>
            <InfoBanner contentBefore="Buyer akan mengembalikan barang dalam 24 jam, konfirmasi bila barang telah sampai dan diterima." />
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <View className="h-2 bg-[#f5f5f5] mt-3" />

            <TrackDispute
              title="Pengembalian barang oleh buyer"
              dateTime="20 Juni 2025, 10:00 WIB"
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
                    "Seller mau nerima barang kembaliin agar dapat ditukar, kirim bukti Refund.",
                },
              ]}
            />

            <View className="h-2 bg-[#f5f5f5] mt-3" />
          </>
        );

      case "approvedByAdmin":
        return (
          <>
            <InfoBanner contentBefore="Halo! Barang sudah sampai. Konfirmasi dalam 24 jam, kalau nggak, dana otomatis dikembalikan ke buyer." />
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <View className="flex-row justify-end px-4 mt-4">
              <View className="p-2 rounded bg-[#FEF2D3]">
                <Text className="font-bold text-black">23 : 59 : 59</Text>
              </View>
            </View>

            <View className="h-2 bg-[#f5f5f5] mt-3" />

            <TrackDispute
              title="Pengembalian barang oleh buyer"
              dateTime="20 Juni 2025, 10:00 WIB"
              details={[
                {
                  resiNumber: "Hardcoded",
                  expedition: "Hardcoded",
                },
              ]}
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
          </>
        );
      default:
        return null;
    }
  };

  const handleSellerAccept = () => {
    Alert.alert(
      "Konfirmasi",
      "Barang udah diterima dengan baik dan benar? Cek dulu ya, biar aman!",
      [
        {
          text: "Kembali",
          style: "cancel",
          onPress: () => {
            router.back();
          },
        },
        {
          text: "Konfirmasi",
          style: "destructive",
          onPress: () => {
            console.log("Finishing Id ===> ", id);
            postSellerConfirmReturn(id)
              .then(() => {
                router.replace("../../(tabs)/complaint");
              })
              .catch((err) => {
                showToast("Gagal", err?.message, "error");
                console.log("Cancel error:", err);
              });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSubmit = () => {
    console.log("Submit komplain");
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-base font-semibold">Detail Komplain</Text>
        <View style={{ width: 24 }} />
      </View>

      <StepProgressBar
        currentStep={2}
        steps={["Seller", "Admin", "Kembaliin", "Refunded"]}
        rejectedSteps={buyerExpiredDate ? [2] : sellerRejected ? [0] : []}
      />

      <ScrollView className="px-4 pb-40">
        {renderStatusSection()}

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

        {/* Data Transaksi */}
        <TextView
          title="Seller"
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

        {/* Bottom Action */}
        <View
          className="flex-row px-4 pb-4 pt-2 mt-5 bg-white"
          style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <PrimaryButton
            title="Komplain"
            onPress={handleSubmit}
            width="48%"
            btnColor="#F9F9F9"
            textColor="#000000"
            style={{ marginRight: 8 }}
          />
          <PrimaryButton
            title="Barang diterima"
            onPress={handleSellerAccept}
            width="48%"
          />
        </View>
      </ScrollView>
    </View>
  );
}
