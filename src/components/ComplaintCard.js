import React from "react";
import { View, Text, Image, Pressable, Alert } from "react-native";
import { Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";

// Hanya menampilkan label status, bukan message
const getStatusStyle = (status) => {
  switch (status) {
    case "approved_by_admin":
      return {
        dotColor: "bg-green-500",
        textColor: "text-green-600",
        label: "Komplain Disetujui",
      };
    case "under_investigation":
      return {
        dotColor: "bg-orange-400",
        textColor: "text-orange-500",
        label: "Investigasi Pengiriman",
      };
    case "rejected_by_seller":
      return {
        dotColor: "bg-red-400",
        textColor: "text-red-500",
        label: "Komplain Ditolak",
      };
    case "canceled":
      return {
        dotColor: "bg-gray-400",
        textColor: "text-gray-500",
        label: "Komplain Dibatalkan",
      };
    case "completed":
      return {
        dotColor: "bg-green-500",
        textColor: "text-green-600",
        label: "Transaksi Selesai",
      };
    default:
      return {
        dotColor: "bg-gray-300",
        textColor: "text-gray-400",
        label: "Status Tidak Diketahui",
      };
  }
};

const getIssueLabel = (type) => {
  switch (type) {
    case "lost":
      return "Barang belum sampai atau kesasar";
    case "damaged":
      return "Barang rusak";
    case "not_as_described":
      return "Barang tidak sesuai deskripsi";
    default:
      return "Masalah lainnya";
  }
};

const getIssueIcon = (type) => {
  switch (type) {
    case "lost":
      return require("../assets/belumsampai.png");
    case "damaged":
      return require("../assets/barangrusak.png");
    case "not_as_described":
      return require("../assets/tidaksesuai.png");
    default:
      return require("../assets/komplain.png");
  }
};

export default function ComplaintCard({
  productName,
  price,
  sellerEmail,
  resi,
  ekspedisi,
  complaint,
}) {
  const handleCopy = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Disalin", `${text} berhasil disalin.`);
  };

  const statusInfo = getStatusStyle(complaint?.status);
  const issueLabel = getIssueLabel(complaint?.type);
  const issueIcon = getIssueIcon(complaint?.type);

  const rows = [
    { label: "Nama Produk", value: productName },
    { label: "Seller", value: sellerEmail },
    { label: "No Resi", value: resi, copyable: true },
    { label: "Ekspedisi", value: ekspedisi },
    {
      label: "Harga",
      value: `Rp. ${Number(price || 0).toLocaleString("id-ID")},00`,
    },
  ];

  return (
    <View className='bg-white rounded-xl border border-gray-200 my-2 w-full overflow-hidden'>
      {/* Info Utama */}
      <View className='p-4'>
        {rows.map((row, index) => (
          <View
            key={index}
            className='flex-row justify-between items-start mb-2'
          >
            <Text className='text-sm font-medium text-gray-600 w-[40%]'>
              {row.label}
            </Text>
            <View className='flex-row items-center w-[60%] justify-end'>
              <Text
                className='text-sm text-right font-semibold text-gray-800'
                numberOfLines={1}
              >
                {row.value || "-"}
              </Text>
              {row.copyable && !!row.value && (
                <Pressable
                  onPress={() => handleCopy(row.value)}
                  className='p-1 ml-2'
                >
                  <Copy size={16} color='#999' />
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Footer Status dan Tipe Masalah */}
      <View className='bg-gray-100 border-t border-gray-200 p-3'>
        <View className='flex-row items-center mb-2'>
          <Image
            source={issueIcon}
            className='w-5 h-5 mr-2'
            resizeMode='contain'
          />
          <Text className='text-sm text-black font-semibold'>{issueLabel}</Text>
        </View>
        <View className='flex-row items-center'>
          <View
            className={`w-2 h-2 rounded-full mr-2 ${statusInfo.dotColor}`}
          />
          <Text className={`text-sm font-medium ${statusInfo.textColor}`}>
            {statusInfo.label}
          </Text>
        </View>
      </View>
    </View>
  );
}
