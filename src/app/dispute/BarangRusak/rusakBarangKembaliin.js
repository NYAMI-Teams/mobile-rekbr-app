import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import moment from "moment";

export default function RusakBarangKembaliinPage() {
  const router = useRouter();
  const { complaintId, status } = useLocalSearchParams();
  const [detailComplaint, setDetailComplaint] = useState({});

  useEffect(() => {
    if (complaintId) {
      fetchComplaintDetails();
    }
  }, [complaintId]);

  const fetchComplaintDetails = async () => {
    try {
      const res = await getDetailBuyerComplaint(complaintId);
      setDetailComplaint(res.data);
      console.log(
        "ini detail complaint barang kembaliin",
        JSON.stringify(res.data, null, 2)
      );
      console.log(
        detailComplaint?.buyer_deadline_input_shipment <
          detailComplaint?.updated_at
      );
    } catch (err) {
      showToast(
        "Gagal",
        "Gagal mengambil data transaksi. Silahkan coba lagi.",
        "error"
      );
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const handlePrimaryButton = () => {
    if (status === "returnRequested") {
      router.push({
        pathname: "/dispute/BarangRusak/pengembalianForm",
        params: { complaintId: complaintId },
      });
    } else if (status === "returnInTransit") {
      router.push({
        pathname: "/dispute/BarangRusak/konfirmasiSellerForm",
        params: { complaintId: complaintId },
      });
    }
  };

  const getButtonTitle = () => {
    if (status === "returnRequested") return "Kirim Barang Refund";
    if (status === "returnInTransit") return "Minta Konfirmasi Seller";
    if (status === "disputeProved") return "Kirim Bukti Pengembalian";
    return null;
  };

  const formatDateWIB = (dateTime) => {
    if (!dateTime) return "Invalid date";
    return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
  };

  const renderStatusSection = () => {
    switch (status) {
      case "approvedByAdmin":
        return (
          <>
            <InfoBanner contentBefore="Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali ! Proses maksimal 1 x 24 jam." />
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <View className="h-2 bg-[#f5f5f5] mt-3" />

            {detailComplaint?.timeline
              ?.slice()
              .reverse()
              .map((item, index) => (
                <>
                  <TrackDispute
                    key={index}
                    title={item?.label}
                    dateTime={formatDateWIB(item?.timestamp)}
                    details={[
                      {
                        content: item?.message || item?.reason || "-",
                      },
                      item?.evidence?.length > 0 && {
                        imgTitle: "Bukti foto & video",
                        images: item?.evidence.map((url, key) => ({
                          uri: url,
                          key,
                        })),
                      },
                    ]}
                  />
                  <View className="h-2 bg-[#f5f5f5] mt-3" />
                </>
              ))}
          </>
        );

      case "disputeProved":
        return (
          <>
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <InfoBanner contentBefore="Seller nggak kasih kabar, jadi sekarang giliran kamu buat lanjut prosesnya. Ayo upload bukti pengembalian barang!" />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
            {detailComplaint?.timeline
              ?.slice()
              .reverse()
              .map((item, index) => (
                <>
                  <TrackDispute
                    key={index}
                    title={item?.label}
                    dateTime={formatDateWIB(item?.timestamp)}
                    details={[
                      {
                        content: item?.message || item?.reason || "-",
                      },
                      item?.evidence?.length > 0 && {
                        imgTitle: "Bukti foto & video",
                        images: item?.evidence.map((url, key) => ({
                          uri: url,
                          key,
                        })),
                      },
                    ]}
                  />
                  <View className="h-2 bg-[#f5f5f5] mt-3" />
                </>
              ))}
          </>
        );

      case "buyerResi":
        return (
          <>
            <InfoBanner contentBefore="Barang harus segera kamu kirim. Pastikan aman dan lampirkan bukti resi." />
            <StatusKomplain status="Menunggu Pengembalian Barang" />{" "}
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
            <InfoBanner contentBefore="Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali ! Proses maksimal 1 x 24 jam." />
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <View className="h-2 bg-[#f5f5f5] mt-3" />

            {detailComplaint?.timeline
              ?.slice()
              .reverse()
              .map((item, index) => (
                <>
                  <TrackDispute
                    key={index}
                    title={item?.label}
                    dateTime={formatDateWIB(item?.timestamp)}
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
                    ]}
                  />
                  <View className="h-2 bg-[#f5f5f5] mt-3" />
                </>
              ))}
          </>
        );

      case "returnInTransit":
        return (
          <>
            {detailComplaint?.buyer_deadline_input_shipment <
            detailComplaint?.updated_at ? (
              <InfoBanner
                contentBefore="Karena pengembalian barang sudah lewat 1 x 24 jam, komplain"
                dateTime=" dianggap selesai dan tidak bisa diproses lagi"
              />
            ) : (
              <InfoBanner contentBefore="Tunggu konfirmasi dari seller soal barang yang kamu kembalikan, baru deh dana bakal kembali ke kamu." />
            )}

            <StatusKomplain
              status={
                detailComplaint?.buyer_deadline_input_shipment <
                detailComplaint?.updated_at
                  ? "Transaksi Selesai"
                  : "Menunggu Pengembalian Barang"
              }
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />

            {detailComplaint?.buyer_deadline_input_shipment <
            detailComplaint?.updated_at ? (
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
                  dateTime={formatDateWIB(
                    detailComplaint?.buyer_deadline_input_shipment
                  )}
                  titleColor="#CB3A31"
                />
              </>
            ) : (
              <></>
            )}

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
              ))}
          </>
        );

      case "awaitingSellerConfirmation":
        return (
          <>
            <InfoBanner contentBefore="Konfirmasi resi udah dikirim ke seller, tunggu approval mereka ya!" />
            <StatusKomplain status="Menunggu Seller" />
            <View className="h-2 bg-[#f5f5f5] mt-3" />

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
                      images: item?.evidence.map((url, key) => ({
                        uri: url,
                        key,
                      })),
                    },
                  ]}
                />
              ))}

            <View className="h-2 bg-[#f5f5f5] mt-3" />
          </>
        );

      case "awaitingAdminConfirmation":
        return (
          <>
            <InfoBanner contentBefore="Konfirmasi sedang dalam proses admin, tunggu admin ya!" />
            <StatusKomplain status="Menunggu Admin" />
            <View className="h-2 bg-[#f5f5f5] mt-3" />

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
                      images: item?.evidence.map((url, key) => ({
                        uri: url,
                        key,
                      })),
                    },
                  ]}
                />
              ))}

            <View className="h-2 bg-[#f5f5f5] mt-3" />
          </>
        );
      default:
        return (
          <>
            <InfoBanner contentBefore="-" />
            <StatusKomplain status="-" />
          </>
        );
    }
  };

  const renderPrimaryButton = () => {
    const title = getButtonTitle();
    if (!title) return null;
    return <PrimaryButton title={title} onPress={handlePrimaryButton} />;
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
        rejectedSteps={
          detailComplaint?.seller_decision == "rejected"
            ? [0]
            : detailComplaint?.buyer_deadline_input_shipment <
              detailComplaint?.updated_at
            ? [2]
            : []
        }
      />

      <ScrollView className="px-4 pb-40">
        {renderStatusSection()}

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
            price={formatPrice(detailComplaint?.transaction?.totalAmount)}
            details={[
              {
                status: "Harga Barang",
                price: formatPrice(detailComplaint?.transaction?.itemPrice),
              },
              {
                status: "Asuransi Pengiriman BNI Life (0.2%)",
                price: formatPrice(detailComplaint?.transaction?.insuranceFee),
              },
              {
                status: "Biaya Jasa Aplikasi",
                price: formatPrice(detailComplaint?.transaction?.platformFee),
              },
            ]}
          />
        </View>
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
          content={detailComplaint?.transaction?.transactionCode}
        />
        <CopyField
          title="Virtual Account"
          content={detailComplaint?.transaction?.virtualAccount}
        />
      </ScrollView>
      <View className="p-4">{renderPrimaryButton()}</View>
    </View>
  );
}
