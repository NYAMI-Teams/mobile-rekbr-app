import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet, // Import StyleSheet
  ActivityIndicator, // Added for loading state, though not used in original snippet
} from "react-native";
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
import { showToast } from "../../../utils"; // Assuming showToast is in utils
import NavBackHeader from "@/components/NavBackHeader";

export default function RusakBarangKembaliinPage() {
  const router = useRouter();
  const { complaintId, status } = useLocalSearchParams();
  const [detailComplaint, setDetailComplaint] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    if (complaintId) {
      fetchComplaintDetails();
    }
  }, [complaintId]);

  const fetchComplaintDetails = async () => {
    setIsLoading(true); // Set loading to true
    try {
      const res = await getDetailBuyerComplaint(complaintId);
      setDetailComplaint(res.data);
      // console.log(
      //   "ini detail complaint barang kembaliin",
      //   JSON.stringify(res.data, null, 2)
      // );
      // console.log(
      //   detailComplaint?.buyer_deadline_input_shipment <
      //     detailComplaint?.updated_at
      // );
    } catch (err) {
      showToast(
        "Gagal",
        "Gagal mengambil data transaksi. Silahkan coba lagi.",
        "error"
      );
    } finally {
      setIsLoading(false); // Set loading to false
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
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      );
    }

    switch (status) {
      case "approvedByAdmin":
        return (
          <>
            <InfoBanner contentBefore="Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali ! Proses maksimal 1 x 24 jam." />
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <View style={styles.divider} />

            {detailComplaint?.timeline
              ?.slice()
              .reverse()
              .map((item, index) => (
                <React.Fragment key={index}>
                  <TrackDispute
                    title={item?.label}
                    dateTime={formatDateWIB(item?.timestamp)}
                    details={[
                      {
                        content: item?.message || item?.reason || "-",
                      },
                      item?.evidence?.length > 0 && {
                        imgTitle: "Bukti foto & video",
                        images: item?.evidence?.map((url, key) => ({
                          uri: url,
                          key,
                        })),
                      },
                    ]}
                  />
                  <View style={styles.divider} />
                </React.Fragment>
              ))}
          </>
        );

      case "disputeProved":
        return (
          <>
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <InfoBanner contentBefore="Seller nggak kasih kabar, jadi sekarang giliran kamu buat lanjut prosesnya. Ayo upload bukti pengembalian barang!" />
            <View style={styles.divider} />
            {detailComplaint?.timeline
              ?.slice()
              .reverse()
              .map((item, index) => (
                <React.Fragment key={index}>
                  <TrackDispute
                    title={item?.label}
                    dateTime={formatDateWIB(item?.timestamp)}
                    details={[
                      {
                        content: item?.message || item?.reason || "-",
                      },
                      item?.evidence?.length > 0 && {
                        imgTitle: "Bukti foto & video",
                        images: item?.evidence?.map((url, key) => ({
                          uri: url,
                          key,
                        })),
                      },
                    ]}
                  />
                  <View style={styles.divider} />
                </React.Fragment>
              ))}
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
            <InfoBanner contentBefore="Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali ! Proses maksimal 1 x 24 jam." />
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <View style={styles.divider} />

            {detailComplaint?.timeline
              ?.slice()
              .reverse()
              .map((item, index) => (
                <React.Fragment key={index}>
                  <TrackDispute
                    title={item?.label}
                    dateTime={formatDateWIB(item?.timestamp)}
                    details={[
                      {
                        content: item?.reason || item?.message || "-",
                      },
                      item?.evidence?.length > 0 && {
                        imgTitle: "Bukti foto & video",
                        images: item?.evidence?.map((url, key) => ({
                          uri: url,
                          key,
                        })),
                      },
                    ]}
                  />
                  <View style={styles.divider} />
                </React.Fragment>
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
            <View style={styles.divider} />

            {detailComplaint?.buyer_deadline_input_shipment <
            detailComplaint?.updated_at ? (
              <>
                <TouchableOpacity
                  onPress={() => console.log("Hubungi kami di klik!")}>
                  <View style={styles.contactUsContainer}>
                    <Text style={styles.contactUsText}>
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
                      images: item?.evidence?.map((url, key) => ({
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
            <View style={styles.divider} />

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
                      images: item?.evidence?.map((url, key) => ({
                        uri: url,
                        key,
                      })),
                    },
                  ]}
                />
              ))}

            <View style={styles.divider} />
          </>
        );

      case "awaitingAdminConfirmation":
        return (
          <>
            <InfoBanner contentBefore="Konfirmasi sedang dalam proses admin, tunggu admin ya!" />
            <StatusKomplain status="Menunggu Admin" />
            <View style={styles.divider} />

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
                      images: item?.evidence?.map((url, key) => ({
                        uri: url,
                        key,
                      })),
                    },
                  ]}
                />
              ))}

            <View style={styles.divider} />
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
    <View style={styles.container}>
      <NavBackHeader title={"Detail Komplain"} />

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

      <ScrollView style={styles.scrollView}>
        {renderStatusSection()}

        {/* Data Transaksi */}
        {!isLoading && (
          <>
            <TextView
              title="Seller"
              content={detailComplaint?.transaction?.sellerEmail}
            />
            <TextView
              title="Nama Barang"
              content={detailComplaint?.transaction?.itemName}
            />
            <View style={styles.tagihanContainer}>
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
                    price: formatPrice(
                      detailComplaint?.transaction?.insuranceFee
                    ),
                  },
                  {
                    status: "Biaya Jasa Aplikasi",
                    price: formatPrice(
                      detailComplaint?.transaction?.platformFee
                    ),
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
          </>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>{renderPrimaryButton()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // bg-white
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16, // p-4
  },
  headerTitle: {
    fontSize: 16, // text-base
    fontWeight: "600", // font-semibold
  },
  headerSpacer: {
    width: 24, // Matches ChevronLeft size for alignment
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20, // Example margin
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  scrollView: {
    paddingBottom: 160, // pb-40
  },
  divider: {
    height: 8, // h-2
    backgroundColor: "#f5f5f5", // bg-[#f5f5f5]
    marginTop: 12, // mt-3
  },
  contactUsContainer: {
    alignItems: "flex-end", // items-end
    paddingHorizontal: 16, // px-4
    marginTop: 16, // mt-4
  },
  contactUsText: {
    color: "#3267E3", // text-[#3267E3]
    fontWeight: "700", // font-bold
  },
  tagihanContainer: {
    padding: 12, // p-3
  },
  buttonContainer: {
    padding: 16, // p-4
  },
});
