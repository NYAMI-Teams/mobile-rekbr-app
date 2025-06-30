import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import moment from "moment";
import CountdownTimer from "../Countdown";
import { useRouter } from "expo-router";
import { buyerConfirmReceivedTransaction } from "../../utils/api/buyer";
import BuyerKonfirmasi from "../BuyerKonfirmasi";
import { showToast } from "../../utils";

const BuyerCard = ({ data }) => {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const status = data?.status;

  const formatDateWIB = (dateTime) => {
    if (!dateTime) return "Invalid date";
    return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
  };

  const handleConfirmReceived = async () => {
    try {
      await buyerConfirmReceivedTransaction(data?.id);
      setShowPopup(false);
    } catch (error) {
      showToast("Gagal", "Gagal mengkonfirmasi pembayaran", "error");
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

  const renderRows = () => {
    switch (status) {
      case "pending_payment":
        return [
          { label: "Nama Produk", value: data?.itemName || "-" },
          { label: "Penjual", value: data?.sellerEmail || "-" },
          {
            label: "Nomor VA",
            value: data?.virtualAccount || "-",
            copyable: true,
          },
        ];
      case "waiting_shipment":
        return [
          { label: "Nama Produk", value: data?.itemName || "-" },
          { label: "Penjual", value: data?.sellerEmail || "-" },
          { label: "Nomor Resi", value: "waiting_seller" },
        ];
      case "shipped":
      case "completed":
        return [
          { label: "Nama Produk", value: data?.itemName || "-" },
          { label: "Penjual", value: data?.sellerEmail || "-" },
          {
            label: "Nomor Resi",
            value: data?.shipment?.trackingNumber || "-",
            copyable: true,
          },
          { label: "Ekspedisi", value: data?.shipment?.courier || "-" },
        ];
      case "canceled":
        return [
          { label: "Nama Produk", value: data?.itemName || "-" },
          { label: "Penjual", value: data?.sellerEmail || "-" },
          {
            label: data?.shipmentDeadline == null ? "Nomor VA" : "Nomor Resi",
            value:
              data?.shipmentDeadline == null
                ? data?.virtualAccount
                : data?.shipment?.trackingNumber || "waiting_seller",
            copyable: true,
          },
        ];
      case "refunded":
        return [
          { label: "Nama Produk", value: data?.itemName || "-" },
          { label: "Penjual", value: data?.sellerEmail || "-" },
          {
            label: data?.shipmentDeadline == null ? "Nomor VA" : "Nomor Resi",
            value:
              data?.shipmentDeadline == null
                ? data?.virtualAccount
                : data?.shipment?.trackingNumber || "waiting_seller",
            copyable: true,
          },
        ];
      default:
        return [];
    }
  };

  const renderStatus = () => {
    switch (status) {
      case "pending_payment":
        return "Menunggu Pembayaran";
      case "waiting_shipment":
        return "Menunggu Resi";
      case "shipped":
        return "Dalam Pengiriman";
      case "completed":
        return "Barang Diterima";
      case "canceled":
        return "Dibatalkan";
      case "refunded":
        return "Dikembalikan";
      default:
        return "";
    }
  };

  const renderBottomSection = () => {
    const commonStyle = [styles.badge, { backgroundColor: "#FDE68A" }];
    if (status === "pending_payment") {
      return (
        <View style={commonStyle}>
          <Text style={styles.badgeText}>
            <CountdownTimer
              deadline={data?.paymentDeadline || "-"}
              fromTime={data?.currentTimestamp || "-"}
            />
          </Text>
        </View>
      );
    }
    if (status === "waiting_shipment") {
      return (
        <View style={commonStyle}>
          <Text style={styles.badgeText}>
            {formatDateWIB(data?.shipmentDeadline)}
          </Text>
        </View>
      );
    }
    if (status === "shipped") {
      if (
        data?.fundReleaseRequest?.requested &&
        data?.fundReleaseRequest?.status === "approved"
      ) {
        return (
          <View style={commonStyle}>
            <Text style={styles.badgeText}>
              <CountdownTimer
                deadline={data?.buyerConfirmDeadline || "-"}
                fromTime={data?.currentTimestamp || "-"}
              />
            </Text>
          </View>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={() => setShowPopup(true)}
            style={styles.confirmBtn}>
            <Text style={styles.confirmBtnText}>Barang Diterima</Text>
          </TouchableOpacity>
        );
      }
    }
    if (status === "completed") {
      return (
        <View style={styles.dateBadge}>
          <Text style={styles.badgeText}>
            {formatDateWIB(data?.buyerConfirmedAt)}
          </Text>
        </View>
      );
    }
    if (status === "canceled") {
      return (
        <View style={styles.dateBadge}>
          <Text style={styles.badgeText}>
            {formatDateWIB(
              data?.shipmentDeadline == null
                ? data?.paymentDeadline
                : data?.shipmentDeadline
            )}
          </Text>
        </View>
      );
    }

    if (status === "refunded") {
      return (
        <View style={styles.dateBadge}>
          <Text style={styles.badgeText}>
            {formatDateWIB(data?.createdAt || "-")}
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/DetailTransaksi/Buyer",
          params: { id: data?.id },
        })
      }>
      <View style={styles.card}>
        <View style={styles.content}>
          {renderRows().map((row, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <View style={styles.rowValueContainer}>
                <Text
                  style={[
                    styles.rowValue,
                    row.value === "waiting_seller" && styles.dimmed,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {row.value === "waiting_seller"
                    ? "Resi belum diberikan seller"
                    : row.value || "-"}
                </Text>
                {row.copyable &&
                  !!row.value &&
                  row.value !== "waiting_seller" && (
                    <Pressable onPress={() => handleCopy(row.value)}>
                      <Image
                        source={require("../../assets/copy.png")}
                        style={styles.copyIcon}
                      />
                    </Pressable>
                  )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          {status === "shipped" &&
            data?.fundReleaseRequest?.status === "approved" && (
              <View style={styles.adminNote}>
                <Image
                  source={require("../../assets/admin1.png")}
                  style={styles.adminIcon}
                />
                <Text style={styles.adminText}>
                  Halo! Barang udah sampai. Cek dan konfirmasi, biar dana
                  langsung ke penjual via BNI!
                </Text>
              </View>
            )}
          <View style={styles.statusRow}>
            <View style={styles.statusDotContainer}>
              <View
                style={[
                  styles.statusDot,
                  status === "completed"
                    ? { backgroundColor: "#4ade80" }
                    : status === "canceled" || status === "refunded"
                    ? { backgroundColor: "#f87171" }
                    : { backgroundColor: "#facc15" },
                ]}
              />
              <Text style={styles.statusText}>{renderStatus()}</Text>
            </View>
            {renderBottomSection()}
          </View>
        </View>
      </View>
      {showPopup && (
        <BuyerKonfirmasi
          onClose={() => setShowPopup(false)}
          onBtn2={handleConfirmReceived}
          onBtn1={() => setShowPopup(false)}
          title="Pastikan semua data di form sudah benar dan lengkap sebelum kamu kirim. Cek lagi, ya!"
          btn1="Kembali"
          btn2="Konfirmasi"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginVertical: 8,
    overflow: "hidden",
  },
  content: {
    padding: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  rowLabel: {
    fontSize: 14,
    width: "40%",
    fontFamily: "Poppins-Regular",
  },
  rowValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
    justifyContent: "flex-end",
  },
  rowValue: {
    fontSize: 14,
    textAlign: "right",
    fontFamily: "Poppins-SemiBold",
    color: "#111827",
  },
  dimmed: {
    color: "#9CA3AF",
  },
  copyIcon: {
    width: 16,
    height: 16,
    marginLeft: 6,
    opacity: 0.7,
  },
  footer: {
    backgroundColor: "#F3F4F6",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 12,
  },
  adminNote: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
  },
  adminIcon: {
    width: 16,
    height: 16,
    marginTop: 2,
  },
  adminText: {
    fontSize: 12,
    color: "#1F2937",
    fontFamily: "Poppins-Regular",
    flex: 1,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusDotContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#1F2937",
    fontFamily: "Poppins-Regular",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#1F2937",
  },
  confirmBtn: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  confirmBtnText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
  dateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
});

export default BuyerCard;
