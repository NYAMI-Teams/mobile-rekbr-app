import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { InputField } from "../../../components/dispute/InputField";
import AttachmentFilled from "../../../components/AttachmentFilled";
import PrimaryButton from "../../../components/PrimaryButton";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { postBuyerReturn } from "@/utils/api/complaint";
import { showToast } from "@/utils";

export default function konfirmasiSellerForm() {
  const router = useRouter();
  const { complaintId } = useLocalSearchParams();

  const [reason, setReason] = useState("");
  const [photoUri, setPhotoUri] = useState(null);
  const [image, setImage] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const handleUpload = async () => {
    if (hasCameraPermission === false) {
      Alert.alert(
        "Izin Kamera Diperlukan",
        "Aplikasi memerlukan akses kamera untuk mengambil foto. Mohon berikan izin di pengaturan perangkat Anda."
      );
      return;
    }

    if (hasCameraPermission === null) {
      Alert.alert(
        "Meminta Izin",
        "Aplikasi sedang meminta izin kamera. Mohon tunggu sebentar."
      );
      return;
    }

    Alert.alert(
      "Pilih Sumber Gambar",
      "Ambil foto baru atau pilih dari galeri?",
      [
        {
          text: "Kamera",
          onPress: async () => {
            await pickImage("camera");
          },
        },
        {
          text: "Galeri",
          onPress: async () => {
            await pickImage("gallery");
          },
        },
        { text: "Batal", style: "cancel" },
      ]
    );
  };

  const pickImage = async (source) => {
    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        quality: 1,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      let imageAsset = result.assets[0];
      let quality = 0.7;
      let compressed = await ImageManipulator.manipulateAsync(
        imageAsset.uri,
        [],
        { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Loop kompresi hingga < 1MB atau quality terlalu kecil
      let blob, size;
      do {
        const response = await fetch(compressed.uri);
        blob = await response.blob();
        size = blob.size;
        if (size > 1024 * 1024) {
          quality -= 0.2;
          if (quality < 0.2) break;
          compressed = await ImageManipulator.manipulateAsync(
            imageAsset.uri,
            [],
            { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
          );
        }
      } while (size > 1024 * 1024 && quality >= 0.2);

      setImage({
        ...imageAsset,
        uri: compressed.uri,
      });
      setPhotoUri(true);
    } else {
      setImage(null);
      setPhotoUri(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await postBuyerReturn(complaintId, reason, image);
      router.replace("../../(tabs)/complaint");
    } catch (error) {
      showToast("Gagal", error?.message, "error");
    } finally {
      setShowPopup(false);
    }
    // console.log("ini pengembalian", complaintId, courierId, resi, photoUri);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-base font-semibold">
          Permintaan Konfirmasi Seller
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Isi Form */}
      <ScrollView className="flex-1 px-4">
        <InputField
          title="Alasan Permintaan Konfirmasi"
          placeholder="Contohnya, barang telah diterima Buyer sejak 2 hari kemarin"
          value={reason}
          onChangeText={setReason}
        />

        <AttachmentFilled
          title="Unggah Bukti"
          caption={
            photoUri
              ? image?.uri?.split("/").pop()
              : "Berikan bukti berupa screenshot cek resi"
          }
          cardColor={photoUri ? "#E8F5E9" : "#FFF"}
          captionColor={photoUri ? "#4CAF50" : "#9E9E9E"}
          iconName={photoUri ? "checkmark" : "camera"}
          boxColor={photoUri ? "#4CAF50" : "#49DBC8"}
          alertText="Pastikan keterbacaan foto dan hindari bayangan"
          alertColor="#C2C2C2"
          alertIconName="alert-circle"
          alertIconColor="#C2C2C2"
          onPress={handleUpload}
          iconsColor="#FFF"
        />

        {photoUri && (
          <View className="mt-4">
            <Text className="text-sm font-medium mb-2">
              Preview Foto Bukti:
            </Text>
            <Image
              source={{ uri: image?.uri }}
              style={{ width: "100%", height: 200, borderRadius: 12 }}
            />
          </View>
        )}
      </ScrollView>

      {/* Button di bawah */}
      <View className="px-4 py-3 border-t border-gray-200">
        <PrimaryButton title="Kirim" onPress={handleSubmit} />
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
