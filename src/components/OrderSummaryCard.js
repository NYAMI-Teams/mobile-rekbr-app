import React from "react";
import { View, Text, Image, Pressable, Alert } from "react-native";
import { Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";

// Helper untuk menentukan warna berdasarkan status
const getStatusStyle = (status) => {
  switch (status) {
    case "selesai":
      return {
        dotColor: "bg-green-500",
        textColor: "text-green-600",
        label: "Transaksi Selesai",
      };
    case "investigasi":
      return {
        dotColor: "bg-orange-400",
        textColor: "text-orange-500",
        label: "Investigasi Pengiriman",
      };
    case "dibatalkan":
      return {
        dotColor: "bg-gray-400",
        textColor: "text-gray-500",
        label: "Komplain Dibatalkan",
      };
    case "ditolak":
      return {
        dotColor: "bg-red-400",
        textColor: "text-red-500",
        label: "Komplain Ditolak",
      };
    default:
      return {
        dotColor: "bg-gray-300",
        textColor: "text-gray-400",
        label: "Status Tidak Diketahui",
      };
  }
};

export default function OrderSummaryCard({ status = "selesai" }) {
  const { dotColor, textColor, label } = getStatusStyle(status);
  const resi = "JX3474124013";

  const handleCopy = async () => {
    await Clipboard.setStringAsync(resi);
    Alert.alert("Disalin", "Nomor resi berhasil disalin.");
  };

  return (
    <View className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 mb-4">
      {/* Info Produk & Harga */}
      <View className="flex-row justify-between">
        <Text className="text-base font-semibold">IPhone 13 Pro Max</Text>
        <Text className="text-base font-semibold text-right text-black mb-4">
          Rp. 8.080.000,00
        </Text>
      </View>

      {/* Seller */}
      <View className="flex-row justify-between mb-4">
        <Text className="text-base text-black">Seller</Text>
        <Text className="text-base text-black">irgi168@gmail.com</Text>
      </View>

      {/* No Resi */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base text-black">No Resi</Text>
        <Pressable onPress={handleCopy} className="flex-row items-center space-x-1">
          <Copy size={16} color="#999" />
          <Text className="text-base text-blue-500 font-semibold">
            {resi}
          </Text>
        </Pressable>
      </View>

      {/* Ekspedisi */}
      <View className="flex-row justify-between mb-4">
        <Text className="text-base text-black">Ekspedisi</Text>
        <Text className="text-base text-black">J&T Express Indonesia</Text>
      </View>

      {/* Divider */}
      <View className="border-t border-gray-200 my-1 mb-4" />

      {/* Status Masalah */}
      <View className="flex-row items-center space-x-2 mb-4">
        <Image
          source={require("../assets/belumsampai.png")}
          className="w-5 h-5 rounded-full"
          resizeMode="contain"
        />
        <Text className="text-base font-semibold text-black ml-2">
          Barang belum sampai atau kesasar
        </Text>
      </View>

      {/* Status Transaksi */}
      <View className="flex-row items-center space-x-2">
        <View className={`w-2 h-2 rounded-full ${dotColor}`} />
        <Text className={`text-base ${textColor}`}>{label}</Text>
      </View>
    </View>
  );
}
