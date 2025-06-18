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
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../../components/ProgressBar";
import AttachmentFilled from "../../components/AttachmentFilled";
import PrimaryButton from "../../components/PrimaryButton";
import { useRouter } from "expo-router";

export default function Lampiran() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleUpload = () => {
    setIsUploaded(true);
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

      {/* Content scrollable */}
      <ProgressBar
        currentStep={2}
        steps={["Data diri", "Lainnya", "Lampiran", "Pratinjau"]}
      />

      {/* Content */}
      <ScrollView className="mx-5">
        {/* Foto KTP */}
        <View style={styles.content}>
          <AttachmentFilled
            title="Foto Diri dengan KTP"
            caption={
              isUploaded
                ? "Swafoto KTP telah diambil"
                : "Ambil foto diri dengan KTP"
            }
            captionColor={isUploaded ? "#08B20F" : "#9E9E9E"}
            iconName={"camera"}
            boxColor={isUploaded ? "#F9F9F9" : "#49DBC8"}
            iconsColor={isUploaded ? "#C2C2C2" : "#FFFFFF"}
            cardColor={"#FFF"}
            alertText="Pratinjau hasil pengambilan swafoto KTP anda"
            alertColor={isUploaded ? "#08B20F" : "#C2C2C2"}
            alertIconName={isUploaded ? "checkmark-circle" : "alert-circle"}
            alertIconColor={isUploaded ? "#08B20F" : "#C2C2C2"}
            onPress={handleUpload}
          />
        </View>
        {/* Video Pernyataan */}
        <View style={styles.content}>
          <AttachmentFilled
            title="Video Pernyataan"
            caption={
              isUploaded
                ? "Rekam video pernyataan diri"
                : "Rekam video pernyataan diri"
            }
            captionColor={isUploaded ? "#08B20F" : "#9E9E9E"}
            iconName={"camera"}
            boxColor={isUploaded ? "#F9F9F9" : "#49DBC8"}
            iconsColor={isUploaded ? "#C2C2C2" : "#FFFFFF"}
            cardColor={"#FFF"}
            alertText="Pastikan wajah terlihat jelas untuk rekaman ini"
            alertColor={isUploaded ? "#08B20F" : "#C2C2C2"}
            alertIconName={isUploaded ? "checkmark-circle" : "alert-circle"}
            alertIconColor={isUploaded ? "#08B20F" : "#C2C2C2"}
            onPress={handleUpload}
          />
        </View>
        {/* Tanda Tangan */}
        <View style={styles.content}>
          <AttachmentFilled
            title="Tanda Tangan"
            caption={
              isUploaded
                ? "Foto tanda tangan telah diambil"
                : "Masukkan tanda tangan anda"
            }
            captionColor={isUploaded ? "#08B20F" : "#9E9E9E"}
            iconName={"pencil"}
            boxColor={isUploaded ? "#F9F9F9" : "#49DBC8"}
            iconsColor={isUploaded ? "#C2C2C2" : "#FFFFFF"}
            cardColor={"#FFF"}
            alertText="Gunakan layar sentuh pada perangkat anda"
            alertColor={isUploaded ? "#08B20F" : "#C2C2C2"}
            alertIconName={isUploaded ? "checkmark-circle" : "alert-circle"}
            alertIconColor={isUploaded ? "#08B20F" : "#C2C2C2"}
            onPress={handleUpload}
          />
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <PrimaryButton
          title="Lanjut"
          onPress={() => router.push("/E-kyc/KYC_Pratinjau")}
          disabled={!isUploaded}
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
  backArrow: {
    fontSize: 24,
    color: "#000",
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
  information: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 24,
  },
  logo_admin: {
    width: 20,
    height: 20,
    marginRight: 16,
  },
  informationText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#4CD7D0",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  checkedCheckbox: {
    backgroundColor: "#4CD7D0",
    borderColor: "#4CD7D0",
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    marginLeft: 12,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
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
