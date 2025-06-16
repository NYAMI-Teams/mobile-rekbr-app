import { View, Text, Modal, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "./InputField";
import AttachmentFilled from "./AttachmentFilled";
import DropDownField from "./DropDownField";
import { useRef, useState, useEffect } from "react"; // Tambahkan useEffect
import { Animated, TouchableOpacity } from "react-native";
import PrimaryButton from "./PrimaryButton";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ChevronLeftCircle } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker
import BuyerKonfirmasi from "../components/BuyerKonfirmasi";
import { postResi } from "../utils/api/seller";

export default function InputResi({ id }) {
  const router = useRouter();
  const [isUploaded, setIsUploaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null); // State untuk menyimpan URI gambar
  const [hasCameraPermission, setHasCameraPermission] = useState(null); // State untuk izin kamera

  const [resiNumber, setResiNumber] = useState("");
  const [courier, setCourier] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Permintaan izin kamera saat komponen di-mount
  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const closeModal = () => {
    setModalVisible(false);
    setCourier("");
  };

  // Fungsi untuk mengambil gambar dari kamera
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

  const handleModal = () => {
    setModalVisible(true);
  };

  const handleSelectCourier = (selectedCourier) => {
    setCourier(selectedCourier);
    setModalVisible(false);
  };

  const handleBtnPress = () => {
    setShowPopup(true);
  };

  const handleUploadResi = () => {
    // setShowPopup(true);
    try {
      postResi(id, courier, resiNumber, image);
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
          Form Pengiriman
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 w-full px-4 mt-5">
        {" "}
        {/* Wrap content dengan ScrollView */}
        <View className="mt-4">
          <InputField
            title="Masukkan Nomor Resi"
            placeholder="Masukkan Nomor Resi dengan benar"
            value={resiNumber}
            onChangeText={setResiNumber}
          />
        </View>
        <TouchableOpacity className="mt-4" onPress={handleModal}>
          <DropDownField
            title="Pilih Ekspedisi"
            placeholder="Pilih Ekspedisi pengiriman kamu"
            value={courier}
            onChangeText={setCourier}
            editable={false}
          />
        </TouchableOpacity>
        <View className="mt-4">
          <AttachmentFilled
            title="Unggah Resi Pengiriman"
            caption={
              isUploaded
                ? image.split("/").pop()
                : "Ambil foto resi kamu disini"
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
        </View>
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
        <PrimaryButton title="Simpan" onPress={handleBtnPress} />
      </View>

      {showPopup && (
        <BuyerKonfirmasi
          onClose={() => setShowPopup(false)}
          onBtn2={handleUploadResi}
          onBtn1={() => setShowPopup(false)}
          title="Kirim form bukti pengiriman? Pastikan semua data udah benar !"
          btn1="Kembali"
          btn2="Konfirmasi"
        />
      )}

      {/* Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed."); // Komentar atau hapus ini untuk UX yang lebih baik
          closeModal();
        }}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-lg h-[50%]">
            {/* Close Button */}
            <View className="flex-row justify-start p-4">
              <TouchableOpacity
                onPress={closeModal}
                className="flex-row items-center mb-6">
                {" "}
                {/* Tambahkan onPress untuk menutup modal */}
                <ChevronLeftCircle size={24} color="#00C2C2" />
                <Text className="text-lg font-normal text-gray-800 ml-2">
                  Pilih Ekspedisi
                </Text>
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <View className="p-4 justify-between flex-1">
              {" "}
              {/* Ubah h-[70%] menjadi flex-1 agar menyesuaikan sisa ruang */}
              <ScrollView className="my-2" showsVerticalScrollIndicator={false}>
                {" "}
                {/* Sembunyikan indikator scroll */}
                <View className="flex-col gap-4 bg-slate-100/50 p-5 rounded-lg border border-gray-300">
                  <TouchableOpacity
                    className="p-5 border-b-2 border-gray-300/50 mb-4"
                    onPress={() =>
                      handleSelectCourier("J&T Express Indonesia")
                    }>
                    <Text className="text-[15px] font-semibold">
                      J&T Express Indonesia
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="p-5 border-b-2 border-gray-300/50 mb-4"
                    onPress={() => handleSelectCourier("JNE Indonesia")}>
                    <Text className="text-[15px] font-semibold">
                      JNE Indonesia
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-5 border-b-2 border-gray-300/50 mb-4"
                    onPress={() => handleSelectCourier("Sicepat Express")}>
                    <Text className="text-[15px] font-semibold">
                      Sicepat Express
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-5 border-b-2 border-gray-300/50 mb-4"
                    onPress={() => handleSelectCourier("TIKI Express")}>
                    <Text className="text-[15px] font-semibold">
                      TIKI Express
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-5 border-b-2 border-gray-300/50 mb-4"
                    onPress={() => handleSelectCourier("Pos Indonesia")}>
                    <Text className="text-[15px] font-semibold">
                      Pos Indonesia
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-5 border-b-2 border-gray-300/50 mb-4"
                    onPress={() => handleSelectCourier("Grab Express")}>
                    <Text className="text-[15px] font-semibold">
                      Grab Express
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-5 border-b-2 border-gray-300/50 mb-4"
                    onPress={() => handleSelectCourier("Gojek Express")}>
                    <Text className="text-[15px] font-semibold">
                      Gojek Express
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
              <TouchableOpacity
                className="bg-[#00C2C2] rounded-lg p-4 mt-4" // Tambahkan margin-top
                onPress={() => console.log("Select courier")}>
                <Text className="text-center text-white text-[15px] font-medium">
                  Pilih dari Daftar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
