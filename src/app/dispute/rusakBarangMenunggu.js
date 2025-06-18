import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClipboardPaste, ChevronLeft, MoreVertical, ChevronDown } from "lucide-react-native";
import CopyField from "../../components/dispute/copyField";
import TextView from "../../components/dispute/textView";

export default function DetailKomplain() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity>
            <ChevronLeft size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-base font-semibold">Detail Komplain</Text>
          <View style={{ width: 24 }} /> {/* Placeholder untuk centering */}
        </View>

        {/* Stepper */}
        <View className="flex-row justify-between items-center mb-4 px-2">
          {["Menunggu", "Kembalikan", "Refund", "Selesai"].map((label, index) => (
            <View key={index} className="items-center flex-1">
              <View className={`w-5 h-5 rounded-full border-2 ${index === 0 ? "border-[#00C5A1] bg-white" : "border-gray-300 bg-white"}`} />
              <Text className={`text-[11px] mt-2 ${index === 0 ? "text-black" : "text-gray-400"}`}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Alert Info */}
        <View className="flex-row items-start bg-[#FFF4E5] border border-[#FFD7A8] rounded-xl px-3 py-3 mb-3">
          <Image source={require("../../assets/admin1.png")} className="w-5 h-5 mt-0.5" />
          <Text className="text-xs text-black ml-2">
            Jika seller nggak respon sampai <Text className="font-semibold">18 Juni 2025, 10 : 00 WIB</Text>, pengajuanmu bakal otomatis disetujui ya!
          </Text>
        </View>

        {/* Status Komplain */}
        <View className="flex-row justify-between items-center border-b border-gray-100 pb-3 mb-3">
          <Text className="text-sm text-gray-500">Status Komplain :</Text>
          <Text className="text-sm font-semibold text-black">Menunggu Seller Setuju</Text>
        </View>

        {/* Pengajuan */}
        <Text className="text-sm font-semibold mb-1">Pengajuan komplain buyer</Text>
        <Text className="text-xs text-gray-400 mb-2">16 Juni 2025, 10 : 00 WIB</Text>
        <View className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 mb-3">
          <Text className="text-xs text-black mb-2">
            Buyer mau ngembaliin barang yang bermasalah. Dana rekber bakal dikembalikan setelah komplain disetujui, ya!
          </Text>
          <Text className="text-xs text-black">
            Layar barang pecah di bagian tengah dan ada goresan dalam di sisi kiri.
          </Text>
          <View className="mt-3">
            <Text className="text-xs text-gray-500 mb-2">Bukti foto & video</Text>
            <View className="flex-row gap-3">
              {[1, 2].map((_, index) => (
                <View key={index} className="w-16 h-16 rounded-xl overflow-hidden">
                  <Image
                    source={require("../../assets/kerusakan.png")} // Gambar dummy
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  {index === 1 && (
                    <View className="absolute inset-0 justify-center items-center bg-black/30">
                      <Image source={require("../../assets/play.png")} className="w-5 h-5" />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Data Seller & Transaksi */}
        <TextView
              title="Seller"
              content="zhirazzi@gmail.com"/>
        <TextView
              title="Nama Barang"
              content="iPhone 17 Pro"/>
        <TextView
              title="Tagihan Rekber"
              content="Rp 8.080.000,00"/>
        <CopyField
              title="No Resi"
              content="J X 3 4 7 4 1 2 4 0 1 3"/>
        <TextView
              title="Ekspedisi"
              content="J&T Express Indonesia"/>
        <CopyField
              title="ID Transaksi"
              content="1 2 3 4 5 6 7 8 9"/>
        <CopyField
              title="Virtual Account"
              content="8 0 8 0 1 2 3 4 5 6 7 8 9"/>
      </ScrollView>

      {/* Bottom Action */}
      <View className="flex-row items-center justify-between px-4 py-3 border-t border-gray-100 rounded-t-3xl bg-white">
        <TouchableOpacity className="w-11 h-11 rounded-xl border border-gray-300 items-center justify-center">
          <MoreVertical size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 ml-3 h-11 bg-black rounded-xl items-center justify-center">
          <Text className="text-white font-semibold text-sm">Kirim Seller Email</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
