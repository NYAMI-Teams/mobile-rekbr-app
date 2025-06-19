import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../../components/ProgressBar";
import InputField from "../../components/InputField";
import DropDownField from "../../components/DropDownField";
import PrimaryButton from "../../components/PrimaryButton";
import { useRouter } from "expo-router";

export default function LainnyaPage() {
  const router = useRouter();
  const [namaIbu, setNamaIbu] = useState("");
  const [pendidikan, setPendidikan] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [namaUsaha, setNamaUsaha] = useState("");
  const [bidangUsaha, setBidangUsaha] = useState("");

  // Auto isi semua data saat simulasi
  useEffect(() => {
    setNamaIbu("Maria Simulasi");
    setPendidikan("S1");
    setKodePos("40292");
    setNamaUsaha("Simulasi Mart");
    setBidangUsaha("Retail");
  }, []);

  const isFormValid =
    namaIbu !== "" &&
    pendidikan !== "" &&
    kodePos !== "" &&
    namaUsaha !== "" &&
    bidangUsaha !== "";

  const handleNext = () => {
    router.push("/E-kyc/KYC_Lampiran");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Know Your Customer</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      <ProgressBar
        currentStep={1}
        steps={["Data diri", "Lainnya", "Lampiran", "Pratinjau"]}
      />

      {/* Form Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <InputField
            title="Nama Ibu Kandung"
            placeholder="Tuliskan nama lengkap ibu kandung kamu"
            value={namaIbu}
            onChangeText={setNamaIbu}
            editable={false}
          />
        </View>

        <View style={styles.content}>
          <DropDownField
            title="Pendidikan Terakhir"
            placeholder="Pilih pendidikan terakhir anda"
            value={pendidikan}
            onChangeText={setPendidikan}
            editable={false}
          />
        </View>

        <View style={styles.content}>
          <DropDownField
            title="Kode POS"
            placeholder="Masukkan kode pos kamu"
            value={kodePos}
            onChangeText={setKodePos}
            editable={false}
          />
        </View>

        <View style={styles.content}>
          <InputField
            title="Nama Usaha"
            placeholder="Masukkan nama usaha kamu"
            value={namaUsaha}
            onChangeText={setNamaUsaha}
            editable={false}
          />
        </View>

        <View style={styles.content}>
          <DropDownField
            title="Bidang Usaha"
            placeholder="Pilih bidang usaha kamu"
            value={bidangUsaha}
            onChangeText={setBidangUsaha}
            editable={false}
          />
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <PrimaryButton
          title="Lanjut"
          onPress={handleNext}
          disabled={!isFormValid}
        />

        <View style={styles.footer}>
          <Image
            source={require("../../assets/bni-logo.png")}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={styles.footerText}>
            Proses Registrasi KYC-nya dengan perantara BNI langsung. Gak ribet &
            pasti aman!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    flex: 1,
    marginTop: 16,
  },
  scrollContent: {
    paddingBottom: 100,
    marginHorizontal: 20,
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    marginTop: 16,
  },
  footerLogo: {
    width: 40,
    marginRight: 8,
  },
  footerText: {
    flex: 1,
    fontSize: 12,
    color: "#444",
    lineHeight: 16,
  },
});
