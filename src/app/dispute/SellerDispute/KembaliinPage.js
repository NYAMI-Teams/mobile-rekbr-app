import {
  Alert,
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import NavBackHeader from "@/components/NavBackHeader";

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
  }, [id]);

  const fetchDetailComplaint = async () => {
    try {
      console.log("ID Complaint:", id);
      console.log("Status Complaint:", status);

      const res = await getDetailSellerComplaint(id);
      setDetailComplaint(res.data);
      setSellerRejected(res.data.seller_decision === "rejected");
      setBuyerExpiredDate(res.data.status === "canceled_by_buyer");
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
                      images: item?.evidence.map((url, key) => ({
                        uri: url,
                        key,
                      })),
                    },
                  ]}
                />
              ))}
          </>
        );

      case "disputeProved":
        return (
          <>
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <InfoBanner contentBefore="Seller nggak kasih kabar, jadi sekarang giliran kamu buat lanjut prosesnya. Ayo upload bukti pengembalian barang!" />
            <View style={styles.divider} />
            <TrackDispute
              title="Seller nggak respon dalam 2x24 jam."
              dateTime={formatDateWIB(detailComplaint?.timeline[2]?.timestamp)}
              details={[
                {
                  content:
                    "Sekarang giliran kamu kirim balik barangnya. Jangan lupa upload bukti pengiriman supaya proses refund lanjut!",
                },
              ]}
            />
            <View style={styles.divider} />
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
            <InfoBanner contentBefore="Buyer akan mengembalikan barang dalam 24 jam, konfirmasi bila barang telah sampai dan diterima." />
            <StatusKomplain status="Menunggu Pengembalian Barang" />
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
                      images: item?.evidence.map((url, key) => ({
                        uri: url,
                        key,
                      })),
                    },
                  ]}
                />
              ))}
          </>
        );

      case "returnInTransit":
        return (
          <>
            {buyerExpiredDate === true ? (
              <InfoBanner
                contentBefore="Karena pengembalian barang sudah lewat 1 x 24 jam, komplain"
                dateTime=" dianggap selesai dan tidak bisa diproses lagi"
              />
            ) : (
              <InfoBanner contentBefore="Konfirmasi bila barang telah sampai dan diterima ya!" />
            )}

            <StatusKomplain
              status={
                buyerExpiredDate === true
                  ? "Transaksi Selesai"
                  : "Menunggu Pengembalian Barang"
              }
            />
            <View style={styles.divider} />

            {buyerExpiredDate === true ? (
              <>
                <TouchableOpacity
                  onPress={() => console.log("Hubungi kami di klik!")}
                >
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
            <InfoBanner contentBefore="Konfirmasi resi udah dikirim ke buyer, segera konfirmasi ya!" />
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
                      images: item?.evidence.map((url, key) => ({
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
            <InfoBanner contentBefore="Tunggu approval bukti dari admin, ya! Kalau bukti kamu oke, permintaan konfirmasi bakal langsung dikirim ke seller!" />
            <StatusKomplain status="Menunggu Pengembalian Barang" />
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

      case "approvedByAdmin":
        return (
          <>
            <InfoBanner contentBefore="Halo! Barang sudah sampai. Konfirmasi dalam 24 jam, kalau nggak, dana otomatis dikembalikan ke buyer." />
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <View style={styles.timerContainer}>
              <View style={styles.timerBox}>
                <Text style={styles.timerText}>23 : 59 : 59</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <TrackDispute
              title="Pengembalian barang oleh buyer"
              dateTime={formatDateWIB(detailComplaint?.timeline[2]?.timestamp)}
              details={[
                {
                  resiNumber: detailComplaint?.timeline[2]?.trackingNumber,
                  expedition: detailComplaint?.timeline[2]?.courier,
                },
              ]}
            />
            <View style={styles.divider} />
          </>
        );
      default:
        return <></>;
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
            // No need to router.back() here, as it would close the alert immediately
          },
        },
        {
          text: "Konfirmasi",
          style: "destructive",
          onPress: () => {
            console.log("Finishing Id ===> ", id);
            postSellerConfirmReturn(id)
              .then(() => {
                showToast(
                  "Berhasil",
                  "Konfirmasi barang berhasil dikirimkan",
                  "success"
                );
                router.replace("../../(tabs)/complaint");
              })
              .catch((err) => {
                showToast("Gagal", err?.message, "error");
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
    <View style={styles.container}>
      <NavBackHeader title={"Detail Komplain"} />

      <StepProgressBar
        key={"step-seller-kembaliin"}
        currentStep={2}
        steps={["Seller", "Admin", "Kembaliin", "Refunded"]}
        rejectedSteps={buyerExpiredDate ? [2] : sellerRejected ? [0] : []}
      />

      <ScrollView style={styles.scrollView}>
        {renderStatusSection()}

        {/* Data Transaksi */}
        <TextView
          title="Seller"
          content={detailComplaint?.transaction?.buyerEmail}
        />
        <TextView
          title="Nama Barang"
          content={detailComplaint?.transaction?.itemName}
        />
        <View style={styles.tagihanContainer}>
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
      {status === "returnRequested" ? (
        <></>
      ) : (
        <>
          {/* Bottom Action */}
          <View style={styles.bottomActionContainer}>
            <PrimaryButton
              title="Komplain"
              onPress={handleSubmit}
              width="48%"
              btnColor="#F9F9F9"
              textColor="#000000"
              style={styles.komplainButton}
            />
            <PrimaryButton
              title="Barang diterima"
              onPress={handleSellerAccept}
              width="48%"
            />
          </View>
        </>
      )}
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
  timerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end", // justify-end
    paddingHorizontal: 16, // px-4
    marginTop: 16, // mt-4
  },
  timerBox: {
    padding: 8, // p-2
    borderRadius: 4, // rounded
    backgroundColor: "#FEF2D3", // bg-[#FEF2D3]
  },
  timerText: {
    fontWeight: "700", // font-bold
    color: "#000000", // text-black
  },
  scrollView: {
    paddingBottom: 160, // pb-40
  },
  tagihanContainer: {
    padding: 12, // p-3
  },
  bottomActionContainer: {
    flexDirection: "row",
    paddingHorizontal: 16, // px-4
    paddingBottom: 16, // pb-4
    paddingTop: 8, // pt-2
    marginTop: 20, // mt-5
    backgroundColor: "#ffffff", // bg-white
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  komplainButton: {
    marginRight: 8, // style={{ marginRight: 8 }}
  },
});
