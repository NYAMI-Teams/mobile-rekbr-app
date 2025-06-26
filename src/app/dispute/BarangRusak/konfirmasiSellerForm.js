import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { InputField } from "../../../components/dispute/InputField";
import AttachmentFilled from "../../../components/AttachmentFilled";
import PrimaryButton from "../../../components/PrimaryButton";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { postBuyerReturnConfirm } from "@/utils/api/complaint";
import { showToast } from "@/utils";

export default function KonfirmasiSellerForm() {
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
          onPress: async () => await pickImage("camera"),
        },
        {
          text: "Galeri",
          onPress: async () => await pickImage("gallery"),
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

    if (!result.canceled && result.assets?.length > 0) {
      let imageAsset = result.assets[0];
      let quality = 0.7;
      let compressed = await ImageManipulator.manipulateAsync(
        imageAsset.uri,
        [],
        { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
      );

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

      setImage({ ...imageAsset, uri: compressed.uri });
      setPhotoUri(true);
    } else {
      setImage(null);
      setPhotoUri(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await postBuyerReturnConfirm(complaintId, reason, image);
      router.replace("../../(tabs)/complaint");
      showToast("Sukses", "Permintaan konfirmasi berhasil dikirim", "success");
    } catch (error) {
      showToast("Gagal", error?.message, "error");
      console.log("ini error konfirmasi form", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Permintaan Konfirmasi Seller</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Preview Foto Bukti:</Text>
            <Image source={{ uri: image?.uri }} style={styles.previewImage} />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Kirim" onPress={handleSubmit} />
        <View style={styles.supportContainer}>
          <Text style={styles.supportText}>Terdapat kendala?</Text>
          <TouchableOpacity>
            <Text style={styles.supportLink}>Silahkan Hubungi Kami</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  headerSpacer: {
    width: 24,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  previewContainer: {
    marginTop: 16,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  supportContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  supportText: {
    fontSize: 14,
    color: "#6B7280",
  },
  supportLink: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "700",
    marginLeft: 4,
  },
});
