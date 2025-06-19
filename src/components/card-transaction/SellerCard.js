import React from "react";
import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
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
      default:
        return [];
    }
  };

  const renderBottomSection = () => {
    if (status === "pending_payment") {
      return (
        <View className="bg-yellow-100 px-3 py-1 rounded-full">
          <Text className="font-poppins-semibold text-xs text-gray-800">
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
            router.push({
              pathname: `/InputResi`,
              params: { id: data?.id },
            })
          }
          className="bg-black px-3 py-1 rounded-full">
          <Text className="font-poppins-semibold text-xs text-white">
            Bukti Pengiriman
          </Text>
        </TouchableOpacity>
      );
    }

    if (status === "shipped") {
      if (data?.fundReleaseRequest?.status === "pending") {
        return (
          <View className="bg-yellow-100 px-3 py-1 rounded-full">
            <Text className="font-poppins-semibold text-xs text-gray-800">
              Permintaan Ditinjau
            </Text>
          </View>
        );
      } else if (data?.fundReleaseRequest?.status === "approved") {
        return (
          <View className="bg-yellow-100 px-3 py-1 rounded-full">
            <Text className="font-poppins-semibold text-xs text-gray-800">
              <CountdownTimer
                deadline={data?.buyerConfirmDeadline || "-"}
                fromTime={data?.currentTimestamp || "-"}
              />
            </Text>
          </View>
        );
      } else if (
        data?.fundReleaseRequest?.status === "rejected" ||
        data?.fundReleaseRequest?.status === null
      ) {
        return (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: `/FundReleaseRequest`,
                params: { id: data?.id },
              })
            }
            className="bg-black px-3 py-1 rounded-full">
            <Text className="font-poppins-semibold text-xs text-white">
              Minta Konfirmasi
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

    return null;
  };

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: `/DetailTransaksi/Seller`,
          params: { id: data?.id || "" },
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
          {status === "shipped" && (
            <View className="flex-row gap-1 mb-3">
              <Image
                source={require("../../assets/admin1.png")}
                className="w-4 h-4 mt-1"
              />
              <Text className="font-poppins text-xs text-gray-800 flex-1">
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

          {/* Status & Button/Countdown */}
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View
                className={clsx(
                  "w-2 h-2 rounded-full mr-2",
                  status === "completed"
                    ? "bg-green-400"
                    : status === "canceled"
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
    </TouchableOpacity>
  );
};

export default SellerCard;
