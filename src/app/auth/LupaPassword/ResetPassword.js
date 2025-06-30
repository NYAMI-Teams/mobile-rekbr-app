import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import InputField from "@/components/InputField";
import { useState } from "react";
import { showToast } from "@/utils";
import { resetPassword } from "@/utils/api/auth";
import PrimaryButton from "@/components/PrimaryButton";
import PasswordChecklist from "@/components/PasswordChecklist";
import BuyerKonfirmasi from "@/components/BuyerKonfirmasi";
import NavBackHeader from "@/components/NavBackHeader";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [kataSandiBaru, setKataSandiBaru] = useState("");
  const [konfirmasiKataSandiBaru, setKonfirmasiKataSandiBaru] = useState("");
  const [isKataSandiBaruVisible, setIsKataSandiBaruVisible] = useState(false);
  const [
    isKonfirmasiKataSandiBaruVisible,
    setIsKonfirmasiKataSandiBaruVisible,
  ] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!isPasswordValid() || !konfirmasiKataSandiBaru || !kataSandiBaru) {
      showToast("Gagal", "Password tidak valid", "error");
      return;
    }

    try {
      const res = await resetPassword(email, konfirmasiKataSandiBaru);
      setShowPopup(false);
      showToast("Berhasil", res?.message, "success");
      router.replace("/auth/login");
    } catch (error) {
      showToast("Gagal", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <NavBackHeader title={"Pulihkan Akses Akun Anda"} />

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, width: "100%", paddingHorizontal: 16, marginTop: 20, }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          <View style={styles.formContainer}>
            {/* Password */}
            <View style={styles.relativeContainer}>
              <InputField
                title="Kata Sandi Baru Rekbr"
                placeholder="Masukkan kata sandi baru kamu"
                value={kataSandiBaru}
                onChangeText={setKataSandiBaru}
                isPassword={true}
              />
              <PasswordChecklist password={kataSandiBaru} />
            </View>

            {/* Confirm Password */}
            <View style={styles.relativeContainer}>
              <InputField
                title="Konfirmasi Kata Sandi Baru Rekbr"
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
          title="Pastikan semuanya sudah benar yaa sebelum kamu kirim!"
          btn1="Kembali"
          btn2="Kirim"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  formContainer: {
    marginTop: 16,
    gap: 16,
    flex: 1,
  },
  relativeContainer: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    top: 44,
    right: 40,
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginHorizontal: 20,
  },
  alertText: {
    marginLeft: 8,
    fontSize: 14,
  },
  buttonWrapper: {
    width: "100%",
    paddingBottom: 64,
  },
});
