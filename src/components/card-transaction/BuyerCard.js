import React, { useState, useEffect } from "react";
import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";
import moment from "moment";
import clsx from "clsx";
import CountdownTimer from "../Countdown";
import { useRouter } from "expo-router";
import { buyerConfirmReceivedTransaction } from "../../utils/api/buyer";
import BuyerKonfirmasi from "../BuyerKonfirmasi";
import { showToast } from "../../utils";

const BuyerCard = ({ data }) => {
  const [showPopup, setShowPopup] = useState(false);
  const formatDateWIB = (dateTime) => {
    if (!dateTime) return "Invalid date";
    return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
  };
  const router = useRouter();
  const status = data?.status;

  const handleConfirmReceived = async () => {
    try {
      const res = await buyerConfirmReceivedTransaction(data?.id);
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
    if (status === "pending_payment") {
      return (
        <View className="bg-yellow-100 px-3 py-1 rounded-full">
          <Text className="font-poppins-semibold text-xs text-gray-800">
            {/* Replace this with dynamic countdown logic */}
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
        <View className="bg-yellow-100 px-3 py-1 rounded-full">
          <Text className="font-poppins-semibold text-xs text-gray-800">
            {formatDateWIB(data?.shipmentDeadline || "-")}
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
          <View className="bg-yellow-100 px-3 py-1 rounded-full">
            <Text className="font-poppins-semibold text-xs text-gray-800">
              {/* Replace this with actual countdown (e.g., 24 jam mundur dari requestAt) */}
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
            className="bg-black px-3 py-1 rounded-full">
            <Text className="font-poppins-semibold text-xs text-white">
              Barang Diterima
            </Text>
          </TouchableOpacity>
        );
      }
    }

    if (status === "completed") {
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
          pathname: "/DetailTransaksi/Buyer",
          params: {
            id: data?.id,
          },
        })
      }>
      <View className="border border-gray-200 rounded-lg overflow-hidden my-2 w-full bg-white">
        {/* Detail Section */}
        <View className="p-3">
          {renderRows().map((row, index) => (
            <View
              key={index}
              className="flex-row justify-between items-start mb-2">
              <Text className="font-poppins text-sm w-[40%]">{row.label}</Text>
              <View className="flex-row items-center w-[60%] justify-end">
                <Text
                  className={clsx(
                    "font-poppins-semibold text-sm text-right",
                    row.value === "waiting_seller"
                      ? "text-gray-400"
                      : "text-gray-900"
                  )}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {row.value == "waiting_seller"
                    ? "Resi belum diberikan seller"
                    : row.value || "-"}
                </Text>
                {row.copyable &&
                  !!row.value &&
                  row.value !== "waiting_seller" && (
                    <Pressable
                      onPress={() => handleCopy(row.value)}
                      className="p-1 rounded-full">
                      <Image
                        source={require("../../assets/copy.png")}
                        className="w-4 h-4 opacity-70"
                      />
                    </Pressable>
                  )}
              </View>
            </View>
          ))}
        </View>

        {/* Status Message Section */}
        <View className="bg-gray-100 border-t border-gray-200 p-3">
          {/* Admin Message */}
          {status === "shipped" &&
            data?.fundReleaseRequest?.status === "approved" && (
              <View className="flex-row gap-1 mb-3">
                <Image
                  source={require("../../assets/admin1.png")}
                  className="w-4 h-4 mt-1"
                />
                <Text className="font-poppins text-xs text-gray-800 flex-1">
                  Halo! Barang udah sampai. Cek dan konfirmasi, biar dana
                  langsung ke penjual via BNI!
                </Text>
              </View>
            )}

          {/* Status & Button/Countdown */}
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View
                className={clsx(
                  "w-2 h-2 rounded-full mr-2",
                  status === "completed"
                    ? "bg-green-400"
                    : status === "canceled" || status === "refunded"
                    ? "bg-red-400"
                    : "bg-yellow-400"
                )}
              />
              <Text className="font-poppins text-xs text-gray-800">
                {renderStatus()}
              </Text>
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

export default BuyerCard;
