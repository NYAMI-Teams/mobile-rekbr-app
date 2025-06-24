import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, ChevronLeftCircle } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { InputField } from "../../../components/dispute/InputField";
import AttachmentFilled from "../../../components/AttachmentFilled";
import PrimaryButton from "../../../components/PrimaryButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import DropDownField from "../../../components/DropDownField";
import { getListCourier } from "../../../utils/api/seller";
import { postBuyerReturn } from "../../../utils/api/complaint";
import { showToast } from "../../../utils";

export default function PengembalianForm() {
  const router = useRouter();
  const { complaintId } = useLocalSearchParams();

  const [resi, setResi] = useState("");
  const [courier, setCourier] = useState("");
  const [photoUri, setPhotoUri] = useState(null);
  const [courierId, setCourierId] = useState("");
  const [courierList, setCourierList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, isLoading] = useState(false);

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

  const handleModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCourier("");
  };

  const handleSelectCourier = (selectedCourier) => {
    setCourier(selectedCourier.name);
    setCourierId(selectedCourier.id);
    setModalVisible(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await postBuyerReturn(complaintId, courierId, resi, image);
      router.replace("../../(tabs)/dispute");
    } catch (error) {
      showToast("Gagal", error?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-base font-semibold">Form Pengembalian</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 px-4">
        <InputField
          title="Input Nomor Resi"
          placeholder="Masukkan nomor resi dengan benar"
          value={resi}
          onChangeText={setResi}
        />
        <TouchableOpacity className="mt-4 mb-4" onPress={handleModal}>
          <DropDownField
            title="Pilih Ekspedisi"
            placeholder="Pilih Ekspedisi pengiriman kamu"
            value={courier}
            onChangeText={setCourier}
            editable={false}
          />
        </TouchableOpacity>

        <AttachmentFilled
          title="Upload Bukti Pengiriman"
          caption={
            photoUri ? "Foto berhasil diupload" : "Take foto resi kamu disini"
          }
          cardColor={photoUri ? "#E8F5E9" : "#FFF"}
          captionColor={photoUri ? "#4CAF50" : "#9E9E9E"}
          iconName={photoUri ? "checkmark" : "camera"}
          boxColor={photoUri ? "#4CAF50" : "#49DBC8"}
          alertText="Pastikan keterbacaan foto dan hindari bayangan"
          alertColor="#C2C2C2"
          alertIconName="alert-circle"
          alertIconColor="#C2C2C2"
          onPress={pickImage}
          iconsColor="#FFF"
        />

        {photoUri && (
          <View className="mt-4">
            <Text className="text-sm font-medium mb-2">Preview Foto Resi:</Text>
            <Image
              source={{ uri: photoUri }}
              style={{ width: "100%", height: 200, borderRadius: 12 }}
            />
          </View>
        )}
      </ScrollView>

      <View className="px-4 py-3 border-t border-gray-200">
        <PrimaryButton
          title={loading ? "Mengirim..." : "Kirim"}
          onPress={handleSubmit}
          disabled={loading}
        />
        <View className="flex-row items-center justify-center mt-3">
          <Text className="text-sm text-gray-500">Terdapat kendala?</Text>
          <TouchableOpacity disabled={loading}>
            <Text className="text-sm text-blue-600 ml-1 font-bold">
              Silahkan Hubungi Kami
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          closeModal();
        }}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          onPress={closeModal}
        >
          <View className="bg-white rounded-t-lg h-[55%]">
            <View className="flex-row justify-start p-4 ">
              <TouchableOpacity
                onPress={closeModal}
                className="flex-row items-center mb-6"
              >
                <ChevronLeftCircle size={24} color="#00C2C2" />
                <Text className="text-lg font-normal text-gray-800 ml-2">
                  Pilih Ekspedisi
                </Text>
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <View className="justify-between flex-1">
              <ScrollView className="my-2" showsVerticalScrollIndicator={false}>
                <View className="flex-col gap-4 bg-slate-100/50 m-5 p-5 rounded-lg border border-gray-300">
                  {courierList.map((courier, index) => (
                    <TouchableOpacity
                      key={index}
                      className="p-5 border-b-2 border-gray-300/50 mb-4"
                      onPress={() => handleSelectCourier(courier)}
                    >
                      <Text className="text-[15px] font-semibold">
                        {courier.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
