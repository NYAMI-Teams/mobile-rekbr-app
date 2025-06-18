import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation } from "expo-router";
import { InputField } from "../../components/dispute/InputField";
import AttachmentFilled from "../../components/AttachmentFilled";
import PrimaryButton from "../../components/PrimaryButton";

export default function konfirmasiSellerForm() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="relative items-center justify-center mb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute left-0"
        >
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-center">
          Permintaan Konfirmasi Seller
        </Text>
      </View>

      {/* Isi Form */}
      <ScrollView className="flex-1 px-4">
        <InputField
          title="Alasan Permintaan Konfirmasi"
          placeholder="Contohnya, barang telah diterima Buyer sejak 2 hari kemarin"
        />

        <AttachmentFilled
          title="Unggah Bukti "
          caption="Berikan bukti berupa screenshot cek resi"
          cardColor="#FFF"
          captionColor="#9E9E9E"
          iconName="camera"
          boxColor="#49DBC8"
          alertText="Pastikan keterbacaan foto dan hindari bayangan"
          alertColor="#C2C2C2"
          alertIconName="alert-circle"
          alertIconColor="#C2C2C2"
          onPress
          iconsColor
        />
      </ScrollView>

      {/* Button di bawah */}
      <View className="px-4 py-3 border-t border-gray-200">
        <PrimaryButton title="Kirim" onPress={() => navigation.navigate("")} />
        <View className="flex-row items-center justify-center mt-3">
          <Text className="text-sm text-gray-500">Terdapat kendala?</Text>
          <TouchableOpacity>
            <Text className="text-sm text-blue-600 ml-1 font-bold">
              Silahkan Hubungi Kami
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
