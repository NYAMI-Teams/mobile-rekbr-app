import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation } from "expo-router";

export default function Dispute() {
  const navigation = useNavigation();
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
        <View className="relative items-center justify-center mb-4">
          {/* Tombol Back di kiri */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-0"
          >
            <ChevronLeft size={24} color="black" />
          </TouchableOpacity>

          {/* Judul di tengah */}
          <Text className="text-xl font-semibold text-center">
            Permintaan Komplain Buyer
          </Text>
        </View>

        {/* Informasi Admin */}
        <View className="flex-row items-start bg-orange-50 p-4 rounded-xl mb-4 border border-orange-100 space-x-3">
          <Image
            source={require("../../assets/admin1.png")}
            className="w-10 h-10 rounded-full"
            resizeMode="contain"
          />
          <Text className="text-sm text-gray-700 flex-1">
            Harap tinjau kembali dan pastikan seluruh data kamu sebelum
            melanjutkan, ya!
          </Text>
        </View>

        {/* Info Email */}
        <Text className="text-lg font-medium text-black mb-3">
          Diskusi dengan{" "}
          <Text className="font-semibold">irgi168@gmail.com</Text>
        </Text>
        <Text className="text-base text-gray-500 mb-4">
          Cari resolusi yang lebih cepat, diskusikan dulu kendalamu dengan
          penjual
        </Text>

        {/* Button Email */}
        <View className="mb-6">
          <PrimaryButton
            title="Diskusi via email dengan penjual"
            className="mb-6"
          />
        </View>

        {/* Opsi Komplain */}
        <Text className="text-sm font-semibold mb-3">
          Pilih masalah untuk ajukan komplain
        </Text>
        <View className="flex-row flex-wrap justify-between gap-3">
          {complaints.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[48%] h-40 bg-white border border-gray-300 rounded-xl px-4 py-10 items-center justify-between"
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
      </ScrollView>
      {/* Footer */}
      <View className="absolute bottom-16 left-0 right-0 items-center">
        <Text className="text-xs text-gray-400">
          Terdapat kendala?{" "}
          <Text className="text-blue-500 font-medium">
            Silahkan Hubungi Kami
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
