import {
  View,
  Text,
  Modal,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
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
import BuyerKonfirmasi from "../components/BuyerKonfirmasi";
import { postResi } from "../utils/api/seller";
import { getListCourier } from "../utils/api/seller";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { showToast } from "../utils";

const mockCouriers = [
  {
    id: "23be3cdf-0591-4eec-83a4-e88d860317c6",
    name: "J&T Express Indonesia",
  },
  {
    id: "e3273d93-8f13-428d-b2ef-c820af3c34f6",
    name: "JNE REG",
  },
  {
    id: "b93f73e0-df31-48e1-8a20-e42f0bee3ead",
    name: "SiCepat Ekspres",
  },
  {
    id: "c2600a13-c68a-49d7-bd90-7e8af3a7993a",
    name: "AnterAja",
  },
  {
    id: "de7ba283-eb43-4575-a823-319dd0005805",
    name: "Ninja Xpress",
  },
  {
    id: "df156819-7eaf-49df-b678-2678360317d3",
    name: "POS Indonesia",
  },
];

export default function InputResi({ id }) {
  const router = useRouter();
  const [isUploaded, setIsUploaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null); // State untuk menyimpan URI gambar
  const [hasCameraPermission, setHasCameraPermission] = useState(null); // State untuk izin kamera
  const [resiNumberError, setResiNumberError] = useState("");
  const [resiNumber, setResiNumber] = useState("");
  const [courier, setCourier] = useState("");
  const [courierId, setCourierId] = useState("");
  const [courierList, setCourierList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Permintaan izin kamera saat komponen di-mount
  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
    getCourier();
  }, []);

  const getCourier = async () => {
    try {
      const res = await getListCourier();
      if (res) {
        setCourierList(res.data);
      }
    } catch (error) {
      showToast("Gagal", "Gagal mengambil data ekspedisi", "error");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setCourier("");
  };

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
      setIsUploaded(true);
    } else {
      setImage(null);
      setIsUploaded(false);
    }
  };

  const handleModal = () => {
    setModalVisible(true);
  };

  const handleSelectCourier = (selectedCourier) => {
    setCourier(selectedCourier.name);
    setCourierId(selectedCourier.id);
    setModalVisible(false);
  };

  const handleBtnPress = () => {
    setShowPopup(true);
  };

  const handleUploadResi = async () => {
    try {
      await postResi(id, courierId, resiNumber, image);
      router.replace("/");
    } catch (error) {
      showToast("Gagal", "Gagal mengunggah resi", "error");
    } finally {
      setShowPopup(false);
    }
  };

  const handleResiNumberChange = (text) => {
    const cleanedText = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    setResiNumber(cleanedText);
    if (cleanedText.length === 0) {
      setResiNumberError("Nomor resi tidak boleh kosong.");
    } else if (cleanedText.length < 5) {
      setResiNumberError("Nomor resi terlalu pendek.");
    } else {
      setResiNumberError("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-between">
      {/* Header */}
      <View className="flex-row justify-between items-center w-full px-4 pt-4">
        {/* Tambahkan padding horizontal */}
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-[16px] font-semibold text-black">
          {/* Hapus items-center, karena sudah di flex-row justify-between */}
          Form Pengiriman
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}>
        <ScrollView
          className="flex-1 w-full px-4 mt-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          hideKeyboardOnScroll={true}
          keyboardDismissMode="on-drag">
          {/* Wrap content dengan ScrollView */}
          <View className="mt-4">
            <InputField
              title="Masukkan Nomor Resi"
              placeholder="Masukkan Nomor Resi dengan benar"
              value={resiNumber}
              onChangeText={handleResiNumberChange}
              errorText={resiNumberError}
              keyboardType="default"
              autoCapitalize="characters"
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
          <TouchableOpacity onPress={handleUpload} className="mt-4">
            <AttachmentFilled
              title="Unggah Bukti"
              caption={
                isUploaded
                  ? image?.uri?.split("/").pop()
                  : "Berikan bukti berupa screenshot cek resi"
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
            {/* Tambahkan margin vertikal */}
            {/* Image Preview */}
            {!image ? null : (
              <Image
                source={{ uri: image.uri }}
                className="w-full h-64 rounded-lg"
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Button */}
      <View className="w-full px-4 py-4">
        {/* Tambahkan padding horizontal dan vertikal */}
        <PrimaryButton
          title="Kirim"
          onPress={handleBtnPress}
          // disabled={courier == "" || resiNumber == "" || image == null}
        />
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
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          onPress={closeModal}>
          <View className="bg-white rounded-t-lg h-[55%]">
            {/* Close Button */}
            <View className="flex-row justify-start p-4 ">
              <TouchableOpacity
                onPress={closeModal}
                className="flex-row items-center mb-6">
                {/* Tambahkan onPress untuk menutup modal */}
                <ChevronLeftCircle size={24} color="#00C2C2" />
                <Text className="text-lg font-normal text-gray-800 ml-2">
                  Pilih Ekspedisi
                </Text>
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <View className="justify-between flex-1">
              {/* Ubah h-[70%] menjadi flex-1 agar menyesuaikan sisa ruang */}
              <ScrollView className="my-2" showsVerticalScrollIndicator={false}>
                {/* Sembunyikan indikator scroll */}
                <View className="flex-col gap-4 bg-slate-100/50 m-5 p-5 rounded-lg border border-gray-300">
                  {courierList.map(
                    (
                      courier,
                      index
                    ) => (
                      <TouchableOpacity
                        key={index}
                        className="p-5 border-b-2 border-gray-300/50 mb-4"
                        onPress={() => handleSelectCourier(courier)}>
                        <Text className="text-[15px] font-semibold">
                          {courier.name}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
