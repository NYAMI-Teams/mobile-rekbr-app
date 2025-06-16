import { postFundRelease } from "../../utils/api/seller";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";
import AttachmentFilled from "../../components/AttachmentFilled";
import InputField from "../../components/InputField";
import BuyerKonfirmasi from "../../components/BuyerKonfirmasi";
import { useLocalSearchParams } from "expo-router";

export default function FundReleaseRequestScreen() {
  const router = useRouter();
  const [isUploaded, setIsUploaded] = useState(false);
  const [image, setImage] = useState(null); // State untuk menyimpan URI gambar
  const [hasCameraPermission, setHasCameraPermission] = useState(null); // State untuk izin kamera

  const [alasanText, setAlasanText] = useState("");
  const [showPopup, setShowPopup] = useState(false);

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
      // Izin masih dalam proses permintaan
      Alert.alert(
        "Meminta Izin",
        "Aplikasi sedang meminta izin kamera. Mohon tunggu sebentar."
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Memungkinkan pengguna untuk mengedit/memotong gambar
      quality: 1, // Kualitas gambar (0-1)
    });

    console.log(result); // Untuk debugging, lihat struktur hasil

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setIsUploaded(true);
    } else {
      // Jika pengguna membatalkan atau tidak ada gambar yang dipilih
      setImage(null);
      setIsUploaded(false);
    }
  };

  const handleBtnPress = () => {
    setShowPopup(true);
  };

  const handleUploadFundRelease = () => {
    try {
      postFundRelease(id, image, alasanText);
      setShowPopup(false);
    } catch (error) {
      console.log(error);
    }
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-between">
      {/* Header */}
      <View className="flex-row justify-between items-center w-full px-4 pt-4">
        {" "}
        {/* Tambahkan padding horizontal */}
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-[16px] font-semibold text-black">
          {" "}
          {/* Hapus items-center, karena sudah di flex-row justify-between */}
          Permintaan Konfirmasi
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 w-full px-4 mt-5">
        {" "}
        {/* Wrap content dengan ScrollView */}
        <View className="mt-4">
          <InputField
            title="Alasan Permintaan Konfirmasi"
            placeholder="Contohnya, barang telah diterima pembeli sejak 2 hari kemarin"
            value={alasanText}
            onChangeText={setAlasanText}
          />
        </View>
        <TouchableOpacity onPress={handleUpload} className="mt-4">
          <AttachmentFilled
            title="Unggah Bukti"
            caption={
              isUploaded
                ? image.split("/").pop()
                : "Berikan bukti berupa screenshot cek resi1"
            }
            captionColor={isUploaded ? "#08B20F" : "#9E9E9E"}
            iconName={"camera"} // Pastikan AttachmentFilled Anda bisa menerima string 'camera' untuk ikon
            boxColor={isUploaded ? "#F9F9F9" : "#49DBC8"}
            iconsColor={isUploaded ? "#C2C2C2" : "#FFFFFF"}
            cardColor={"#FFF"}
            alertText="Pastikan keterbacaan foto dan hindari bayangan"
            alertColor={isUploaded ? "#08B20F" : "#C2C2C2"}
            alertIconName={isUploaded ? "checkmark-circle" : "alert-circle"} // Pastikan ini juga sesuai dengan AttachmentFilled
            alertIconColor={isUploaded ? "#08B20F" : "#C2C2C2"}
            onPress={handleUpload}
          />
        </TouchableOpacity>
        <View className="mt-4 mb-4">
          {" "}
          {/* Tambahkan margin vertikal */}
          {/* Image Preview */}
          {!image ? null : (
            <Image source={{ uri: image }} className="w-full h-64 rounded-lg" />
          )}
        </View>
      </ScrollView>
      {/* Button */}
      <View className="w-full px-4 py-4">
        {" "}
        {/* Tambahkan padding horizontal dan vertikal */}
        <PrimaryButton title="Kirim" onPress={handleBtnPress} />
      </View>

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
    </SafeAreaView>
  );
}
