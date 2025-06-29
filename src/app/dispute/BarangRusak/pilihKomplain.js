// DisputeDetail.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { ChevronLeft, ChevronDown } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import PrimaryButton from "../../../components/PrimaryButton";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import ProblemDisplay from "../../../components/dispute/problemDisplay";
import ProductCard from "../../../components/dispute/productCard";
import { InputField } from "../../../components/dispute/InputField";
import { UploadProve } from "../../../components/dispute/UploadProve";
import { getDetailBuyerTransaction } from "../../../utils/api/buyer";
import { postBuyerComplaint } from "../../../utils/api/complaint";
import { showToast } from "../../../utils";
import NavBackHeader from "@/components/NavBackHeader";

export default function DisputeDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [problemType] = useState("damaged");
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [media, setMedia] = useState([]);
  const [detailTransaction, setDetailTransaction] = useState({});
  const [reason, setReason] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [ajukanUlang, setAjukanUlang] = useState(false);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const res = await getDetailBuyerTransaction(id);
        setDetailTransaction(res.data);
        setAjukanUlang(res.data?.Complaint?.length > 0);
      } catch (err) {
        showToast("Gagal", err?.message, "error");
      }
    };

    fetchTransactionDetails();
  }, [id]);

  const solutionOptions = [
    {
      title: "Pengembalian barang dan dana",
      desc: "Dana bakal balik ke buyer setelah seller atau pihak terkait terima barang bermasalah.",
    },
    {
      title: "Refund Barang",
      desc: "Seller mengirimkan barang pengganti setelah buyer mengembalikan barang",
      disabled: true,
    },
  ];

  const handleSubmit = () => setShowConfirmModal(true);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await postBuyerComplaint(id, problemType, reason, media);
      showToast("Sukses", "Komplain berhasil dikirim", "success");
      setShowConfirmModal(false);
      router.push("../../(tabs)/complaint");
    } catch (error) {
      showToast("Gagal", "Komplain gagal dikirim", "error");
    } finally {
      setLoading(false);
    }
  };

  const pickMedia = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Izinkan akses ke galeri untuk mengunggah bukti.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.assets || result.assets.length === 0) return;

    const selected = result.assets[0];
    const uri = selected.uri;
    const type = selected.type;
    const extension = uri.split(".").pop().toLowerCase();
    const sizeMB = (await FileSystem.getInfoAsync(uri)).size / (1024 * 1024);

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

    if (type === "image" && sizeMB > 10) {
      alert("Ukuran foto melebihi 10MB");
      return;
    }

    if (type === "video" && sizeMB > 50) {
      alert("Ukuran video melebihi 50MB");
      return;
    }

    const photoCount = media.filter((m) => m.type === "image").length;
    const videoCount = media.filter((m) => m.type === "video").length;

    if (
      (type === "image" && media.length >= 5) ||
      (type === "video" && (videoCount >= 1 || photoCount > 4))
    ) {
      alert("Maksimal 5 file atau 4 foto + 1 video.");
      return;
    }

    setMedia([...media, selected]);
  };

  return (
    <View style={styles.container}>
      <NavBackHeader title={"Detail Masalah"} />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <ProblemDisplay
          image={require("../../../assets/barangrusak.png")}
          problemType="Barang rusak"
          action={() => router.back()}
        />

        <ProductCard {...detailTransaction} />

        <InputField
          title="Alasan kerusakan"
          placeholder="Jelaskan kerusakan barang dan lampirkan foto."
          value={reason}
          onChangeText={setReason}
        />

        <UploadProve
          media={media}
          pickMedia={pickMedia}
          setShowTipsModal={setShowTipsModal}
        />

        <Text style={styles.solutionTitle}>Solusi apa yang kamu inginkan</Text>
        <Text style={styles.solutionSub}>
          Solusi bisa berubah, sesuai kesepakatan antara Seller, Buyer dan Tim
          Rekbr by BNI
        </Text>

        <TouchableOpacity
          style={styles.solutionPicker}
          onPress={() => setShowModal(true)}
        >
          <Text
            style={[
              styles.solutionText,
              selectedSolution ? styles.blackText : styles.grayText,
            ]}
          >
            {selectedSolution || "Pilih solusi kamu"}
          </Text>
          <ChevronDown size={16} color="#999" />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={ajukanUlang ? "Ajukan Ulang Komplain" : "Kirim"}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
  },
  scrollView: {
    paddingBottom: 40,
  },
  solutionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  solutionSub: {
    fontSize: 12,
    color: "#4B5563",
    marginBottom: 12,
  },
  solutionPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  solutionText: {
    fontSize: 14,
  },
  blackText: {
    color: "#000000",
  },
  grayText: {
    color: "#9CA3AF",
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
});
