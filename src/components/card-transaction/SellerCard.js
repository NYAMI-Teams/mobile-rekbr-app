import React from "react";
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
import clsx from "clsx";
import CountdownTimer from "../Countdown";
import { useRouter } from "expo-router";
import { showToast } from "../../utils";

const SellerCard = ({ data }) => {
  const status = data?.status || "";
  const router = useRouter();

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

  const renderRows = () => {
    switch (status) {
      case "pending_payment":
      case "waiting_shipment":
        return [
          { label: "Nama Produk", value: data?.itemName || "-" },
          { label: "Pembeli", value: data?.buyerEmail || "-" },
          {
            label: "Nomor VA",
            value: data?.virtualAccount || "-",
            copyable: true,
          },
        ];
      case "shipped":
      case "completed":
        return [
          { label: "Nama Produk", value: data?.itemName || "-" },
          { label: "Pembeli", value: data?.buyerEmail || "-" },
          {
            label: "Nomor Resi",
            value: data?.shipment.trackingNumber || "-",
            copyable: true,
          },
          { label: "Ekspedisi", value: data?.shipment.courier || "-" },
        ];
      case "canceled":
        return [
          { label: "Nama Produk", value: data?.itemName || "-" },
          { label: "Pembeli", value: data?.buyerEmail || "-" },
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
          { label: "Pembeli", value: data?.buyerEmail || "-" },
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

  const renderBottomSection = () => {
    if (status === "pending_payment") {
      return (
        <View style={styles.badgeYellow}>
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
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: `/InputResi`, params: { id: data?.id } })
          }
          style={styles.buttonBlack}
        >
          <Text style={styles.buttonTextWhite}>Bukti Pengiriman</Text>
        </TouchableOpacity>
      );
    }

    if (status === "shipped") {
      const fundStatus = data?.fundReleaseRequest?.status;
      if (fundStatus === "pending") {
        return (
          <View style={styles.badgeYellow}>
            <Text style={styles.badgeText}>Permintaan Ditinjau</Text>
          </View>
        );
      } else if (fundStatus === "approved") {
        return (
          <View style={styles.badgeYellow}>
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
            onPress={() =>
              router.push({
                pathname: `/FundReleaseRequest`,
                params: { id: data?.id },
              })
            }
            style={styles.buttonBlack}
          >
            <Text style={styles.buttonTextWhite}>Minta Konfirmasi</Text>
          </TouchableOpacity>
        );
      }
    }

    if (status === "completed" || status === "canceled") {
      return (
        <View className="px-3 py-1 rounded-full">
          <Text className="font-poppins-semibold text-xs text-gray-800">
            {formatDateWIB(data?.buyerConfirmedAt || "-")}
          </Text>
        </View>
      );
    }

    if (status === "canceled") {
      return (
        <View className="px-3 py-1 rounded-full">
          <Text className="font-poppins-semibold text-xs text-gray-800">
            {formatDateWIB(
              data?.shipmentDeadline == null
                ? data?.paymentDeadline
                : data?.shipmentDeadline || "-"
            )}
          </Text>
        </View>
      );
    }

    if (status === "refunded") {
      return (
        <View className="px-3 py-1 rounded-full">
          <Text className="font-poppins-semibold text-xs text-gray-800">
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
          pathname: `/DetailTransaksi/Seller`,
          params: { id: data?.id || "" },
        })
      }
    >
      <View style={styles.cardWrapper}>
        <View style={styles.cardContent}>
          {renderRows().map((row, index) => (
            <View key={index} style={styles.rowItem}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <View style={styles.rowValueWrapper}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.rowValue,
                    row.value === "waiting_seller"
                      ? { color: "#9ca3af" }
                      : { color: "#111827" },
                  ]}
                >
                  {row.value === "waiting_seller"
                    ? "Resi belum diberikan seller"
                    : row.value || "-"}
                </Text>
                {row.copyable && !!row.value && row.value !== "waiting_seller" && (
                  <Pressable onPress={() => handleCopy(row.value)}>
                    <Image
                      source={require("../../assets/copy.png")}
                      style={{ width: 16, height: 16, opacity: 0.7, marginLeft: 4 }}
                    />
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Bottom Section */}
        <View style={styles.cardFooter}>
          {status === "shipped" && (
            <View style={{ flexDirection: "row", gap: 4, marginBottom: 12 }}>
              <Image
                source={require("../../assets/admin1.png")}
                style={{ width: 16, height: 16, marginTop: 2 }}
              />
              <Text style={styles.adminMessage}>
                {data?.fundReleaseRequest?.status === null
                  ? "Cek no resi berkala, kalau pembeli nggak konfirmasi, minta konfirmasi pembeli lewat admin."
                  : data?.fundReleaseRequest?.status === "pending"
                  ? "Tunggu approval kami, ya! Kalau bukti kamu oke, permintaan konfirmasi bakal langsung dikirim ke pembeli!"
                  : data?.fundReleaseRequest?.status === "rejected"
                  ? "Permintaan konfirmasi ke pembeli ditolak. Pastikan data atau bukti yang kamu kirim sudah lengkap dan sesuai."
                  : data?.fundReleaseRequest?.status === "approved"
                  ? "Konfirmasi udah dikirim ke pembeli! Sekarang tinggal tunggu respon mereka dalam 1 x 24 jam."
                  : "-"}
              </Text>
            </View>
          )}

          <View style={styles.cardStatusRow}>
            <View style={styles.statusIndicatorWrapper}>
              <View
                style={[
                  styles.statusDot,
                  status === "completed"
                    ? "bg-green-400"
                    : status === "canceled" || status === "refunded"
                    ? "bg-red-400"
                    : "bg-yellow-400"
                )}
              />
              <Text style={styles.statusText}>{renderStatus()}</Text>
            </View>
            {renderBottomSection()}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginVertical: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
    width: "100%",
  },
  cardContent: {
    padding: 12,
  },
  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  rowLabel: {
    fontSize: 14,
    width: "40%",
    fontFamily: "Poppins-Regular",
  },
  rowValueWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "60%",
  },
  rowValue: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    textAlign: "right",
    flex: 1,
  },
  cardFooter: {
    backgroundColor: "#f3f4f6",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 12,
  },
  adminMessage: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#1f2937",
    flex: 1,
  },
  cardStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusIndicatorWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#1f2937",
  },
  badgeYellow: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#1f2937",
  },
  buttonBlack: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  buttonTextWhite: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },
});

export default SellerCard;
