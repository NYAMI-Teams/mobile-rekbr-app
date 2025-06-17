import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dispute() {
  const complaints = [
    {
      label: "Barang belum sampai atau kesasar",
      icon: require("../../assets/belumsampai.png"),
    },
    {
      label: "Barang rusak",
      icon: require("../../assets/barangrusak.png"),
    },
    {
      label: "Tidak sesuai deskripsi",
      icon: require("../../assets/tidaksesuai.png"),
    },
    {
      label: "Masalah atau komplain lainnya",
      icon: require("../../assets/komplain.png"),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4 pt-4">
        {/* Header */}
        <Text className="text-lg font-semibold mb-2">
          Permintaan Komplain Buyer
        </Text>
        <View style={styles.information}>
          <Image
            source={require("../../assets/admin1.png")}
            style={styles.logo_admin}
          />
          <Text style={styles.informationText}>
            Harap tinjau kembali dan pastikan seluruh data kamu sebelum
            melanjutkan, ya!
          </Text>
        </View>

        {/* Info Email */}
        <Text className="text-sm font-medium text-black mb-1">
          Diskusi dengan{" "}
          <Text className="font-semibold">irgi168@gmail.com</Text>
        </Text>
        <Text className="text-sm text-gray-500 mb-4">
          Cari resolusi yang lebih cepat, diskusikan dulu kendalamu dengan
          penjual
        </Text>

        {/* Button */}
        <TouchableOpacity className="bg-black py-3 rounded-xl mb-6">
          <Text className="text-white text-center font-semibold">
            Diskusi via email dengan penjual
          </Text>
        </TouchableOpacity>

        {/* Komplain Options */}
        <Text className="text-sm font-semibold mb-3">
          Pilih masalah untuk ajukan komplain
        </Text>
        <View className="flex-row flex-wrap justify-between gap-3">
          {complaints.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[48%] bg-[#FFF7ED] border border-gray-200 rounded-xl p-4 items-center space-y-2"
            >
              <Image
                source={item.icon}
                className="w-10 h-10"
                resizeMode="contain"
              />
              <Text className="text-center text-xs font-medium text-black">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Help Link */}
        <View className="mt-10 items-center mb-6">
          <Text className="text-xs text-gray-400">
            Terdapat kendala?{" "}
            <Text className="text-blue-500 font-medium">
              Silahkan Hubungi Kami
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
