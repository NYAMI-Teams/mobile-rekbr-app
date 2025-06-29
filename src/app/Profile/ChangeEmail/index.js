import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import InputField from "@/components/InputField";
import { useState } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import { getProfile, resendVerifyEmail } from "@/utils/api/auth";
import { showToast } from "@/utils";
import NavBackHeader from "@/components/NavBackHeader";

export default function ChangeEmailScreen() {
  const router = useRouter();
  const [emailSaatIni, setEmailSaatIni] = useState("");
  const [emailBaru, setEmailBaru] = useState("");
  const [emailSaatIniValid, setEmailSaatIniValid] = useState(false);
  const [checkEmailSaatIniBtn, setCheckEmailSaatIniBtn] = useState(false);

  const handleBtnPress = () => {
    if (checkEmailSaatIniBtn) {
      handleUpdateEmail();
    } else {
      handleVerifyEmailSaatIni(emailSaatIni);
    }
  };

  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleVerifyEmailSaatIni = async (text) => {
    try {
      const res = await getProfile();
      if (res.data.email == text) {
        setEmailSaatIniValid(true);
        setCheckEmailSaatIniBtn(true);
        showToast("Email Valid", "Email kamu valid", "success");
      } else {
        setEmailSaatIniValid(false);
        showToast("Email Tidak Valid", "Email saat ini salah", "error");
      }
    } catch (err) {
      setEmailSaatIniValid(false);
      showToast("Gagal", "Silahkan coba lagi", "error");
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const res = await resendVerifyEmail(emailBaru);
      router.push({
        pathname: "/auth/otp",
        params: { email: res.data.email, isFromLogin: false },
      });
    } catch (err) {
      console.log(err);
      showToast("Gagal", "Silahkan coba lagi", "error");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <NavBackHeader title={"Ganti Email"} />

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1 }}>
            {/* Email Saat Ini */}
            <View style={styles.inputGroup}>
              <InputField
                title="Masukkan Email Saat Ini"
                placeholder="Masukkan email kamu saat ini"
                value={emailSaatIni}
                onChangeText={setEmailSaatIni}
                keyboardType="email-address"
                editable={!emailSaatIniValid}
              />
              {/* Alert Validasi */}
              <View style={styles.validationContainer}>
                <Feather
                  name={
                    isEmailValid(emailSaatIni)
                      ? emailSaatIniValid
                        ? "check-circle"
                        : "info"
                      : "x-circle"
                  }
                  size={18}
                  color={
                    isEmailValid(emailSaatIni)
                      ? emailSaatIniValid
                        ? "#4ade80"
                        : "#fbbf24"
                      : "#f87171"
                  }
                />
                <Text
                  style={[
                    styles.validationText,
                    {
                      color: isEmailValid(emailSaatIni)
                        ? emailSaatIniValid
                          ? "#4ade80"
                          : "#fbbf24"
                        : "#f87171",
                    },
                  ]}
                >
                  {isEmailValid(emailSaatIni)
                    ? emailSaatIniValid
                      ? "Email Ditemukan"
                      : "Check Email"
                    : "Email tidak valid"}
                </Text>
              </View>
            </View>

            {/* Email Baru */}
            {emailSaatIniValid && (
              <View style={styles.inputGroup}>
                <InputField
                  title="Masukkan Email Baru"
                  placeholder="Masukkan email baru kamu"
                  value={emailBaru}
                  onChangeText={setEmailBaru}
                  keyboardType="email-address"
                />
                {/* Alert Validasi */}
                <View style={styles.validationContainer}>
                  <Feather
                    name={isEmailValid(emailBaru) ? "check-circle" : "x-circle"}
                    size={18}
                    color={isEmailValid(emailBaru) ? "#4ade80" : "#f87171"}
                  />
                  <Text
                    style={[
                      styles.validationText,
                      { color: isEmailValid(emailBaru) ? "#4ade80" : "#f87171" },
                    ]}
                  >
                    {isEmailValid(emailBaru)
                      ? "Email valid"
                      : "Email tidak valid"}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={
                checkEmailSaatIniBtn ? "Email Baru" : "Check Email Saat Ini"
              }
              onPress={handleBtnPress}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  validationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  validationText: {
    marginLeft: 8,
    fontSize: 14,
  },
  buttonContainer: {
    width: "100%",
    paddingVertical: 16,
    marginBottom: 32,
  },
});
