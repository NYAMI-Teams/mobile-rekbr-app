import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { postSellerResponse } from "../../utils/api/complaint";
import PrimaryButton from "../PrimaryButton";
import { showToast } from "../../utils";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function ModalSeller({ showPopup, setShowPopup, id, isTolak }) {
  const router = useRouter();
  const [tanggapanSeller, setTanggapanSeller] = useState("");
  const [isInputValid, setIsInputValid] = useState(false);
  const [arrPhoto, setArrPhoto] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
    console.log("ini isTolak", isTolak);
  }, []);

  const handleUpload = async () => {
    if (arrPhoto.length >= 5) {
      Alert.alert(
        "Limit Mencapai",
        "Anda sudah mencapai batas maksimal 5 foto",
        [{ text: "OK" }]
      );
      return;
    }

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

      setArrPhoto((prev) => [...prev, compressed]);
      setIsUploaded(true);
    } else {
      setArrPhoto([]);
      setIsUploaded(false);
    }
  };

  const handleSellerResponse = async () => {
    try {
      if (!isInputValid) {
        showToast("Error", "Tanggapan harus minimal 25 karakter", "error");
        return;
      }

      let status = isTolak ? "rejected" : "return_requested";
      const res = await postSellerResponse(
        id,
        status,
        tanggapanSeller,
        arrPhoto
      );

      showToast("Berhasil", res?.message, "success");
      router.replace("/(tabs)/complaint");
      setShowPopup(false);
    } catch (err) {
      console.log("Gagal cok ===> ", err.message);
      showToast("Gagal", err?.message, "error");
      // Re-enable the button on error
      // Tidak perlu document.querySelector di React Native
    }
  };

  return (
    <Modal
      visible={showPopup}
      transparent
      animationType="slide"
      onRequestClose={() => setShowPopup(false)}
      style={{ margin: 0, padding: 0 }}>
      <Pressable
        style={styles.overlay}
        onPress={() => setShowPopup(false)}>
        <Pressable
          style={styles.modalContainer}
          onPress={() => {}}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>
              Form Konfirmasi Seller
            </Text>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag">
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}>
                <View style={styles.inputSection}>
                  <Text style={styles.label}>
                    Tanggapan Seller (Min. 25 karakter)
                  </Text>
                  <TextInput
                    placeholder="Berikan tanggapan kamu"
                    placeholderTextColor="#888"
                    style={styles.textInput}
                    multiline
                    numberOfLines={4}
                    value={tanggapanSeller}
                    onChangeText={(text) => {
                      setTanggapanSeller(text);
                      setIsInputValid(text.length >= 25 && text.length <= 200);
                    }}
                  />
                  {tanggapanSeller.length > 0 && (
                    <Text style={styles.counterText}>
                      {tanggapanSeller.length}/200 karakter
                    </Text>
                  )}
                  {!isInputValid && tanggapanSeller.length > 0 && (
                    <Text style={styles.errorText}>
                      {tanggapanSeller.length < 25
                        ? "Minimal 25 karakter"
                        : "Maksimal 200 karakter"}
                    </Text>
                  )}
                </View>
                <View style={styles.inputSection}>
                  <Text style={styles.label}>
                    Bukti foto & video (opsional)
                  </Text>
                  <Text style={styles.infoText}>
                    Unggah maksimal
                    <Text style={styles.boldText}> 5 foto</Text> atau
                    <Text style={styles.boldText}> 4 foto + 1 video</Text>
                    . Format: .jpg, .png, .mp4, .mov. Maks. 10 MB (foto), 60 MB
                    (video).
                  </Text>
                  <View style={styles.photoRow}>
                    <TouchableOpacity onPress={handleUpload} style={styles.addPhotoBtn}>
                      <Image
                        source={require("../../assets/addImg.png")}
                        style={styles.photoThumb}
                      />
                    </TouchableOpacity>
                    {arrPhoto.length > 0 && (
                      <View style={styles.photoRow}>
                        {arrPhoto.map((photo, index) => (
                          <View key={index} style={styles.photoWrapper}>
                            <Image
                              source={{ uri: photo.uri }}
                              style={styles.photoThumb}
                            />
                            <TouchableOpacity
                              onPress={() => {
                                const newPhotos = [...arrPhoto];
                                newPhotos.splice(index, 1);
                                setArrPhoto(newPhotos);
                              }}
                              style={styles.removeBtn}>
                              <Feather name="x" size={16} color="white" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                  {arrPhoto.length > 0 && (
                    <Text style={styles.counterText}>
                      {arrPhoto.length}/5 foto
                    </Text>
                  )}
                </View>
                <View style={styles.buttonSection}>
                  <PrimaryButton
                    title="Kirim"
                    onPress={handleSellerResponse}
                    disabled={!isInputValid}
                  />
                </View>
              </KeyboardAvoidingView>
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 8,
    height: "55%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  contentContainer: {
    flexDirection: "column",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputSection: {
    marginBottom: 16,
  },
  label: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 8,
    height: 112,
    color: "#000",
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  counterText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
  },
  infoText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "300",
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "500",
  },
  photoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  addPhotoBtn: {
    marginBottom: 8,
    marginRight: 8,
  },
  photoWrapper: {
    position: "relative",
    marginRight: 8,
    marginBottom: 8,
  },
  photoThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  removeBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ef4444",
    borderRadius: 999,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSection: {
    marginBottom: 16,
  },
});
