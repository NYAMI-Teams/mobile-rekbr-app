import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "@/components/ProgressBar";
import Timestamp from "@/components/DetailRekber/Timestamp";
import * as Clipboard from "expo-clipboard";
import PrimaryButton from "@/components/PrimaryButton";
import Tagihan from "@/components/DetailRekber/Tagihan";
import { useLocalSearchParams, useRouter } from "expo-router";
import { cancelTransaksiSeller } from "@/utils/api/seller";
import { getDetailSellerTransaction } from "@/utils/api/seller";
import BuyerKonfirmasi from "@/components/BuyerKonfirmasi";
import { showToast } from "@/utils";
import NavBackHeader from "@/components/NavBackHeader";

export default function DetailTransaksiSeller() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [data, setData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const res = await getDetailSellerTransaction(id);
        setData(res.data);
        setStatus(res.data.status);
      } catch (err) {
        showToast(
          "Gagal",
          "Gagal mengambil data transaksi. Silahkan coba lagi.",
          "error"
        );
      }
    };

    fetchTransactionDetails();
  }, [id]);

  const handleCancelTransaksiSeller = async () => {
    try {
      const res = await cancelTransaksiSeller(data?.id);
      if (res) {
        setShowPopup(false);
        showToast("Berhasil", "Transaksi berhasil dibatalkan", "success");
        router.replace("/");
      }
    } catch (error) {
      showToast("Gagal", "Transaksi gagal dibatalkan", "error");
    }
  };

  const handleCopy = async (text) => {
    if (!text) return;
    try {
      await Clipboard.setStringAsync(text);
      showToast("Berhasil", "Disalin ke clipboard", "success");
    } catch (error) {
      showToast("Gagal", "Tidak dapat menyalin", "error");
    }
  };

  const setupStatus = () => {
    if (status == "pending_payment") return "Menunggu Pembayaran";
    if (status == "waiting_shipment") return "Masukkan Resi";
    if (status == "shipped") return "Dalam Pengiriman";
    if (status == "completed") return "Barang Diterima";
    if (status == "refunded") return "Dikembalikan";
    if (status == "canceled") return "Dibatalkan";
  };

  const setupDetailTimestamp = () => {
    if (status == "pending_payment") {
      return [
        { status: "Waktu bikin Rekbr", date: data?.createdAt || "-" },
      ];
    }
    if (status == "waiting_shipment") {
      return [
        { status: "Waktu bikin Rekbr", date: data?.createdAt || "-" },
        { status: "Waktu pembeli Bayar", date: data?.paidAt || "-" },
      ];
    }
    if (status == "shipped") {
      if (data?.fundReleaseRequest?.status == "approved") {
        return [
          { status: "Waktu bikin Rekbr", date: data?.createdAt || "-" },
          { status: "Waktu pembeli Bayar", date: data?.paidAt || "-" },
          { status: "Waktu penjual mengirimkan barang", date: data?.shipment.shipmentDate || "-" },
          { status: "Waktu penjual meminta konfirmasi pembeli", date: data?.fundReleaseRequest?.requestedAt || "-" },
          { status: "Waktu admin meneruskan permintaan konfirmasi pembeli", date: data?.fundReleaseRequest?.resolvedAt || "-" },
        ];
      } else {
        return [
          { status: "Waktu bikin Rekbr", date: data?.createdAt || "-" },
          { status: "Waktu pembeli Bayar", date: data?.paidAt || "-" },
        ];
      }
    }
    if (status == "completed") {
      if (data?.fundReleaseRequest?.status == "approved") {
        return [
          { status: "Waktu bikin Rekbr", date: data?.createdAt || "-" },
          { status: "Waktu pembeli Bayar", date: data?.paidAt || "-" },
          { status: "Waktu penjual mengirimkan barang", date: data?.shipment.shipmentDate || "-" },
          { status: "Waktu penjual meminta konfirmasi pembeli", date: data?.fundReleaseRequest?.requestedAt || "-" },
          { status: "Waktu admin meneruskan permintaan konfirmasi pembeli", date: data?.fundReleaseRequest?.resolvedAt || "-" },
        ];
      } else {
        return [
          { status: "Waktu bikin Rekbr", date: data?.createdAt || "-" },
          { status: "Waktu pembeli Bayar", date: data?.paidAt || "-" },
          { status: "Waktu penjual mengirimkan barang", date: data?.shipment.shipmentDate || "-" },
        ];
      }
    }
    if (status == "canceled") {
      if (data?.paidAt == null) {
        return [{ status: "Waktu bikin Rekbr", date: data?.createdAt || "-" }];
      }
      if (data?.paidAt != null) {
        return [
          { status: "Waktu bikin Rekbr", date: data?.createdAt || "-" },
          { status: "Waktu pembeli Bayar", date: data?.paidAt || "-" },
        ];
      }
    }
  };

  const setupCaptionTimeStamp = () => {
    if (status == "pending_payment") return "Pembeli transfer sebelum";
    if (status == "waiting_shipment") return "Penjual masukkan resi dan bukti pengiriman sebelum";
    if (status == "shipped") {
      if (data?.fundReleaseRequest?.status == "pending") return "Penjual mengajukan permintaan konfirmasi penerimaan barang";
      if (data?.fundReleaseRequest?.status == "approved") return "Penjual, tunggu respon pembeli 1 x 24 jam";
      if (data?.fundReleaseRequest?.status == "rejected") return "Admin menolak permintaan konfirmasi penerimaan barang";
      return "Penjual sudah mengirimkan barang";
    }
    if (status == "completed") return "Waktu konfirmasi pembeli diterima";
    if (status == "refunded") return "Dikembalikan";
    if (status == "canceled") return "Dibatalkan";
  };

  const setupDateTimestamp = () => {
    if (status == "pending_payment") return data?.paymentDeadline || "-";
    if (status == "waiting_shipment") return data?.shipmentDeadline || "-";
    if (status == "shipped") {
      if (data?.fundReleaseRequest?.status == "pending") return data?.fundReleaseRequest?.requestedAt || "-";
      if (data?.fundReleaseRequest?.status == "approved") return data?.fundReleaseRequest?.resolvedAt || "-";
      if (data?.fundReleaseRequest?.status == "rejected") return data?.fundReleaseRequest?.resolvedAt || "-";
      return data?.shipment.shipmentDate || "-";
    }
    if (status == "completed") return data?.buyerConfirmedAt || "-";
    if (status == "canceled") {
      if (data?.paidAt == null) return data?.createdAt || "-";
      if (data?.paidAt != null) return data?.paidAt || "-";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const setupFooter = () => {
    if (status == "pending_payment") {
      return (
        <View style={styles.footerCol}>
          <PrimaryButton
            title="Batalkan Rekbr"
            onPress={() => setShowPopup(true)}
            btnColor="#FEF0E9"
            textColor="#000"
          />
          <View style={styles.footerRow}>
            <Text style={styles.footerTextGray}>
              Terdapat kendala?
            </Text>
            <TouchableOpacity
              onPress={() => console.log("Hubungi Kami pressed")}>
              <Text style={styles.footerTextBlue}>
                Silahkan Hubungi Kami
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    if (status == "waiting_shipment") {
      return (
        <View style={styles.footerCol}>
          <View style={styles.footerRowGap}>
            <PrimaryButton
              title="Batalkan Rekbr"
              onPress={() => setShowPopup(true)}
              height={50}
              width={"45%"}
              btnColor="#FEF0E9"
              textColor="#000"
            />
            <PrimaryButton
              title="Masukkan Resi"
              onPress={() =>
                router.push({
                  pathname: "/InputResi",
                  params: { id: data?.id },
                })
              }
              height={50}
              width={"45%"}
            />
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.footerTextGray}>
              Terdapat kendala?
            </Text>
            <TouchableOpacity
              onPress={() => console.log("Hubungi Kami pressed")}>
              <Text style={styles.footerTextBlue}>
                Silahkan Hubungi Kami
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    if (status == "shipped") {
      return (
        <PrimaryButton
          title="Kirim Permintaan Konfirmasi"
          onPress={() =>
            router.push({
              pathname: "/FundReleaseRequest",
              params: { id: data?.id },
            })
          }
          disabled={
            data?.fundReleaseRequest?.status == "approved" ||
            data?.fundReleaseRequest?.status == "pending"
          }
        />
      );
    }
    if (status == "completed") {
      return (
        <PrimaryButton
          title="Berikan Ulasan"
          onPress={() => Alert.alert("Berikan Ulasan")}
          btnColor="#F9F9F9"
          textColor="#000"
        />
      );
    }
  };

  const calculatePlatformFee = (itemPrice) => {
    if (itemPrice >= 10000 && itemPrice <= 499999.99) {
      return 5000;
    } else if (itemPrice >= 500000 && itemPrice <= 4999999.99) {
      const platformFee = itemPrice * 0.01;
      return `${platformFee} %`;
    } else if (itemPrice >= 5000000 && itemPrice <= 10000000) {
      const platformFee = itemPrice * 0.008;
      return `${platformFee} %`;
    }
    return 0;
  };

  const setupStatusFundReleaseRequest = () => {
    if (data?.fundReleaseRequest?.status == "pending") {
      return "Permintaan Ditinjau";
    }
    if (data?.fundReleaseRequest?.status == "rejected") {
      return "Permintaan Ditolak";
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <NavBackHeader title={"Detail Rekber Seller"} />
      {(() => {
        const steps = ["Transfer", "Dikemas", "Dikirim", "Diterima"];
        let currentStep = 0;

        switch (status) {
          case "pending_payment":
            currentStep = 0;
            break;
          case "waiting_shipment":
            currentStep = 1;
            break;
          case "shipped":
            currentStep = 2;
            break;
          case "completed":
            currentStep = 3;
            break;
        }

        return <ProgressBar currentStep={currentStep} steps={steps} />;
      })()}
      <ScrollView>
        {(status == "pending_payment" ||
          (status == "waiting_shipment" && data?.shipment?.trackingNumber != null) ||
          status == "shipped" ||
          status == "completed") && (
          <>
            {/* Copas Field */}
            <View style={styles.copyBox}>
              <Text style={styles.copyBoxTitle}>
                {status == "pending_payment" ? "Virtual Account" : "No Resi"}
              </Text>
              <View style={[
                styles.copyRow,
                (status == "waiting_shipment" ||
                  status == "shipped" ||
                  status == "completed") && { marginBottom: 12 }
              ]}>
                <Text style={styles.copyRowText}>
                  {status == "pending_payment"
                    ? data?.virtualAccount || "-"
                    : data?.shipment?.trackingNumber || "-"}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    handleCopy(
                      status == "pending_payment"
                        ? data?.virtualAccount || "-"
                        : data?.shipment?.trackingNumber || "-"
                    )
                  }>
                  <Image
                    source={require("@/assets/copy.png")}
                    style={{ marginLeft: 4, width: 17, height: 16 }}
                  />
                </TouchableOpacity>
              </View>
              {(status == "waiting_shipment" ||
                status == "shipped" ||
                status == "completed") && (
                <Text style={styles.copyBoxCourier}>
                  {data?.shipment?.courier || "-"}
                </Text>
              )}
            </View>
          </>
        )}

        {/* Admin Message */}
        {(data?.fundReleaseRequest?.status != null || status == "completed") && (
          <View style={styles.adminMsgRow}>
            <Image
              source={require("@/assets/admin1.png")}
              style={styles.adminMsgImg}
            />
            <Text style={styles.adminMsgText}>
              {status == "completed"
                ? "Komplain dianggap tidak ada dan bakal selesai otomatis kalau pembeli nggak respon."
                : data?.fundReleaseRequest?.status == "pending"
                  ? "Tunggu approval kami, ya! Kalau bukti kamu oke, permintaan konfirmasi bakal langsung dikirim ke buyer!"
                  : data?.fundReleaseRequest?.status == "approved"
                    ? "Konfirmasi udah dikirim ke buyer! Sekarang tinggal tunggu respon mereka dalam 1 x 24 jam"
                    : "Permintaan konfirmasi ke buyer ditolak. Pastikan data atau bukti yang kamu kirim sudah lengkap dan sesuai"}
            </Text>
          </View>
        )}

        {/* Status Rekbr */}
        {(data?.fundReleaseRequest?.status == "pending" ||
          data?.fundReleaseRequest?.status == "rejected") ? (
          <View style={styles.statusBox}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Status Rekbr:</Text>
              <View style={styles.statusRowRight}>
                <Text style={styles.statusValue}>{setupStatus()}</Text>
                <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {isExpanded && (
              <View style={styles.statusExpandedBox}>
                <Text style={styles.statusExpandedLabel}>
                  Status Pengajuan:
                </Text>
                <Text style={[
                  styles.statusExpandedValue,
                  { color: data?.fundReleaseRequest?.status == "pending" ? "#FBBF24" : "#CB3A31" }
                ]}>
                  {setupStatusFundReleaseRequest()}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.statusRowSimple}>
            <Text style={styles.statusLabel}>Status Rekbr:</Text>
            <Text style={styles.statusValue}>{setupStatus()}</Text>
          </View>
        )}

        {/* Timestamp */}
        <View style={styles.sectionBox}>
          <Timestamp
            data={data}
            caption={setupCaptionTimeStamp()}
            date={setupDateTimestamp()}
            details={setupDetailTimestamp()}
          />
        </View>

        {/* Buyer Section */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionLabel}>Pembeli</Text>
          <Text style={styles.sectionValue}>
            {data?.buyerEmail || "-"}
          </Text>
        </View>

        {/* Virtual Account Section */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionLabel}>Virtual Account</Text>
          <View style={styles.rowAlignCenter}>
            <Text style={styles.sectionValue}>
              {data?.virtualAccount || "-"}
            </Text>
            <TouchableOpacity
              onPress={() => handleCopy(data?.virtualAccount || "-")}>
              <Image
                source={require("@/assets/copy.png")}
                style={{ marginLeft: 4, width: 17, height: 16 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Items Name Section */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionLabel}>Nama Barang</Text>
          <Text style={styles.sectionValue}>
            {data?.itemName || "-"}
          </Text>
        </View>

        {/* Items Price Section */}
        <View style={styles.sectionBox}>
          <Tagihan
            caption="Harga Barang"
            price={formatPrice(data?.totalAmount || "-")}
            details={[
              {
                status: "Nominal Barang",
                price: formatPrice(data?.itemPrice || "-"),
              },
              {
                status: "Asuransi Pengiriman BNI Life (0.2%)",
                price: formatPrice(data?.insuranceFee || "-"),
              },
              {
                status: `Biaya Jasa Aplikasi (${calculatePlatformFee(
                  data?.itemPrice
                )})`,
                price: formatPrice(data?.platformFee || "-"),
              },
            ]}
          />
        </View>

        {/* Seller Bank Section */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionLabel}>Rekening Penjual</Text>
          <View style={styles.sellerBankRow}>
            <Image
              source={{ uri: data?.rekeningSeller?.logoUrl || "-" }}
              style={styles.sellerBankLogo}
            />
            <View style={styles.rowAlignCenter}>
              <Text style={styles.sectionValue}>
                {data?.rekeningSeller?.accountNumber || "-"}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  handleCopy(data?.rekeningSeller?.accountNumber || "-")
                }>
                <Image
                  source={require("@/assets/copy.png")}
                  style={{ marginLeft: 4, width: 17, height: 16 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Transaction ID Section */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionLabel}>ID Transaksi</Text>
          <View style={styles.rowAlignCenter}>
            <Text style={styles.sectionValue}>
              {data?.transactionCode}
            </Text>
            <TouchableOpacity
              onPress={() => handleCopy(data?.transactionCode || "-")}>
              <Image
                source={require("@/assets/copy.png")}
                style={{ marginLeft: 4, width: 17, height: 16 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Footer */}
      <View style={styles.footerContainer}>
        {setupFooter()}
      </View>

      {/* Modal */}
      {showPopup &&
        (status == "pending_payment" || status == "waiting_shipment") && (
          <BuyerKonfirmasi
            onClose={() => setShowPopup(false)}
            onBtn2={handleCancelTransaksiSeller}
            onBtn1={() => setShowPopup(false)}
            title="Apakah kamu yakin ingin membatalkan transaksi Rekbr ini?"
            btn1="Kembali"
            btn2="Batalkan"
            isBatalkan={true}
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
  copyBox: {
    padding: 12,
    marginHorizontal: 12,
    backgroundColor: "#EDFBFA",
    borderRadius: 12,
  },
  copyBoxTitle: {
    fontSize: 15,
    marginBottom: 12,
    fontWeight: "500",
  },
  copyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  copyRowText: {
    fontSize: 17,
    fontWeight: "500",
  },
  copyBoxCourier: {
    fontSize: 12,
    fontWeight: "400",
    color: "#616161",
  },
  adminMsgRow: {
    flexDirection: "row",
    marginHorizontal: 12,
    padding: 12,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  adminMsgImg: {
    width: 20,
    height: 20,
  },
  adminMsgText: {
    fontSize: 14,
    flex: 1,
  },
  statusBox: {
    flexDirection: "column",
    gap: 8,
    marginHorizontal: 12,
    padding: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusLabel: {
    fontSize: 15,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  statusExpandedBox: {
    backgroundColor: "#fff",
    paddingLeft: 8,
    paddingVertical: 8,
    borderLeftColor: "#F5F5F5",
    borderLeftWidth: 4,
    marginHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusExpandedLabel: {
    fontSize: 14,
    fontWeight: "400",
    color: "#616161",
  },
  statusExpandedValue: {
    fontSize: 13,
    fontWeight: "500",
  },
  statusRowSimple: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginHorizontal: 12,
    padding: 12,
  },
  sectionBox: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 12,
    padding: 12,
  },
  sectionLabel: {
    fontSize: 15,
  },
  sectionValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  rowAlignCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerBankRow: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  sellerBankLogo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  footerContainer: {
    padding: 12,
    borderTopWidth: 2,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#fff",
  },
  footerCol: {
    flexDirection: "column",
    gap: 16,
    width: "100%",
    alignItems: "center",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 12,
    width: "100%",
    justifyContent: "center",
  },
  footerRowGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    width: "100%",
    justifyContent: "center",
  },
  footerTextGray: {
    fontSize: 14,
    color: "#616161",
  },
  footerTextBlue: {
    fontSize: 14,
    color: "#3267E3",
    fontWeight: "500",
  },
});