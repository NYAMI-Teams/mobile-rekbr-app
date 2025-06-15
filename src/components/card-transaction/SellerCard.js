import React from "react";
import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import moment from "moment";
import clsx from "clsx";
import CountdownTimer from "../Countdown";
import { useRouter } from "expo-router";

const SellerCard = ({ data }) => {
  const status = data.status;
  const router = useRouter();

  const handleCopy = async (text) => {
    // belum bisa jalan toastnya
    if (!text) return;
    try {
      await Clipboard.setStringAsync(text);
      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Disalin ke clipboard",
        position: "bottom",
      });
      console.log("Copied to clipboard:", text);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: "Tidak dapat menyalin",
        position: "bottom",
      });
      console.log("Failed to copy to clipboard:", error);
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
      default:
        return "";
    }
  };

  const renderRows = () => {
    switch (status) {
      case "pending_payment":
      case "waiting_shipment":
        return [
          { label: "Nama Produk", value: data.itemName },
          { label: "Pembeli", value: data.buyerEmail },
          { label: "VA Number", value: data.virtualAccount, copyable: true },
        ];
      case "shipped":
        return [
          { label: "Nama Produk", value: data.itemName },
          { label: "Pembeli", value: data.buyerEmail },
          {
            label: "Nomor Resi",
            value: data.shipment.trackingNumber,
            copyable: true,
          },
          { label: "Ekspedisi", value: data.shipment.courier },
        ];
      case "completed":
        return [
          { label: "Nama Produk", value: data.itemName },
          { label: "Pembeli", value: data.buyerEmail },
          {
            label: "Nomor Resi",
            value: data.shipment.trackingNumber,
            copyable: true,
          },
          { label: "Ekspedisi", value: data.shipment.courier },
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
              deadline={data.paymentDeadline}
              fromTime={data.createdAt}
            />
          </Text>
        </View>
      );
    }

    if (status === "waiting_shipment") {
      return (
        <TouchableOpacity
          onPress={data.onConfirmReceived}
          className="bg-black px-3 py-1 rounded-full">
          <Text className="font-poppins-semibold text-xs text-white">
            Bukti Pengiriman
          </Text>
        </TouchableOpacity>
      );
    }

    if (status === "shipped") {
      if (data.fundReleaseRequest.status === "waiting") {
        return (
          <View className="bg-yellow-100 px-3 py-1 rounded-full">
            <Text className="font-poppins-semibold text-xs text-gray-800">
              Permintaan Ditinjau
            </Text>
          </View>
        );
      } else if (data.fundReleaseRequest.status === "approved") {
        return (
          <View className="bg-yellow-100 px-3 py-1 rounded-full">
            <Text className="font-poppins-semibold text-xs text-gray-800">
              <CountdownTimer
                deadline={data.buyerConfirmDeadline}
                fromTime={data.fundReleaseRequest.resolvedAt}
              />
            </Text>
          </View>
        );
      } else if (
        data.fundReleaseRequest.status === "rejected" ||
        data.fundReleaseRequest.status === null
      ) {
        return (
          <TouchableOpacity
            onPress={data.onConfirmReceived}
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
            {formatDateWIB(data.buyerConfirmedAt)}
          </Text>
        </View>
      );
    }

    return null;
  };

  // Format waktu jadi: 11 Juni 2025, 17:00 WIB
  const formatDateWIB = (datetime) => {
    return moment(datetime).utcOffset(-7).format("DD MMMM YYYY, HH:mm [WIB]");
  };

  return (
    <TouchableOpacity onPress={() => router.push(`/DetailTransaksi/Buyer`)}>
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
                {row.copyable && !!row.value && (
                  <Pressable
                    onPress={() => handleCopy(row.value)}
                    className="p-1 rounded-full">
                    <Image
                      source={require("../../../assets/copy.png")}
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
                source={require("../../../assets/admin1.png")}
                className="w-4 h-4 mt-1"
              />
              <Text className="font-poppins text-xs text-gray-800 flex-1">
                {data.fundReleaseRequest.status === null
                  ? "Cek no resi berkala, kalau pembeli nggak konfirmasi, minta konfirmasi pembeli lewat admin."
                  : data.fundReleaseRequest.status === "waiting"
                  ? "Tunggu approval kami, ya! Kalau bukti kamu oke, permintaan konfirmasi bakal langsung dikirim ke pembeli!"
                  : data.fundReleaseRequest.status === "rejected"
                  ? "Permintaan konfirmasi ke pembeli ditolak. Pastikan data atau bukti yang kamu kirim sudah lengkap dan sesuai."
                  : data.fundReleaseRequest.status === "approved"
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
                  status === "completed" ? "bg-green-400" : "bg-yellow-400"
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
