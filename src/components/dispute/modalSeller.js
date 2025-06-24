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
} from "react-native";
import Modal from "react-native-modal";
import { useState, useEffect } from "react";
import { Pressable } from "react-native";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Feather } from "lucide-react-native";
import { postSellerResponse } from "../../utils/api/complaint";
import PrimaryButton from "../PrimaryButton";


export default function ModalSeller({ showPopup, setShowPopup }) {
  const [tanggapanSeller, setTanggapanSeller] = useState("");
  const [isInputValid, setIsInputValid] = useState(false);
  const [arrPhoto, setArrPhoto] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const mockID = 10;
  const status = "accept";

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const handleUpload = async () => {
    console.log("Masuk Sini (awal)");

    if (arrPhoto.length >= 5) {
      Alert.alert(
        "Limit Mencapai",
        "Anda sudah mencapai batas maksimal 5 foto",
        [{ text: "OK" }]
      );
      console.log("Masuk Sini (limit)");
      return;
    }

    if (hasCameraPermission === false) {
      Alert.alert(
        "Izin Kamera Diperlukan",
        "Aplikasi memerlukan akses kamera untuk mengambil foto. Mohon berikan izin di pengaturan perangkat Anda."
      );
      console.log("Masuk Sini (izin)");
      return;
    }

    if (hasCameraPermission === null) {
      Alert.alert(
        "Meminta Izin",
        "Aplikasi sedang meminta izin kamera. Mohon tunggu sebentar."
      );
      console.log("Masuk Sini (izin null)");
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
    console.log("Masuk Sini (akhir)");
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

      setArrPhoto((prev) => [...prev, compressed]);
      setIsUploaded(true);
    } else {
      setArrPhoto([]);
      setIsUploaded(false);
    }
  };

  const handleSellerResponse = async () => {
    setShowPopup(false);
    // hitted API
    try {
      const res = await postSellerResponse(
        mockID,
        status,
        tanggapanSeller,
        arrPhoto
      );
      showToast("Berhasil", res?.message, "success");
    } catch (err) {
      console.log("Gagal cok ===> ", err);
      showToast("Gagal", err?.message, "error");
    }
  };

  return (
    <Modal
      visible={showPopup}
      transparent
      animationType="slide"
      onRequestClose={() => setShowPopup(false)}
      style={{ margin: 0, padding: 0 }}
    >
      <Pressable
        className="flex-1 bg-black/40 justify-end"
        onPress={() => setShowPopup(false)}
      >
        <Pressable
          className="bg-white rounded-t-2xl px-2"
          style={{
            height: "55%",
            width: "100%",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
          onPress={() => {}}
        >
          <View className="flex-col justify-center p-4">
            <Text className="text-lg font-semibold mb-4">
              Form Konfirmasi Seller
            </Text>
            {/* form tanggapan seller */}
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              hideKeyboardOnScroll={true}
              keyboardDismissMode="on-drag"
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
              >
                <View className="mb-4">
                  <Text className="text-black text-base font-medium mb-2">
                    Tanggapan Seller (Min. 25 karakter)
                  </Text>
                  <TextInput
                    placeholder="Berikan tanggapan kamu"
                    placeholderTextColor="#888"
                    className="border border-gray-300 rounded-lg p-2 h-28"
                    multiline
                    numberOfLines={4}
                    value={tanggapanSeller}
                    onChangeText={(text) => {
                      setTanggapanSeller(text);
                      setIsInputValid(text.length >= 25 && text.length <= 200);
                    }}
                  />
                  {tanggapanSeller.length > 0 && (
                    <Text className="text-xs text-gray-500 mt-1">
                      {tanggapanSeller.length}/200 karakter
                    </Text>
                  )}
                  {!isInputValid && tanggapanSeller.length > 0 && (
                    <Text className="text-xs text-red-500 mt-1">
                      {tanggapanSeller.length < 25
                        ? "Minimal 25 karakter"
                        : "Maksimal 200 karakter"}
                    </Text>
                  )}
                </View>
                <View className="mb-2">
                  <Text className="text-black text-base font-medium mb-2">
                    Bukti foto & video (opsional)
                  </Text>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontWeight: "300",
                      marginBottom: 8,
                    }}
                  >
                    Unggah maksimal
                    <Text style={{ fontWeight: "500" }}> 5 foto</Text> atau
                    <Text style={{ fontWeight: "500" }}> 4 foto + 1 video</Text>
                    . Format: .jpg, .png, .mp4, .mov. Maks. 10 MB (foto), 60 MB
                    (video).
                  </Text>
                  <View className="flex-row flex-wrap gap-2 mt-2">
                    <TouchableOpacity onPress={handleUpload} className="mb-2">
                      <Image
                        source={require("../../assets/addImg.png")}
                        style={{ width: 50, height: 50 }}
                      />
                    </TouchableOpacity>
                    {arrPhoto.length > 0 && (
                      <View className="flex-row flex-wrap gap-2">
                        {arrPhoto.map((photo, index) => (
                          <View key={index} className="relative">
                            <Image
                              source={{ uri: photo.uri }}
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 8,
                              }}
                            />
                            <TouchableOpacity
                              onPress={() => {
                                const newPhotos = [...arrPhoto];
                                newPhotos.splice(index, 1);
                                setArrPhoto(newPhotos);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                            >
                              <Feather name="x" size={16} color="white" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                  {arrPhoto.length > 0 && (
                    <Text className="text-xs text-gray-500 mt-1">
                      {arrPhoto.length}/5 foto
                    </Text>
                  )}
                </View>
                <View className="mb-4">
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
