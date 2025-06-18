import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClipboardPaste } from "lucide-react-native";
import CopyField from "../../components/dispute/copyField";

export default function RusakBarangCard() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4 pt-6">
        {/* Tab Header */}
        <View className="flex-row justify-between items-center border-b border-gray-200 mb-4">
          <View className="flex-1 items-center pb-2 border-b-2 border-[#00B7A0]">
            <Text className="text-sm font-semibold text-[#1D1D1D]">Pembelian</Text>
          </View>
          <View className="flex-1 items-center pb-2">
            <Text className="text-sm text-gray-400">Penjualan</Text>
          </View>
        </View>

        {/* Card */}
        <View className="bg-white border border-[#E5E7EB] rounded-2xl px-4 pt-4 pb-3 shadow-sm">
          {/* Nama Barang & Harga */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-semibold text-[#1D1D1D]">iPhone 13 Pro Max</Text>
            <Text className="text-sm font-semibold text-[#1D1D1D]">Rp. 8.080.000,00</Text>
          </View>

          {/* Seller */}
          <View className="flex-row justify-between mb-1">
            <Text className="text-xs text-[#6B7280]">Seller</Text>
            <Text className="text-xs text-[#1D1D1D]">irgi168@gmail.com</Text>
          </View>

          {/* No Resi */}
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xs text-[#6B7280]">No Resi</Text>
            <View className="flex-row items-center space-x-1">
              <ClipboardPaste size={14} color="#9CA3AF" />
              <Text className="text-xs text-[#2563EB] font-medium">JX3474124013</Text>
            </View>
          </View>

          {/* Ekspedisi */}
          <View className="flex-row justify-between mb-4">
            <Text className="text-xs text-[#6B7280]">Ekspedisi</Text>
            <Text className="text-xs text-[#1D1D1D]">J&T Express Indonesia</Text>
          </View>

          {/* Status Box */}
          <View className="bg-[#FFF7ED] border border-[#FEEBC8] rounded-xl px-3 py-3">
            {/* Label Masalah */}
            <View className="flex-row items-center space-x-2 mb-2">
              <Image
                source={require("../../assets/barangrusak.png")}
                className="w-4 h-4"
                resizeMode="contain"
              />
              <Text className="text-xs font-medium text-[#D97706]">Barang rusak</Text>
            </View>

            {/* Status & Waktu */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center space-x-1">
                <View className="w-2 h-2 rounded-full bg-[#FBBF24]" />
                <Text className="text-xs text-[#D97706]">Menunggu Seller Setuju</Text>
              </View>

              <View className="bg-[#FEF3C7] px-3 py-1.5 rounded-md">
                <Text className="text-[11px] text-[#92400E] font-semibold">
                  18 Juni 2025, 10 : 00 WIB
                </Text>
              </View>
            </View>

            
          </View>
        </View>

        <CopyField
              title="Keterangan"
              content="ssajjahsjhajshassa"/>
      </ScrollView>
    </SafeAreaView>
  );
}
