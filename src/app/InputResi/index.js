import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Modal,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import AttachmentFilled from "@/components/AttachmentFilled";
import DropDownField from "@/components/DropDownField";
import { useRef, useState, useEffect } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter } from "expo-router";
import { ChevronLeftCircle } from "lucide-react-native";
import BuyerKonfirmasi from "@/components/BuyerKonfirmasi";
import { postResi, getListCourier } from "@/utils/api/seller";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { showToast } from "@/utils";
import NavBackHeader from "@/components/NavBackHeader";

export default function InputResi() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isUploaded, setIsUploaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [resiNumberError, setResiNumberError] = useState("");
  const [resiNumber, setResiNumber] = useState("");
  const [courier, setCourier] = useState("");
  const [courierId, setCourierId] = useState("");
  const [courierList, setCourierList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

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
      if (res) setCourierList(res.data);
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
      Alert.alert("Izin Kamera Diperlukan", "Aplikasi memerlukan akses kamera.");
      return;
    }

    if (hasCameraPermission === null) {
      Alert.alert("Meminta Izin", "Mohon tunggu sebentar.");
      return;
    }

    Alert.alert("Pilih Sumber Gambar", "Ambil foto baru atau pilih dari galeri?", [
      { text: "Kamera", onPress: () => pickImage("camera") },
      { text: "Galeri", onPress: () => pickImage("gallery") },
      { text: "Batal", style: "cancel" },
    ]);
  };

  const pickImage = async (source) => {
    let result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({ mediaTypes: "Images", allowsEditing: true, quality: 1 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: "Images", allowsEditing: true, quality: 1 });

    if (!result.canceled && result.assets?.length > 0) {
      let imageAsset = result.assets[0];
      let quality = 0.7;
      let compressed = await ImageManipulator.manipulateAsync(imageAsset.uri, [], {
        compress: quality,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      let blob, size;
      do {
        const response = await fetch(compressed.uri);
        blob = await response.blob();
        size = blob.size;
        if (size > 1024 * 1024) {
          quality -= 0.2;
          if (quality < 0.2) break;
          compressed = await ImageManipulator.manipulateAsync(imageAsset.uri, [], {
            compress: quality,
            format: ImageManipulator.SaveFormat.JPEG,
          });
        }
      } while (size > 1024 * 1024 && quality >= 0.2);

      setImage({ ...imageAsset, uri: compressed.uri });
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
      showToast("Gagal", `Gagal mengunggah resi, ${error?.message}`, "error");
    } finally {
      setShowPopup(false);
    }
  };

  const handleResiNumberChange = (text) => {
    const cleanedText = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    setResiNumber(cleanedText);
    setResiNumberError(
      cleanedText.length === 0
        ? "Nomor resi tidak boleh kosong."
        : cleanedText.length < 5
        ? "Nomor resi terlalu pendek."
        : ""
    );
  };

  return (
    <View style={styles.container}>
      <NavBackHeader title={"Form Pengiriman"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            <InputField
              title="Masukkan Nomor Resi"
              placeholder="Masukkan Nomor Resi dengan benar"
              value={resiNumber}
              onChangeText={handleResiNumberChange}
              errorText={resiNumberError}
              keyboardType="default"
              autoCapitalize="characters"
            />
            <TouchableOpacity onPress={handleModal} style={styles.mt4}>
              <DropDownField
                title="Pilih Ekspedisi"
                placeholder="Pilih Ekspedisi pengiriman kamu"
                value={courier}
                onChangeText={setCourier}
                editable={false}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUpload} style={styles.mt4}>
              <AttachmentFilled
                title="Unggah Bukti"
                caption={isUploaded ? image?.uri?.split("/").pop() : "Berikan bukti berupa screenshot cek resi"}
                captionColor={isUploaded ? "#08B20F" : "#9E9E9E"}
                iconName="camera"
                boxColor={isUploaded ? "#F9F9F9" : "#49DBC8"}
                iconsColor={isUploaded ? "#C2C2C2" : "#FFFFFF"}
                cardColor="#FFF"
                alertText="Pastikan keterbacaan foto dan hindari bayangan"
                alertColor={isUploaded ? "#08B20F" : "#C2C2C2"}
                alertIconName={isUploaded ? "checkmark-circle" : "alert-circle"}
                alertIconColor={isUploaded ? "#08B20F" : "#C2C2C2"}
              />
            </TouchableOpacity>
            {image && (
              <View style={styles.imagePreview}>
                <Image source={{ uri: image.uri }} style={styles.uploadedImage} />
              </View>
            )}
          </View>
          <View style={styles.buttonWrapper}>
            <PrimaryButton title="Kirim" onPress={handleBtnPress} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
        <TouchableOpacity style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeModal} style={styles.modalHeaderBtn}>
                <ChevronLeftCircle size={24} color="#00C2C2" />
                <Text style={styles.modalHeaderText}>Pilih Ekspedisi</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <View style={styles.modalCourierList}>
                {courierList.map((courier, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.courierItem}
                    onPress={() => handleSelectCourier(courier)}
                  >
                    <Text style={styles.courierText}>{courier.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  inner: {
    flex: 1,
    marginTop: 16,
  },
  mt4: {
    marginTop: 16,
  },
  imagePreview: {
    marginTop: 16,
    marginBottom: 16,
  },
  uploadedImage: {
    width: "100%",
    height: 256,
    borderRadius: 12,
  },
  buttonWrapper: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: "55%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 16,
  },
  modalHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalHeaderText: {
    fontSize: 18,
    marginLeft: 8,
    color: "#1F2937",
  },
  modalScroll: {
    marginVertical: 8,
  },
  modalCourierList: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderColor: "#D1D5DB",
    borderWidth: 1,
  },
  courierItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(107,114,128,0.3)",
    marginBottom: 12,
  },
  courierText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
