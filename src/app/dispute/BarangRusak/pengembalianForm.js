import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  StyleSheet,
} from "react-native";
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
import NavBackHeader from "@/components/NavBackHeader";

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      // can be stored if needed
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

  const handleModal = () => setModalVisible(true);
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
    if (isLoading) return;
    setIsLoading(true);
    try {
      await postBuyerReturn(complaintId, courierId, resi, image);
      router.replace("../../(tabs)/complaint");
    } catch (error) {
      showToast("Gagal", error?.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <NavBackHeader title={"Detail Komplain"} />

      {/* Form */}
      <ScrollView style={styles.formWrapper}>
        <InputField
          title="Input Nomor Resi"
          placeholder="Masukkan nomor resi dengan benar"
          value={resi}
          onChangeText={setResi}
        />

        <TouchableOpacity style={styles.dropdownWrapper} onPress={handleModal}>
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
          <View style={styles.previewWrapper}>
            <Text style={styles.previewLabel}>Preview Foto Resi:</Text>
            <Image
              source={{ uri: photoUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.buttonWrapper}>
        <PrimaryButton
          title={isLoading ? "Mengirim..." : "Kirim"}
          onPress={handleSubmit}
          disabled={isLoading}
        />
        <View style={styles.helpWrapper}>
          <Text style={styles.helpText}>Terdapat kendala?</Text>
          <TouchableOpacity disabled={isLoading}>
            <Text style={styles.helpLink}>Silahkan Hubungi Kami</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.modalBackBtn}
              >
                <ChevronLeftCircle size={24} color="#00C2C2" />
                <Text style={styles.modalTitle}>Pilih Ekspedisi</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalList}>
              <View style={styles.courierListBox}>
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
  container: { flex: 1, backgroundColor: "white" },
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
  formWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dropdownWrapper: {
    marginTop: 16,
    marginBottom: 16,
  },
  previewWrapper: {
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
  buttonWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  helpWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  helpText: {
    fontSize: 14,
    color: "#6B7280",
  },
  helpLink: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "700",
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: "55%",
  },
  modalHeader: {
    flexDirection: "row",
    padding: 16,
  },
  modalBackBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginLeft: 8,
    fontWeight: "500",
    color: "#111827",
  },
  modalList: {
    paddingHorizontal: 16,
  },
  courierListBox: {
    backgroundColor: "#F1F5F9",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 20,
  },
  courierItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(209,213,219,0.5)",
  },
  courierText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
