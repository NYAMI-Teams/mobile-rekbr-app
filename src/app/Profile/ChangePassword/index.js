import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Platform,
  StyleSheet,
} from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import InputField from "@/components/InputField";
import { useState } from "react";
import { showToast } from "@/utils";
import { changePassword } from "@/utils/api/auth";
import PrimaryButton from "@/components/PrimaryButton";
import PasswordChecklist from "@/components/PasswordChecklist";
import BuyerKonfirmasi from "@/components/BuyerKonfirmasi";
import NavBackHeader from "@/components/NavBackHeader";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [kataSandiSaatIni, setKataSandiSaatIni] = useState("");
  const [kataSandiBaru, setKataSandiBaru] = useState("");
  const [konfirmasiKataSandiBaru, setKonfirmasiKataSandiBaru] = useState("");
  const [isKataSandiSaatIniVisible, setIsKataSandiSaatIniVisible] =
    useState(false);
  const [isKataSandiBaruVisible, setIsKataSandiBaruVisible] = useState(false);
  const [
    isKonfirmasiKataSandiBaruVisible,
    setIsKonfirmasiKataSandiBaruVisible,
  ] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleKataSandiSaatIniVisibility = () => {
    setIsKataSandiSaatIniVisible(!isKataSandiSaatIniVisible);
  };

  const toggleKataSandiBaruVisibility = () => {
    setIsKataSandiBaruVisible(!isKataSandiBaruVisible);
  };

  const toggleKonfirmasiKataSandiBaruVisibility = () => {
    setIsKonfirmasiKataSandiBaruVisible(!isKonfirmasiKataSandiBaruVisible);
  };

  const isPasswordValid = () => {
    return (
      konfirmasiKataSandiBaru.length >= 8 &&
      /[a-z]/.test(konfirmasiKataSandiBaru) &&
      /[A-Z]/.test(konfirmasiKataSandiBaru) &&
      /[0-9]/.test(konfirmasiKataSandiBaru) &&
      /[^a-zA-Z0-9]/.test(konfirmasiKataSandiBaru)
    );
  };

  const handleBtnPress = () => {
    if (isPasswordValid()) {
      setShowPopup(true);
    }
  };

  const handleBackBtn = () => {
    router.back();
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    if (
      !isPasswordValid() ||
      !kataSandiSaatIni ||
      !konfirmasiKataSandiBaru ||
      !kataSandiBaru
    ) {
      showToast("Gagal", "Password tidak valid", "error");
      return;
    }

    try {
      await changePassword(kataSandiSaatIni, konfirmasiKataSandiBaru);
      setShowPopup(false);
      showToast("Berhasil", "Password valid", "success");
      router.replace("/");
    } catch (error) {
      showToast("Gagal", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <NavBackHeader title={"Ganti Kata Sandi"} />

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, marginTop: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <InputField
                title="Kata Sandi Rekbr Saat Ini"
                placeholder="Masukkan kata sandi kamu saat ini"
                value={kataSandiSaatIni}
                onChangeText={setKataSandiSaatIni}
                isPassword={true}
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <InputField
                title="Kata Sandi Rekbr"
                placeholder="Masukkan kata sandi kamu"
                value={kataSandiBaru}
                onChangeText={setKataSandiBaru}
                isPassword={true}
              />
              <PasswordChecklist password={kataSandiBaru} />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
              <InputField
                title="Konfirmasi Kata Sandi Rekbr Kamu"
                placeholder="Pastikan sama, ya!"
                value={konfirmasiKataSandiBaru}
                onChangeText={setKonfirmasiKataSandiBaru}
                isPassword={true}
              />

              {/* Alert Validasi */}
              {konfirmasiKataSandiBaru.length > 0 && (
                <View style={styles.alertRow}>
                  <Feather
                    name={
                      konfirmasiKataSandiBaru === kataSandiBaru
                        ? "check-circle"
                        : "x-circle"
                    }
                    size={18}
                    color={
                      konfirmasiKataSandiBaru === kataSandiBaru
                        ? "#4ade80"
                        : "#f87171"
                    }
                  />
                  <Text
                    style={[
                      styles.alertText,
                      {
                        color:
                          konfirmasiKataSandiBaru === kataSandiBaru
                            ? "#4ade80"
                            : "#f87171",
                      },
                    ]}
                  >
                    {konfirmasiKataSandiBaru === kataSandiBaru
                      ? "Kata sandi sesuai"
                      : "Kata sandi tidak sesuai"}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Button */}
          <View style={styles.buttonWrapper}>
            <PrimaryButton
              title="Kirim"
              onPress={handleBtnPress}
              disabled={isLoading ? false : !isPasswordValid()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {showPopup && (
        <BuyerKonfirmasi
          onClose={() => setShowPopup(false)}
          onBtn2={handleChangePassword}
          onBtn1={() => setShowPopup(false)}
          title="Pastikan semua data di form sudah benar dan lengkap sebelum kamu kirim. Cek lagi, ya!"
          btn1="Kembali"
          btn2="Konfirmasi"
        />
      )}
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
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  form: {
    marginTop: 16,
    flex: 1,
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  eyeIcon: {
    position: "absolute",
    top: 44,
    right: 40,
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertText: {
    marginLeft: 8,
    fontSize: 14,
  },
  buttonWrapper: {
    width: "100%",
    paddingVertical: 16,
    marginBottom: 64,
  },
});
