import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { TextInput } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import PrimaryButton from "../../components/PrimaryButton";

export default function DetailMasalahScreen() {
  const [description, setDescription] = useState("");
  const navigation = useNavigation();
  const placeholderText =
    "Layar barang pecah di bagian tengah dan ada goresan dalam di sisi kiri.";

  const [media, setMedia] = useState([]);
  const [showTipsModal, setShowTipsModal] = useState(false);

  const handlePickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Izin dibutuhkan", "Akses galeri diperlukan.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled) {
      const picked = result.assets[0];
      const isVideo = picked.type === "video";
      const currentVideos = media.filter((m) => m.type === "video").length;
      const currentTotal = media.length;

      if (isVideo && currentVideos >= 1) {
        Alert.alert("Maksimal 1 video diperbolehkan");
        return;
      }

      if (currentTotal >= 5) {
        Alert.alert("Maksimal upload 5 file media");
        return;
      }

      setMedia([...media, picked]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="relative items-center justify-center mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-0"
          >
            <ChevronLeft size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-center">
            Detail Masalah
          </Text>
        </View>

        {/* Status Komplain */}
        <View className="bg-gray-100 rounded-xl p-3 mb-3">
          <Text className="font-semibold text-base text-black">
            Komplain Dibatalkan
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Kamu membatalkan komplain ini.
          </Text>
        </View>

        {/* Masalah yang dipilih */}
        <Text className="text-bse font-semibold mb-2">
          Masalah yang dipilih
        </Text>
        <View className="flex-row items-start bg-white p-4 rounded-xl mb-4 border border-gray-100 space-x-3">
          <Image
            source={require("../../assets/belumsampai.png")}
            className="w-5 h-5 rounded-full"
            resizeMode="contain"
          />
          <Text className="text-base font-semibold text-gray-700 flex-1">
            Barang belum sampai atau kesasar
          </Text>
        </View>
        <Text className="text-base font-medium text-black">
          Barang yang belum diterima
        </Text>
        {/* Barang */}
        <View className="bg-[#EAF7F9] rounded-xl p-4 mb-3">
          <Text className="font-semibold text-black text-lg mb-2">
            iPhone 13 Pro Max
          </Text>
          <Text className="text-sm text-black mb-3">REK - 8080123456789</Text>

          <View className="mb-1 flex-row justify-between mb-2">
            <Text className="text-base text-black">Seller</Text>
            <Text className="text-base text-black">irgi85@gmail.com</Text>
          </View>

          <View className="mb-1 flex-row justify-between mb-2">
            <Text className="text-base text-black">No Resi</Text>
            <Text className="text-base text-blue-500">JX347124013</Text>
          </View>

          <View className="mb-1 flex-row justify-between mb-2">
            <Text className="text-base text-black">Ekspedisi</Text>
            <Text className="text-sm text-black">J&T Express Indonesia</Text>
          </View>

          <View className="mb-1">
            <Text className="text-base text-black mb-1">Nominal Rekber</Text>
            <Text className="text-lg font-semibold text-black">
              Rp. 8.080.000,00
            </Text>
          </View>
        </View>

        {/* Alasan kerusakan */}
        <View className="mb-3">
          <Text className="text-base text-black font-semibold mb-1">
            Alasan kerusakan (Min. 25 karakter)
          </Text>
          <View className="bg-white rounded-xl shadow-md p-2">
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={placeholderText}
              placeholderTextColor="#9ca3af" // text-gray-400
              multiline
              numberOfLines={4}
              className="text-lg text-gray-800 p-2"
            />
          </View>
        </View>

        {/* Bukti Foto & Video */}
        <View className="mb-3">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg text-black font-bold">
              Bukti foto & video
            </Text>
            <TouchableOpacity onPress={() => setShowTipsModal(true)}>
              <Text className="text-sm text-blue-500">Lihat Tips</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-base text-black mb-2">
            Unggah maksimal <Text className="font-bold">5 foto</Text> atau{" "}
            <Text className="font-bold">4 foto + 1 video</Text>. Format: .jpg,
            .png, .mp4, .mov. Maks. 10 MB (foto), 60 MB (video).
          </Text>

          <View className="flex-row space-x-2">
            {media.map((item, index) => (
              <Image
                key={index}
                source={{ uri: item.uri }}
                className="w-16 h-16 rounded-md"
              />
            ))}
            {media.length < 5 && (
              <TouchableOpacity
                onPress={handlePickMedia}
                className="w-16 h-16 border border-gray-300 rounded-md items-center justify-center bg-white"
              >
                <Text className="text-black text-2xl">+</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Modal Tips Upload */}
          <Modal visible={showTipsModal} transparent animationType="slide">
            <View className="flex-1 justify-end">
              <TouchableWithoutFeedback onPress={() => setShowTipsModal(false)}>
                <View className="flex-1 bg-black/30" />
              </TouchableWithoutFeedback>
              <View
                className="bg-white rounded-t-3xl pt-4 px-6 pb-6"
                style={{ maxHeight: "85%" }}
              >
                <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />
                <Text className="text-lg font-semibold mb-4">
                  Tips Upload Bukti
                </Text>
                {[
                  "Tampilkan kondisi barang sebelum kemasan dibuka",
                  "Tampilkan kondisi barang sebelum kemasan dibuka",
                  "Jika kerusakan disebabkan oleh kurir, tampilkan penyebab kerusakan jika memungkinkan",
                  "Khusus video, tampilkan kerusakan yang menunjukkan tidak berfungsinya barang.",
                ].map((tip, index) => (
                  <View key={index} className="flex-row items-start mb-3">
                    <Image
                      source={require("../../assets/icon-check-green.png")}
                      className="w-5 h-5 mt-0.5 mr-2"
                      resizeMode="contain"
                    />
                    <Text className="text-sm text-black leading-snug flex-1">
                      {tip}
                    </Text>
                  </View>
                ))}

                <View
                  style={{ backgroundColor: "#F3F4F6" }}
                  className="p-4 rounded-xl mt-4"
                >
                  <Text className="text-sm font-semibold text-black mb-2">
                    Format yang didukung:
                  </Text>
                  <Text className="text-sm text-black leading-tight mb-1">
                    • Maksimal <Text className="font-semibold">5 foto</Text>{" "}
                    atau{" "}
                    <Text className="font-semibold">4 foto dan 1 video</Text>
                  </Text>
                  <Text className="text-sm text-black leading-tight mb-1">
                    • Format yang diterima adalah{" "}
                    <Text className="font-semibold">
                      .jpg, .png, .mp4, .mov
                    </Text>
                  </Text>
                  <Text className="text-sm text-black leading-tight mb-1">
                    • Ukuran maksimal foto adalah{" "}
                    <Text className="font-semibold">10 MB per file</Text>
                  </Text>
                  <Text className="text-sm text-black leading-tight mb-1">
                    • Ukuran maksimal video adalah{" "}
                    <Text className="font-semibold">50 MB per file</Text>
                  </Text>
                  <Text className="text-sm text-black leading-tight mb-1">
                    • Durasi video maksimal adalah{" "}
                    <Text className="font-semibold">5 menit</Text>
                  </Text>
                  <Text className="text-sm text-black leading-tight">
                    • Jika video terlalu besar, gunakan video compressor atau{" "}
                    <Text className="font-semibold">
                      upload video ke YouTube
                    </Text>{" "}
                    dan sertakan link di field alasan
                  </Text>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        {/* Solusi */}
        <View className="mb-3">
          <Text className="text-lg text-black font-bold mb-1">
            Solusi apa yang kamu inginkan
          </Text>
          <Text className="text-lg text-gray-800">
            Solusi bisa berubah, sesuai kesepakatan antara Seller, Buyer dan Tim
            Rekber by BNI
          </Text>
          <View className="bg-gray-100 border border-gray-200 mt-2 p-3 rounded-lg">
            <Text className="text-lg text-black font-medium">
              Pengembalian barang dan dana
            </Text>
            <Text className="text-base text-black mt-1">
              Dana bakal balik ke buyer setelah seller okeh bukti terkait barang
              bermasalah
            </Text>
          </View>
        </View>

        {/* Button */}
        <PrimaryButton
          title="Ajukan Komplain Kembali"
          onPress={() => console.log("Ajukan Komplain")}
          style={{ marginBottom: 24 }} // ganti className dengan style inline
        />
      </ScrollView>
    </SafeAreaView>
  );
}
