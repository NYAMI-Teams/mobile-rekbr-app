import { postFundRelease } from "../../utils/api/seller";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Alert,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import PrimaryButton from "../../components/PrimaryButton";
import AttachmentFilled from "../../components/AttachmentFilled";
import InputField from "../../components/InputField";
import BuyerKonfirmasi from "../../components/BuyerKonfirmasi";
import { useLocalSearchParams } from "expo-router";
import { showToast } from "../../utils";
import NavBackHeader from "@/components/NavBackHeader";

export default function FundReleaseRequestScreen() {
  const router = useRouter();
  const [isUploaded, setIsUploaded] = useState(false);
  const [image, setImage] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [alasanText, setAlasanText] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useLocalSearchParams();

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
      setIsUploaded(true);
    } else {
      setImage(null);
      setIsUploaded(false);
    }
  };

  const handleBtnPress = () => {
    setShowPopup(true);
  };

  const handleUploadFundRelease = async () => {
    setIsLoading(true);
    try {
      await postFundRelease(id, image, alasanText);
      setShowPopup(false);
      showToast(
        "Berhasil",
        "Permintaan konfirmasi pengiriman berhasil dibuat",
        "success"
      );
      router.replace("/");
    } catch (error) {
      showToast(
        "Gagal",
        `Gagal membuat permintaan konfirmasi pengiriman, ${error?.message}`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <NavBackHeader title={"Permintaan Konfirmasi"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.innerContainer}>
            <InputField
              title="Alasan Permintaan Konfirmasi"
              placeholder="Contohnya, barang telah diterima pembeli sejak 2 hari kemarin"
              value={alasanText}
              onChangeText={setAlasanText}
            />

            <View style={styles.uploadButton}>
              <AttachmentFilled
                title="Unggah Bukti"
                caption={
                  isUploaded
                    ? image?.uri?.split("/").pop()
                    : "Berikan bukti berupa screenshot cek resi"
                }
                captionColor={isUploaded ? "#08B20F" : "#9E9E9E"}
                iconName={"camera"}
                boxColor={isUploaded ? "#F9F9F9" : "#49DBC8"}
                iconsColor={isUploaded ? "#C2C2C2" : "#FFFFFF"}
                cardColor={"#FFF"}
                alertText="Pastikan keterbacaan foto dan hindari bayangan"
                alertColor={isUploaded ? "#08B20F" : "#C2C2C2"}
                alertIconName={isUploaded ? "checkmark-circle" : "alert-circle"}
                alertIconColor={isUploaded ? "#08B20F" : "#C2C2C2"}
                onPress={handleUpload}
              />
            </View>

            {image && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: image?.uri }}
                  style={styles.uploadedImage}
                />
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Kirim"
              onPress={handleBtnPress}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {showPopup && (
        <BuyerKonfirmasi
          onClose={() => setShowPopup(false)}
          onBtn2={handleUploadFundRelease}
          onBtn1={() => setShowPopup(false)}
          title="Pastikan semua data di form sudah benar dan lengkap sebelum kamu kirim. Cek lagi, ya!"
          btn1="Kembali"
          btn2="Konfirmasi"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  innerContainer: {
    flex: 1,
  },
  uploadButton: {
    marginTop: 16,
  },
  imageContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  uploadedImage: {
    width: "100%",
    height: 256,
    borderRadius: 12,
  },
  buttonContainer: {
    width: "100%",
    paddingVertical: 16,
    marginBottom: 32,
  },
});
