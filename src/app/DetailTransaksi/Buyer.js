import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftCircle, Play } from "lucide-react-native";
import Tagihan from "@/components/DetailRekber/Tagihan";
import Timestamp from "@/components/DetailRekber/Timestamp";
import ProgressBar from "@/components/ProgressBar";
import StepSuccesBar from "@/components/SuccesBar";
import CountdownTimer from "@/components/Countdown";
import PrimaryButton from "@/components/PrimaryButton";
import { getDetailBuyerTransaction } from "@/utils/api/buyer";
import moment from "moment";
import {
  updateBuyerTransaction,
  buyerConfirmReceivedTransaction,
} from "@/utils/api/buyer";
import { Alert } from "react-native";
import BuyerKonfirmasi from "@/components/BuyerKonfirmasi";
import { showToast } from "@/utils";
import NavBackHeader from "@/components/NavBackHeader";
import { Modalize } from "react-native-modalize";

export default function DetailTransaksiBuyer() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [data, setData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [paymentDone, setPaymentDone] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const modalizeRef = useRef(null);

  useEffect(() => {
    fetchTransactionDetails();
  }, [id]);

  const fetchTransactionDetails = async () => {
    try {
      const res = await getDetailBuyerTransaction(id);
      setData(res.data);
      // // console.log(
      //   "Ini Detail Buyer Transaction",
      //   JSON.stringify(res.data, null, 2)
      // );
    } catch (err) {
      showToast(
        "Gagal",
        "Gagal mengambil data transaksi. Silahkan coba lagi.",
        "error"
      );
    }
  };

  const updateTransaction = async () => {
    try {
      const res = await updateBuyerTransaction(data?.id);
      setPaymentDone(res.data);
      setIsPaymentDone(res.success);
      fetchTransactionDetails();
    } catch (error) {
      showToast("Gagal", "Gagal memperbarui transaksi", "error");
    }
  };

  const handleConfirmReceived = async () => {
    try {
      const res = await buyerConfirmReceivedTransaction(data?.id);
      setShowPopup(false);
      modalizeRef.current?.close();
      router.replace("/buyer");
    } catch (error) {
      showToast("Gagal", "Gagal memperbarui transaksi", "error");
    }
  };

  const handleSimulatePayment = () => {
    modalizeRef.current?.open();
  };

  const closeModal = () => {
    router.back();
  };

  const formatDateWIB = (dateTime) => {
    if (!dateTime) return "Invalid date";
    return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
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
    if (data?.status == "pending_payment") {
      return "Menunggu Pembayaran";
    }
    if (data?.status == "waiting_shipment") {
      return "Menunggu Resi";
    }
    if (data?.status == "shipped") {
      return "Dalam Pengiriman";
    }
    if (data?.status == "completed") {
      return "Barang Diterima";
    }
    if (data?.status == "refunded") {
      return "Dikembalikan";
    }
    if (data?.status == "canceled") {
      return "Dibatalkan";
    }
  };

  const setupDetailTimestamp = () => {
    if (data?.status == "pending_payment") {
      return [
        {
          status: "Waktu bikin Rekbr",
          date: data?.createdAt || "-",
        },
      ];
    }
    if (data?.status == "waiting_shipment") {
      return [
        {
          status: "Waktu bikin Rekbr",
          date: data?.createdAt || "-",
        },
        {
          status: "Waktu pembeli Bayar",
          date: data?.paidAt || "-",
        },
      ];
    }
    if (data?.status == "shipped") {
      if (data?.fundReleaseRequest?.status == "approved") {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data?.createdAt || "-",
          },
          {
            status: "Waktu pembeli Bayar",
            date: data?.paidAt || "-",
          },
          {
            status: "Waktu pembeli mengirimkan barang",
            date: data?.shipment?.shipmentDate || "-",
          },
          {
            status: "Waktu penjual meminta konfirmasi pembeli",
            date: data?.fundReleaseRequest.requestedAt || "-",
          },
          {
            status: "Waktu admin meneruskan permintaan konfirmasi pembeli",
            date: data?.fundReleaseRequest.resolvedAt || "-",
          },
        ];
      } else {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data?.createdAt || "-",
          },
          {
            status: "Waktu pembeli Bayar",
            date: data?.paidAt || "-",
          },
        ];
      }
    }
    if (data?.status == "completed") {
      if (data?.fundReleaseRequest?.status == "approved") {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data?.createdAt || "-",
          },
          {
            status: "Waktu pembeli Bayar",
            date: data?.paidAt || "-",
          },
          {
            status: "Waktu pembeli mengirimkan barang",
            date: data?.shipment?.shipmentDate || "-",
          },
          {
            status: "Waktu penjual meminta konfirmasi pembeli",
            date: data?.fundReleaseRequest.requestedAt || "-",
          },
          {
            status: "Waktu admin meneruskan permintaan konfirmasi pembeli",
            date: data?.fundReleaseRequest.resolvedAt || "-",
          },
        ];
      } else {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data?.createdAt || "-",
          },
          {
            status: "Waktu pembeli Bayar",
            date: data?.paidAt || "-",
          },
          {
            status: "Waktu pembeli mengirimkan barang",
            date: data?.shipment?.shipmentDate || "-",
          },
        ];
      }
    }
    if (data?.status == "canceled") {
      if (data?.paidAt == null) {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data?.createdAt || "-",
          },
        ];
      }
      if (data?.paidAt != null) {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data?.createdAt || "-",
          },
          {
            status: "Waktu pembeli Bayar",
            date: data?.paidAt || "-",
          },
        ];
      }
    }
    if (data?.status == "refunded") {
      if (data?.paidAt == null) {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data?.createdAt || "-",
          },
        ];
      }
      if (data?.paidAt != null) {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data?.createdAt || "-",
          },
          {
            status: "Waktu pembeli Bayar",
            date: data?.paidAt || "-",
          },
        ];
      }
    }
  };

  const setupCaptionTimeStamp = () => {
    if (data?.status == "pending_payment") {
      return "Pembeli transfer sebelum";
    }
    if (data?.status == "waiting_shipment") {
      return "Penjual kirim barang sebelum";
    }
    if (data?.status == "shipped") {
      if (data?.fundReleaseRequest?.status == "approved") {
        return "Mohon cek dan konfirmasi sebelum 1 x 24 jam";
      } else {
        return "Penjual sudah mengirimkan barang";
      }
    }
    if (data?.status == "completed") {
      return "Waktu konfirmasi pembeli diterima";
    }
    if (data?.status == "refunded") {
      return "Dikembalikan";
    }
    if (data?.status == "canceled") {
      return "Dibatalkan";
    }
  };

  const setupDateTimestamp = () => {
    if (data?.status == "pending_payment") {
      return data?.paymentDeadline || "-";
    }
    if (data?.status == "waiting_shipment") {
      return data?.shipmentDeadline || "-";
    }
    if (data?.status == "shipped") {
      if (data?.fundReleaseRequest?.status == "approved") {
        return data?.buyerConfirmDeadline || "-";
      } else {
        return data?.shipmentDeadline || "-";
      }
    }
    if (data?.status == "completed") {
      return data?.buyerConfirmedAt || "-";
    }
    if (data?.status == "canceled") {
      if (data?.paidAt == null) {
        return data?.createdAt || "-";
      }
      if (data?.paidAt != null) {
        return data?.paidAt || "-";
      }
    }
    if (data?.status == "refunded") {
      if (data?.paidAt == null) {
        return data?.createdAt || "-";
      }
      if (data?.paidAt != null) {
        return data?.paidAt || "-";
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const setupFooter = () => {
    if (data?.status == "pending_payment") {
      return (
        <View style={styles.footerCol}>
          <PrimaryButton
            title="Cek Status Transaksi"
            onPress={handleSimulatePayment}
          />
          <View style={styles.footerRow}>
            <Text style={styles.footerTextGray}>Terdapat kendala?</Text>
            <TouchableOpacity
              onPress={() => console.log("Hubungi Kami pressed")}>
              <Text style={styles.footerTextBlue}>Silahkan Hubungi Kami</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    if (data?.status == "waiting_shipment") {
      return (
        <View style={styles.footerRow}>
          <Text style={styles.footerTextGray}>Terdapat kendala?</Text>
          <TouchableOpacity onPress={() => console.log("Hubungi Kami pressed")}>
            <Text style={styles.footerTextBlue}>Silahkan Hubungi Kami</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (data?.status == "shipped") {
      return (
        <View style={styles.footerRowGap}>
          <PrimaryButton
            title="Komplain"
            onPress={() =>
              router.push({
                pathname: "/Complaint/Index",
                params: {
                  transactionId: data?.id,
                  sellerEmail: data?.sellerEmail,
                },
              })
            }
            height={50}
            width={"45%"}
            btnColor="#F9F9F9"
            textColor="#000"
          />
          <PrimaryButton
            title="Barang Diterima"
            onPress={() => setShowPopup(true)}
            height={50}
            width={"45%"}
          />
        </View>
      );
    }
    if (data?.status == "completed") {
      return (
        <PrimaryButton
          title="Berikan Ulasan"
          onPress={() => Alert.alert("Berikan Ulasan pressed")}
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
      return `1 %`;
    } else if (itemPrice >= 5000000 && itemPrice <= 10000000) {
      return `0.8 %`;
    }
    return 0;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <NavBackHeader title={"Detail Rekber Buyer"} />
      {(() => {
        const steps = ["Transfer", "Dikemas", "Dikirim", "Diterima"];
        let currentStep = 0;

        switch (data?.status) {
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
          case "refunded":
            currentStep = 3;
            break;
        }

        return <ProgressBar currentStep={currentStep} steps={steps} />;
      })()}
      <ScrollView>
        {(data?.status === "pending_payment" ||
          (data?.status === "waiting_shipment" &&
            data?.shipment?.trackingNumber) ||
          data?.status === "shipped" ||
          data?.status === "completed") && (
          <>
            <View
              style={{
                padding: 12,
                marginHorizontal: 12,
                backgroundColor: "#EDFBFA",
                borderRadius: 12,
              }}>
              <Text
                style={{ fontSize: 15, marginBottom: 12, fontWeight: "500" }}>
                {data?.status === "pending_payment"
                  ? "Virtual Account"
                  : "No Resi"}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom:
                    data?.status === "waiting_shipment" ||
                    data?.status === "shipped" ||
                    data?.status === "completed"
                      ? 12
                      : 0,
                }}>
                <Text style={{ fontSize: 17, fontWeight: "500" }}>
                  {data?.status === "pending_payment"
                    ? data?.virtualAccount
                    : data?.shipment?.trackingNumber}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    handleCopy(
                      data?.status === "pending_payment"
                        ? data?.virtualAccount
                        : data?.shipment?.trackingNumber
                    )
                  }>
                  <Image
                    source={require("../../assets/copy.png")}
                    style={{ marginLeft: 4, width: 17, height: 16 }}
                  />
                </TouchableOpacity>
              </View>

              {(data?.status === "waiting_shipment" ||
                data?.status === "shipped" ||
                data?.status === "completed") && (
                <Text style={{ fontSize: 14, color: "#333" }}>
                  {data?.shipment?.courier || "-"}
                </Text>
              )}
            </View>
          </>
        )}

        {/* Admin Message */}
        {(data?.fundReleaseRequest?.status == "approved" ||
          data?.status == "completed") && (
          <View style={styles.adminMsgRow}>
            <Image
              source={require("../../assets/admin1.png")}
              style={styles.adminMsgImg}
            />
            <Text style={styles.adminMsgText}>
              {data?.status == "completed"
                ? "Komplain dianggap tidak ada dan bakal selesai otomatis kalau pembeli nggak respon."
                : "Halo! Barang udah sampai. Cek dan konfirmasi, biar dana langsung ke penjual via BNI!"}
            </Text>
          </View>
        )}

        {/* Warning Message */}
        {data?.status == "shipped" && (
          <View style={{ marginVertical: 8 }}>
            <View style={styles.warningRow}>
              <Image
                source={require("../../assets/icon-warning.png")}
                style={styles.warningIcon}
                resizeMode="contain"
              />
              <Text style={styles.warningText}>
                {data.status === "completed"
                  ? "Komplain dianggap tidak ada dan bakal selesai otomatis kalau pembeli nggak respon."
                  : "Biar aman, pastikan kamu videoin proses buka paket ya! Ini penting banget sebagai bukti kalau mau komplain nanti."}
              </Text>
            </View>
          </View>
        )}

        {/* Status Rekbr */}
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status Rekbr:</Text>
          <Text style={styles.statusValue}>{setupStatus()}</Text>
        </View>

        {/* Timestamp */}
        <View style={styles.sectionBox}>
          <Timestamp
            data={data}
            caption={setupCaptionTimeStamp()}
            date={setupDateTimestamp()}
            details={setupDetailTimestamp()}
          />
        </View>

        {/* Seller Section */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionLabel}>Penjual</Text>
          <Text style={styles.sectionValue}>{data?.sellerEmail || "-"}</Text>
        </View>

        {/* Items Name Section */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionLabel}>Nama Barang</Text>
          <Text style={styles.sectionValue}>{data?.itemName || "-"}</Text>
        </View>

        {/* Items Price Section */}
        <View style={styles.sectionBox}>
          <Tagihan
            caption="Harga Barang"
            price={formatPrice(data?.totalAmount)}
            details={[
              {
                status: "Nominal Barang",
                price: formatPrice(data?.itemPrice),
              },
              {
                status: "Asuransi Pengiriman BNI Life (0.2%)",
                price: formatPrice(data?.insuranceFee),
              },
              {
                status: `Biaya Jasa Aplikasi (${calculatePlatformFee(
                  data?.itemPrice
                )})`,
                price: formatPrice(data?.platformFee),
              },
            ]}
          />
        </View>

        {/* ID Transaction Section */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionLabel}>ID Transaksi</Text>
          <View style={styles.rowAlignCenter}>
            <Text style={styles.sectionValue}>
              {data?.transactionCode || "-"}
            </Text>
            <TouchableOpacity onPress={() => handleCopy(data?.transactionCode)}>
              <Image
                source={require("../../assets/copy.png")}
                style={{ marginLeft: 4, width: 17, height: 16 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Virtual Account Section */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionLabel}>Virtual Account</Text>
          <View style={styles.rowAlignCenter}>
            <Text style={styles.sectionValue}>
              {data?.virtualAccount || "-"}
            </Text>
            <TouchableOpacity onPress={() => handleCopy(data?.virtualAccount)}>
              <Image
                source={require("../../assets/copy.png")}
                style={{ marginLeft: 4, width: 17, height: 16 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Footer */}
      <View style={styles.footerContainer}>{setupFooter()}</View>
      {/* Modal Simulate Payment*/}
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        handleStyle={{
          backgroundColor: "#ccc",
          width: 60,
          alignSelf: "center",
          top: 32,
        }}
        modalStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 24,
          paddingTop: 32,
          paddingBottom: 32,
          backgroundColor: "#fff",
        }}>
        <View style={styles.modalContent}>
          <Pressable onPress={closeModal}>
            <View style={styles.modalHeader}>
              <ChevronLeftCircle size={24} color="#00C2C2" />
              <Text style={styles.modalHeaderText}>
                {isPaymentDone ? "Uang Kamu Kami Terima" : "Mengecek..."}
              </Text>
            </View>
          </Pressable>

          <View style={styles.modalIdBox}>
            <Text style={styles.modalIdLabel}>ID Transaksi</Text>
            <View style={styles.rowAlignCenter}>
              <Text style={styles.modalIdValue}>
                {data?.transactionCode || "-"}
              </Text>
              <TouchableOpacity
                onPress={() => handleCopy(data?.transactionCode)}>
                <Image
                  source={require("../../assets/copy.png")}
                  style={{ marginLeft: 4, width: 17, height: 16 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.modalStepBar}>
            <StepSuccesBar
              currentStep={isPaymentDone ? 1 : 0}
              steps={["Mengecek", "Diterima"]}
            />
          </View>

          {!isPaymentDone ? (
            <>
              <Text style={styles.modalDeadlineLabel}>
                Kamu sebaiknya transfer sebelum :
              </Text>
              <View style={styles.modalDeadlineBox}>
                <Text style={styles.modalDeadlineTime}>
                  <CountdownTimer
                    deadline={data?.paymentDeadline || "-"}
                    fromTime={data?.currentTimestamp || "-"}
                  />
                </Text>
              </View>
              <Text style={styles.modalDeadlineDate}>
                {formatDateWIB(data?.paymentDeadline || "-")}
              </Text>

              <Pressable
                style={styles.modalSimulateBtn}
                onPress={updateTransaction}>
                <Play size={20} color="#000" />
                <Text style={styles.modalSimulateBtnText}>
                  Simulate Payment
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.modalSuccessTitle}>
                Transaksi Berhasil Diproses
              </Text>
              <Text style={styles.modalSuccessDate}>
                {formatDateWIB(paymentDone?.paidAt || "-")}
              </Text>
              <View style={styles.modalBuyerRow}>
                <View style={styles.modalBuyerRowInner}>
                  <Text style={styles.modalBuyerLabel}>Pembeli</Text>
                  <View style={styles.modalBuyerInfo}>
                    <Image
                      source={require("../../assets/logo-bni.png")}
                      style={styles.modalBuyerLogo}
                    />
                    <View style={styles.rowAlignCenter}>
                      <Text style={styles.modalBuyerAccount}>0600604502</Text>
                      <TouchableOpacity
                        onPress={() => handleCopy("0600604502")}>
                        <Image
                          source={require("../../assets/copy.png")}
                          style={{ marginLeft: 4, width: 17, height: 16 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}

          <View style={styles.modalFooterRow}>
            <Text style={styles.modalFooterTextGray}>Terdapat kendala?</Text>
            <Text style={styles.modalFooterTextBlue}>
              Silahkan Hubungi Kami
            </Text>
          </View>
        </View>
      </Modalize>

      <BuyerKonfirmasi
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        onBtn2={handleConfirmReceived}
        onBtn1={() => setShowPopup(false)}
        title="Pastikan semua data di form sudah benar dan lengkap sebelum kamu kirim. Cek lagi, ya!"
        btn1="Kembali"
        btn2="Konfirmasi"
      />
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
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF08A",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
    borderRadius: 8,
  },
  warningIcon: {
    width: 20,
    height: 20,
  },
  warningText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
    flex: 1,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginHorizontal: 12,
    padding: 12,
  },
  statusLabel: {
    fontSize: 15,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: "500",
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
  modalContent: {
    backgroundColor: "#fff",
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
  },
  modalIdBox: {
    backgroundColor: "#D1FAE5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  modalIdLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  modalIdValue: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 2,
    marginLeft: 16,
  },
  modalStepBar: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalDeadlineLabel: {
    textAlign: "center",
    color: "#4B5563",
    marginTop: 24,
    marginBottom: 12,
    fontSize: 15,
  },
  modalDeadlineBox: {
    alignItems: "center",
    marginBottom: 12,
  },
  modalDeadlineTime: {
    fontSize: 22,
    fontWeight: "700",
    backgroundColor: "#FEF08A",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    color: "#B45309",
  },
  modalDeadlineDate: {
    textAlign: "center",
    color: "#4B5563",
    marginBottom: 20,
    fontSize: 15,
  },
  modalSimulateBtn: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalSimulateBtnText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#1F2937",
    fontSize: 16,
  },
  modalSuccessTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  modalSuccessDate: {
    textAlign: "center",
    color: "#4B5563",
    marginBottom: 20,
    fontSize: 15,
  },
  modalBuyerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalBuyerRowInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  modalBuyerLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 24,
  },
  modalBuyerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalBuyerLogo: {
    width: 80,
    height: 48,
    resizeMode: "cover",
  },
  modalBuyerAccount: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
  modalFooterRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  modalFooterTextGray: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 15,
  },
  modalFooterTextBlue: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 15,
  },
});
