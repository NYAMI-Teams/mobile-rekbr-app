import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../../components/ProgressBar";
import AttachmentFilled from "../../components/AttachmentFilled";
import InputField from "../../components/InputField";
import DateField from "../../components/DateField";
import DropDownField from "../../components/DropDownField";
import PrimaryButton from "../../components/PrimaryButton";
import { useRouter } from "expo-router";

export default function DataDiri() {
  const router = useRouter();
  const [isUploaded, setIsUploaded] = useState(false);
  const [notification, setNotification] = useState("");

  const [ktpNumber, setKtpNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [religion, setReligion] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");

  const handleUpload = () => {
    setIsUploaded(true);
    setNotification("Data KTP terisi otomatis, cek lagi");

    setKtpNumber("1273040311020000");
    setFullName("IRGI MUTTAQIN FAHREZI SITUMORANG");
    setBirthDate("03 November 2000");
    setGender("Laki-laki");
    setReligion("Islam");
    setMaritalStatus("Lajang");
    setAddress("Jl. Lada No.1");
    setProvince("DKI Jakarta");
    setCity("Jakarta Barat");
    setDistrict("Taman Sari");
    setVillage("Pinangsia");
  };

  const isFormValid =
    ktpNumber.trim() !== "" &&
    fullName.trim() !== "" &&
    birthDate.trim() !== "" &&
    gender.trim() !== "" &&
    religion.trim() !== "" &&
    maritalStatus.trim() !== "" &&
    address.trim() !== "" &&
    province.trim() !== "" &&
    city.trim() !== "" &&
    district.trim() !== "" &&
    village.trim() !== "";

  return (
    <View style={styles.container}>
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
        currentStep={0}
        steps={["Data diri", "Lainnya", "Lampiran", "Pratinjau"]}
      />

      {/* Notification */}
      {notification !== "" && (
        <View style={styles.notification}>
          <Ionicons name="checkmark-circle" size={20} color="#08B20F" />
          <Text style={styles.notificationText}>{notification}</Text>
        </View>
      )}

      {/* Content */}
      <ScrollView>
        <View style={styles.content}>
          <AttachmentFilled
            title="Kartu Tanda Penduduk (KTP)"
            caption={
              isUploaded
                ? "Foto KTP telah diambil"
                : "Ambil foto KTP anda disini"
            }
            captionColor={isUploaded ? "#08B20F" : "#9E9E9E"}
            iconName={"camera"}
            boxColor={isUploaded ? "#F9F9F9" : "#49DBC8"}
            iconsColor={isUploaded ? "#C2C2C2" : "#FFFFFF"}
            cardColor={"#FFF"}
            alertText="Pastikan keterbacaan foto dan hindari bayangan"
            alertColor={isUploaded ? "#08B20F" : "#C2C2C2"}
            alertIconName={isUploaded ? "checkmark-circle" : "alert-circle"}
            alertIconColor={isUploaded ? "#08B20F" : "#C2C2C2"}
            onPress={handleUpload}
          />
        </View>

        {/* Form Fields */}
        <View style={styles.content}>
          <InputField
            title="Nomor Kartu Tanda Penduduk (KTP)"
            placeholder="Masukkan nomor KTP kamu"
            value={ktpNumber}
            onChangeText={setKtpNumber}
            editable={false}
          />
        </View>
        <View style={styles.content}>
          <InputField
            title="Nama Lengkap"
            placeholder="Tuliskan nama lengkap kamu"
            value={fullName}
            onChangeText={setFullName}
            editable={false}
          />
        </View>
        <View style={styles.content}>
          <DateField
            title="Tanggal Lahir"
            placeholder="Pilih tanggal lahir kamu"
            value={birthDate}
            onChangeText={setBirthDate}
            editable={false}
          />
        </View>
        <View style={styles.content}>
          <DropDownField
            title="Jenis Kelamin"
            placeholder="Pilih jenis kelamin kamu"
            value={gender}
            onChangeText={setGender}
            editable={false}
          />
        </View>
        <View style={styles.content}>
          <DropDownField
            title="Agama"
            placeholder="Pilih agama anda"
            value={religion}
            onChangeText={setReligion}
            editable={false}
          />
        </View>
        <View style={styles.content}>
          <DropDownField
            title="Status Perkawinan"
            placeholder="Pilih status perkawinan anda"
            value={maritalStatus}
            onChangeText={setMaritalStatus}
            editable={false}
          />
        </View>
        <View style={styles.content}>
          <InputField
            title="Alamat Sesuai KTP"
            placeholder="Masukkan alamat anda sesuai dengan KTP"
            value={address}
            onChangeText={setAddress}
            editable={false}
          />
        </View>
        <View style={styles.content}>
          <DropDownField
            title="Provinsi"
            placeholder="Pilih provinsi anda"
            value={province}
            onChangeText={setProvince}
            editable={false}
          />
        </View>
        <View style={styles.content}>
          <DropDownField
            title="Kota / Kabupaten"
            placeholder="Pilih kota / kabupaten anda"
            value={city}
            onChangeText={setCity}
            editable={false}
          />
        </View>
        <View style={styles.content}>
          <DropDownField
            title="Kecamatan"
            placeholder="Pilih kecamatan anda"
            value={district}
            onChangeText={setDistrict}
            editable={false}
          />
        </View>
        <View style={styles.contentWithMarginBottom}>
          <DropDownField
            title="Kelurahan / Desa"
            placeholder="Pilih kelurahan / desa anda"
            value={village}
            onChangeText={setVillage}
            editable={false}
          />
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <PrimaryButton
          title="Lanjut"
          onPress={() => router.push("/E-kyc/KYC_Lainnya")}
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
    </View>
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
    marginHorizontal: 20,
  },
  contentWithMarginBottom: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  notification: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDFBFA",
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  notificationText: {
    marginLeft: 8,
    color: "#000000",
    fontSize: 14,
    fontWeight: "500",
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
