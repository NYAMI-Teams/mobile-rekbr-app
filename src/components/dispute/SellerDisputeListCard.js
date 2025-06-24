import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { ClipboardPaste } from "lucide-react-native";
import PrimaryButton from "../PrimaryButton";

const statusconfig = {
  waitingSellerApproval: {
    color: "#FBBF24",
    text: "Persetujuan Seller",
    note: "Jika kamu nggak respon sampai ",
    notebold: "  18 Juni 2025, 10:00 WIB,",
    noteafter: " pengajuan ini bakal otomatis disetujui, ya!",
    status: "18 Juni 2025, 10 : 00 WIB",
    statusColor: "#FEF2D3",
  },
  returnRequested: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali!",
    notebold: " Proses maksimal 1 x 24 jam.",
    button: "Bukti Pengembalian",
  },
  Completed: {
    color: "#06B217",
    text: "Tranasksi Selesai",
    note: "",
    status: "22 Juni 2025, 10 : 00 WIB",
  },
  sellerRejected: {
    color: "#CB3A31",
    text: "Menunggu Persetujuan Admin",
    note: "",
    button: null,
  },
  returnInTransit: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Cek no resi berkala, kalau seller nggak konfirmasi, minta konfirmasi seller lewat admin. ",
    button: "Minta Konfirmasi",
  },
  awaitingAdminApproval: {
    color: "#CB3A31",
    text: "Menunggu Persetujuan Admin",
    note: "",
    button: null,
  },
  rejectedByAdmin: {
    color: "#06B217",
    text: "Transaksi Selesai",
    note: "Setelah ditinjau, bukti belum cukup kuat. Dana diteruskan ke seller dan transaksi dianggap selesai.",
    button: null,
  },
  awaitingSellerConfirmation: {},
  approvedBySeller: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali!",
    notebold: " Proses maksimal 1 x 24 jam.",
    button: "Bukti Pengembalian",
  },
  approvedByAdmin: {
    color: "#FBBF24",
    text: "Pengembalian Barang",
    note: "Halo! Barang sudah sampai. Konfirmasi dalam 24 jam, kalau nggak, dana otomatis dikembalikan ke buyer. ",
    status: "23 : 59 : 59",
    statusColor: "#FEF2D3",
  },

  // Buyer Hilang Barang
  underInvestigation: {
    color: "#FBBF24",
    text: "Investigasi Pengiriman",
    note: "",
    button: null,
  },

  // Seller
  awaitingSellerConfirmation: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Buyer akan mengembalikan barang dalam 24 jam, konfirmasi bila barang telah sampai dan diterima.",
    button: "Barang Diterima",
  },
};

const SellerDisputeListCard = ({
  namaBarang,
  harga,
  buyer,
  noResi,
  expedisi,
  typeDespute,
  status,
  time,
  onPress = () => {},
  onPressButton = () => {},
}) => {
  const config = statusconfig[status];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View className="bg-white border border-[#E5E7EB] rounded-2xl px-4 pt-4 pb-3 shadow-sm mb-8">
        {/* Nama Barang & Harga */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-semibold text-[#1D1D1D]">
            {namaBarang}
          </Text>
          <Text className="text-sm font-semibold text-[#1D1D1D]">{harga}</Text>
        </View>

        {/* Seller */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-xs text-[#6B7280]">Buyer</Text>
          <Text className="text-xs text-[#1D1D1D]">{buyer}</Text>
        </View>

        {/* No Resi */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs text-[#6B7280]">No Resi</Text>
          <View className="flex-row items-center space-x-1">
            <ClipboardPaste size={14} color="#9CA3AF" />
            <Text className="text-xs text-[#2563EB] font-medium">{noResi}</Text>
          </View>
        </View>

        {/* Ekspedisi */}
        <View className="flex-row justify-between mb-4">
          <Text className="text-xs text-[#6B7280]">Ekspedisi</Text>
          <Text className="text-xs text-[#1D1D1D]">{expedisi}</Text>
        </View>

        {/* Status Card */}
        <View className="bg-[#F5F5F5] rounded-xl px-3 py-3">
          <View className="flex-row items-center space-x-2 mb-2">
            <Image
              source={require("../../assets/barangrusak.png")}
              className="w-4 h-4"
              resizeMode="contain"
            />
            <Text className="text-xs font-medium text-black ml-3">
              {typeDespute}
            </Text>
          </View>

          {/* Catatan Admin */}
          {config?.note !== "" && (
            <View className="flex-row my-2 items-start">
              <Image
                source={require("../../assets/admin1.png")}
                className="w-5 h-5 mr-4"
              />
              <Text className="flex-1 text-xs text-gray-700 leading-5">
                <Text className="text-xs text-black">{config?.note}</Text>
                <Text className="text-xs text-black font-semibold">{time}</Text>
                <Text className="text-xs text-black">{config?.noteafter}</Text>
              </Text>
            </View>
          )}

          <View className="flex-row justify-between items-center mt-2">
            <View className="flex-row items-center space-x-1">
              <View
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: config?.color }}
              />
              <Text className="text-xs text-black ml-2">{config?.text}</Text>
            </View>

            {/* Optional Button */}
            {config?.button && (
              <PrimaryButton
                title={config?.button}
                height={30}
                width="50%"
                fontSize={10}
                btnColor={config?.btnColor}
                textColor={config?.btnTextColor}
                onPress={onPressButton}
              />
            )}

            {config?.status && (
              <View
                className="flex-row items-center space-x-1 p-2 rounded-lg"
                style={{ backgroundColor: config?.statusColor }}>
                <Text className="text-xs text-black ml-2">{time}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SellerDisputeListCard;
