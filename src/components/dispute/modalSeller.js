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
import * as FileSystem from "expo-file-system";
import { postSellerResponse } from "../../utils/api/complaint";
import PrimaryButton from "../PrimaryButton";
import { showToast } from "../../utils";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Video } from "expo-av";

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
    // console.log("ini isTolak", isTolak);
  }, []);

  const handleUpload = async () => {
    if (hasCameraPermission === false) {
      Alert.alert(
        "Izin Kamera Diperlukan",
        "Aplikasi memerlukan akses kamera."
      );
      return;
    }

    if (hasCameraPermission === null) {
      Alert.alert("Meminta Izin", "Mohon tunggu sebentar.");
      return;
    }

    Alert.alert(
      "Pilih Jenis Media",
      "Pilih jenis media yang ingin Anda tambahkan",
      [
        { text: "Foto", onPress: () => handlePickMedia("Images") },
        { text: "Video", onPress: () => handlePickMedia("Videos") },
        { text: "Batal", style: "cancel" },
      ]
    );
  };

  const handlePickMedia = async (type) => {
    Alert.alert(
      "Pilih Sumber Media",
      "Ambil media baru atau pilih dari galeri?",
      [
        { text: "Kamera", onPress: () => pickImage("camera", type) },
        { text: "Galeri", onPress: () => pickImage("gallery", type) },
        { text: "Batal", style: "cancel" },
      ]
    );
  };

  const pickImage = async (source, type) => {
    let result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: type,
            allowsEditing: true,
            quality: 1,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: type,
            allowsEditing: true,
            quality: 1,
          });

    if (!result.canceled && result.assets?.length > 0) {
      const selected = result.assets[0];
      const uri = selected.uri;
      const type = selected.type;
      const extension = uri.split(".").pop().toLowerCase();
      const sizeMB = (await FileSystem.getInfoAsync(uri)).size / (1024 * 1024);
      console.log("masuk sini");

      const allowedImages = ["jpg", "jpeg", "png"];
      const allowedVideos = ["mp4", "mov"];

      if (type === "image" && !allowedImages.includes(extension)) {
        alert("Format foto tidak didukung. Gunakan .jpg atau .png");
        return;
      }

      if (type === "video" && !allowedVideos.includes(extension)) {
        alert("Format video tidak didukung. Gunakan .mp4 atau .mov");
        return;
      }

      // Compress image
      if (type === "image") {
        try {
          let quality = 0.7;
          let compressed = await ImageManipulator.manipulateAsync(uri, [], {
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
              compressed = await ImageManipulator.manipulateAsync(
                compressed.uri,
                [],
                { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
              );
            }
          } while (size > 1024 * 1024 && quality >= 0.2);

          const compressedSizeMB =
            (await FileSystem.getInfoAsync(compressed.uri)).size /
            (1024 * 1024);

          if (compressedSizeMB > 1.5) {
            alert("Ukuran foto melebihi 1.5MB setelah kompresi");
            return;
          }
          selected.uri = compressed.uri;
        } catch (error) {
          console.error("Error compressing image:", error);
          alert("Gagal mengkompres foto");
          return;
        }
      }

      if (type === "video") {
        try {
          const compressedSizeMB = sizeMB;
          console.log("compressedSizeMB", compressedSizeMB);

          if (compressedSizeMB > 90) {
            alert("Ukuran video melebihi 90MB");
            return;
          }
        } catch (error) {
          console.error("Error checking video size:", error);
          alert("Gagal memeriksa ukuran video");
          return;
        }
      }

      const photoCount = arrPhoto.filter((m) => m?.type === "image").length;
      const videoCount = arrPhoto.filter((m) => m?.type === "video").length;

      if (
        (type === "image" && arrPhoto.length >= 5) ||
        (type === "video" && (videoCount >= 1 || photoCount > 4))
      ) {
        alert("Maksimal 5 file atau 4 foto + 1 video.");
        return;
      }

      setArrPhoto([...arrPhoto, selected]);
    }
  };

  const handleSellerResponse = async () => {
    try {
      setIsUploaded(true);
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
      // console.log("Gagal cok ===> ", err.message);
      showToast("Gagal", err?.message, "error");
      // Re-enable the button on error
      // Tidak perlu document.querySelector di React Native
    } finally {
      setIsUploaded(false);
    }
  };

  return (
    <Modal
      visible={showPopup}
      transparent
      animationType="slide"
      onRequestClose={() => setShowPopup(false)}
      style={{ margin: 0, padding: 0 }}>
      <Pressable style={styles.overlay} onPress={() => setShowPopup(false)}>
        <Pressable style={styles.modalContainer} onPress={() => {}}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Form Konfirmasi Seller</Text>
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
                    <Text style={styles.boldText}> 4 foto + 1 video</Text>.
                    Format: .jpg, .png, .mp4, .mov. Maks. 10 MB (foto), 60 MB
                    (video).
                  </Text>
                  <View style={styles.photoRow}>
                    <TouchableOpacity
                      onPress={handleUpload}
                      style={styles.addPhotoBtn}>
                      <Image
                        source={require("../../assets/addImg.png")}
                        style={styles.photoThumb}
                      />
                    </TouchableOpacity>
                    {arrPhoto.length > 0 && (
                      <View style={styles.mediaWrap}>
                        {arrPhoto.map((item, idx) => (
                          <View key={idx} style={styles.mediaBox}>
                            {item.type === "image" ? (
                              <>
                                <Image
                                  source={{ uri: item.uri }}
                                  style={styles.mediaImg}
                                />
                                <TouchableOpacity
                                  onPress={() => {
                                    const newPhotos = [...arrPhoto];
                                    newPhotos.splice(idx, 1);
                                    setArrPhoto(newPhotos);
                                  }}
                                  style={styles.removeBtn}>
                                  <Feather name="x" size={12} color="white" />
                                </TouchableOpacity>
                              </>
                            ) : (
                              <View style={styles.videoBox}>
                                <Video
                                  source={{ uri: item.uri }}
                                  style={styles.mediaImg}
                                  resizeMode="cover"
                                  shouldPlay={false}
                                  isLooping={false}
                                  useNativeControls
                                />
                                <TouchableOpacity
                                  onPress={() => {
                                    const newPhotos = [...arrPhoto];
                                    newPhotos.splice(idx, 1);
                                    setArrPhoto(newPhotos);
                                  }}
                                  style={styles.removeBtn}>
                                  <Feather name="x" size={12} color="white" />
                                </TouchableOpacity>
                                <Text style={styles.videoText}>Video</Text>
                              </View>
                            )}
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
                    title={isUploaded ? "Loading..." : "Kirim"}
                    onPress={handleSellerResponse}
                    disabled={!isInputValid || isUploaded}
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
    height: "60%",
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
    top: 0,
    right: 0,
    backgroundColor: "#ef4444",
    borderRadius: 999,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSection: {
    marginBottom: 16,
  },
  mediaWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  mediaBox: {
    width: 50,
    height: 50,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
    // marginRight: 12,
    // marginBottom: 12,
  },
  mediaImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  videoBox: {
    width: "100%",
    height: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  videoText: {
    fontSize: 12,
    color: "#fff",
    position: "absolute",
  },
});
