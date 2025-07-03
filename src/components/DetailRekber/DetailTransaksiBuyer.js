import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Text,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../ProgressBar";
import Timestamp from "./Timestamp";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import PrimaryButton from "../PrimaryButton";
import Tagihan from "./Tagihan";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { ChevronLeftCircle, Play } from "lucide-react-native";
import StepSuccesBar from "../../components/SuccesBar";
import CountdownTimer from "../Countdown";
import moment from "moment";
import {
  updateBuyerTransaction,
  buyerConfirmReceivedTransaction,
} from "../../utils/api/buyer";
import BuyerKonfirmasi from "../BuyerKonfirmasi";
import { showToast } from "../../utils";

export default function DetailTransaksiBuyer({ data }) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [paymentDone, setPaymentDone] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => { }, []);

  const updateTransaction = async () => {
    try {
      const res = await updateBuyerTransaction(data?.id);
      setPaymentDone(res.data);
      setIsPaymentDone(res.success);
      router.replace("/buyer");
    } catch (error) {
      showToast("Gagal", "Gagal memperbarui transaksi", "error");
    }
  };

  const handleConfirmReceived = async () => {
    try {
      const res = await buyerConfirmReceivedTransaction(data?.id);
      setShowPopup(false);
      router.replace("/buyer");
    } catch (error) {
      showToast("Gagal", "Gagal memperbarui transaksi", "error");
    }
  };

  const handleSimulatePayment = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    router.replace("/buyer");
  };

  const formatDateWIB = (dateTime) => {
    if (!dateTime) return "Invalid date";
    return moment(dateTime).utcOffset(0).format("DD MMMM YYYY, HH:mm [WIB]");
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
    if (data?.status == "pending_payment") return "Menunggu Pembayaran";
    if (data?.status == "waiting_shipment") return "Menunggu Resi";
    if (data?.status == "shipped") return "Dalam Pengiriman";
    if (data?.status == "completed") return "Barang Diterima";
    if (data?.status == "refunded") return "Dikembalikan";
    if (data?.status == "canceled") return "Dibatalkan";
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
  };

  const setupCaptionTimeStamp = () => {
    if (data?.status == "pending_payment") return "Pembeli transfer sebelum";
    if (data?.status == "waiting_shipment") return "Penjual kirim barang sebelum";
    if (data?.status == "shipped") {
      if (data?.fundReleaseRequest?.status == "approved") {
        return "Mohon cek dan konfirmasi sebelum 1 x 24 jam";
      } else {
        return "Penjual sudah mengirimkan barang";
      }
    }
    if (data?.status == "completed") return "Waktu konfirmasi pembeli diterima";
    if (data?.status == "refunded") return "Dikembalikan";
    if (data?.status == "canceled") return "Dibatalkan";
  };

  const setupDateTimestamp = () => {
    if (data?.status == "pending_payment") return data?.paymentDeadline || "-";
    if (data?.status == "waiting_shipment") return data?.shipmentDeadline || "-";
    if (data?.status == "shipped") {
      if (data?.fundReleaseRequest?.status == "approved") {
        return data?.buyerConfirmDeadline || "-";
      } else {
        return data?.shipmentDeadline || "-";
      }
    }
    if (data?.status == "completed") return data?.buyerConfirmedAt || "-";
    if (data?.status == "canceled") {
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
    if (data?.status == "pending_payment") {
      return (
        <View style={styles.footerCol}>
          <PrimaryButton
            title="Cek Status Transaksi"
            onPress={handleSimulatePayment}
          />
          <View style={styles.footerRow}>
            <Text style={styles.footerTextGray}>Terdapat kendala?</Text>
            <TouchableOpacity onPress={() => Alert.alert("Hubungi Kami")}>
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
          <TouchableOpacity onPress={() => Alert.alert("Hubungi Kami")}>
            <Text style={styles.footerTextBlue}>Silahkan Hubungi Kami</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (data?.status == "shipped") {
      return (
        <View style={styles.footerShippedRow}>
          <PrimaryButton
            title="Komplain"
            onPress={() =>
              router.push({
                pathname: "/dispute",
                params: { data: JSON.stringify(data) },
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
      const platformFee = itemPrice * 0.01;
      return `${platformFee} %`;
    } else if (itemPrice >= 5000000 && itemPrice <= 10000000) {
      const platformFee = itemPrice * 0.008;
      return `${platformFee} %`;
    }
    return 0;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Transaksi</Text>
        <View style={{ width: 24 }} />
      </View>
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
            currentStep = 3;
            break;
        }
        return <ProgressBar currentStep={currentStep} steps={steps} />;
      })()}
      <ScrollView>
        {(data?.status == "pending_payment" ||
          (data?.status == "waiting_shipment" &&
            data?.shipment?.trackingNumber != null) ||
          data?.status == "shipped" ||
          data?.status == "completed") && (
            <>
              {/* Copas Field */}
              <View style={styles.copyFieldContainer}>
                <Text style={styles.copyFieldTitle}>
                  {data?.status == "pending_payment"
                    ? "Virtual Account"
                    : "No Resi"}
                </Text>
                <View
                  style={[
                    { flexDirection: "row", alignItems: "center" },
                    (data?.status === "waiting_shipment" || data?.status === "shipped" || data?.status === "completed") && { marginBottom: 12 } // mb-3 = 12px
                  ]}
                >
                  <Text style={styles.copyFieldValue}>
                    {data?.status == "pending_payment"
                      ? data?.virtualAccount
                      : data?.shipment?.trackingNumber}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      handleCopy(
                        data?.status == "pending_payment"
                          ? data?.virtualAccount
                          : data?.shipment?.trackingNumber
                      )
                    }>
                    <Image
                      source={require("../../assets/copy.png")}
                      style={styles.copyIcon}
                    />
                  </TouchableOpacity>
                </View>
                {(data?.status == "waiting_shipment" ||
                  data?.status == "shipped" ||
                  data?.status == "completed") && (
                    <Text style={styles.copyFieldCourier}>
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
                style={styles.adminMsgIcon}
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
          <View style={styles.warningMsgContainer}>
            <View style={styles.warningMsgRow}>
              <Image
                source={require("../../assets/icon-warning.png")}
                style={styles.warningIcon}
                resizeMode="contain"
              />
              <Text style={styles.warningMsgText}>
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
        <View style={styles.sectionContainer}>
          <Timestamp
            data={data}
            caption={setupCaptionTimeStamp()}
            date={setupDateTimestamp()}
            details={setupDetailTimestamp()}
          />
        </View>

        {/* Seller Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Penjual</Text>
          <Text style={styles.sectionValue}>{data?.sellerEmail || "-"}</Text>
        </View>

        {/* Items Name Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Nama Barang</Text>
          <Text style={styles.sectionValue}>{data?.itemName || "-"}</Text>
        </View>

        {/* Items Price Section */}
        <View style={styles.sectionContainer}>
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
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>ID Transaksi</Text>
          <View style={styles.rowAlignCenter}>
            <Text style={styles.sectionValue}>
              {data?.transactionCode || "-"}
            </Text>
            <TouchableOpacity onPress={() => handleCopy(data?.transactionCode)}>
              <Image
                source={require("../../assets/copy.png")}
                style={styles.copyIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Virtual Account Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Virtual Account</Text>
          <View style={styles.rowAlignCenter}>
            <Text style={styles.sectionValue}>
              {data?.virtualAccount || "-"}
            </Text>
            <TouchableOpacity onPress={() => handleCopy(data?.virtualAccount)}>
              <Image
                source={require("../../assets/copy.png")}
                style={styles.copyIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Footer */}
      <View style={styles.footerContainer}>{setupFooter()}</View>
      {/* Modal Simulate Payment*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <Pressable
          style={styles.modalOverlay}
          onPress={closeModal}>
          <Pressable
            style={styles.modalContent}
            onPress={(event) => event.stopPropagation()}>
            <Pressable onPress={closeModal}>
              <View style={styles.modalHeader}>
                <ChevronLeftCircle size={24} color="#00C2C2" />
                <Text style={styles.modalHeaderTitle}>
                  {isPaymentDone ? "Uang Kamu Kami Terima" : "Mengecek..."}
                </Text>
              </View>
            </Pressable>

            <View style={styles.modalIdRow}>
              <Text style={styles.modalIdLabel}>ID Transaksi</Text>
              <View style={styles.rowAlignCenter}>
                <Text style={styles.modalIdValue}>
                  {data?.transactionCode || "-"}
                </Text>
                <TouchableOpacity
                  onPress={() => handleCopy(data?.transactionCode)}>
                  <Image
                    source={require("../../assets/copy.png")}
                    style={styles.copyIcon}
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
                <View style={styles.modalDeadlineTimeWrap}>
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
                <Text style={styles.modalDeadlineDate}>
                  {formatDateWIB(paymentDone?.paidAt || "-")}
                </Text>
                <View style={styles.modalBuyerRow}>
                  <View style={styles.modalBuyerRowInner}>
                    <Text style={styles.modalBuyerLabel}>Pembeli</Text>
                    <View style={styles.modalBuyerRight}>
                      <Image
                        source={require("../../assets/logo-bni.png")}
                        style={styles.modalBuyerLogo}
                        resizeMode="cover"
                      />
                      <View style={styles.rowAlignCenter}>
                        <Text style={styles.modalBuyerAccount}>0600604502</Text>
                        <TouchableOpacity
                          onPress={() => handleCopy("0600604502")}>
                          <Image
                            source={require("../../assets/copy.png")}
                            style={styles.copyIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}

            <View style={styles.modalFooterRow}>
              <Text style={styles.modalFooterTextGray}>
                Terdapat kendala?
              </Text>
              <Text style={styles.modalFooterTextBlue}>
                Silahkan Hubungi Kami
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      {showPopup && (
        <BuyerKonfirmasi
          onClose={() => setShowPopup(false)}
          onBtn2={handleConfirmReceived}
          onBtn1={() => setShowPopup(false)}
          title="Pastikan barang sudah sesuai sebelum melakukan konfirmasi!"
          btn1="Kembali"
          btn2="Konfirmasi"
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  // Copy Field
  copyFieldContainer: {
    padding: 12,
    marginHorizontal: 12,
    backgroundColor: "#EDFBFA",
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  copyFieldTitle: {
    fontSize: 15,
    marginBottom: 12,
    fontWeight: "500",
  },
  copyFieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  copyFieldValue: {
    fontSize: 17,
    fontWeight: "500",
  },
  copyIcon: {
    marginLeft: 4,
    width: 17,
    height: 16,
  },
  copyFieldCourier: {
    fontSize: 12,
    fontWeight: "400",
    color: "#616161",
  },
  // Admin Message
  adminMsgRow: {
    flexDirection: "row",
    marginHorizontal: 12,
    padding: 12,
    alignItems: "center",
    gap: 12,
  },
  adminMsgIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  adminMsgText: {
    fontSize: 14,
    flex: 1,
  },
  // Warning Message
  warningMsgContainer: {
    marginVertical: 8,
  },
  warningMsgRow: {
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
  warningMsgText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
    flex: 1,
  },
  // Status
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
  // Section
  sectionContainer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 4,
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
  // Footer
  footerContainer: {
    padding: 12,
    borderTopWidth: 2,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: "#E5E7EB",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  footerCol: {
    flexDirection: "column",
    gap: 16,
    width: "100%",
    alignItems: "center",
  },
  footerRow: {
    flexDirection: "row",
    width: "75%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  footerTextGray: {
    fontSize: 14,
    color: "#616161",
  },
  footerTextBlue: {
    fontSize: 14,
    color: "#3267E3",
  },
  footerShippedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    width: "100%",
    justifyContent: "space-between",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "55%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginLeft: 8,
  },
  modalIdRow: {
    backgroundColor: "#D1FAE5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
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
    marginLeft: 20,
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
  },
  modalDeadlineTimeWrap: {
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
  },
  modalSimulateBtn: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalSimulateBtnText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#222",
  },
  modalSuccessTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 4,
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
    fontWeight: "500",
    marginLeft: 24,
  },
  modalBuyerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalBuyerLogo: {
    width: 80,
    height: 48,
    marginRight: 8,
  },
  modalBuyerAccount: {
    fontSize: 18,
    fontWeight: "500",
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
  },
  modalFooterTextBlue: {
    color: "#3B82F6",
    fontWeight: "500",
  },
});
