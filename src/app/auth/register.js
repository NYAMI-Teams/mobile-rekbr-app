import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import PasswordChecklist from "../../components/PasswordChecklist";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { register } from "../../utils/api/auth";
import { showToast } from "../../utils";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    //development (DELETE)
    // setEmail("danilardi13@gmail.com");
    // setPassword("Mobilmerah123#");
    // setConfirmPassword("Mobilmerah123#");
    // setIsChecked(true);
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const isEmailValid = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPasswordValid = () => {
    return (
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^a-zA-Z0-9]/.test(password)
    );
  };

  const isFormValid = () => {
    return (
      isEmailValid() &&
      isPasswordValid() &&
      password === confirmPassword &&
      isChecked
    );
  };

  const handleRegister = () => {
    setIsLoading(true);
    register(email, password)
      .then((res) => {
        showToast("Registrasi Berhasil", res?.message, "success");
        router.push({
          pathname: "/auth/otp",
          params: { email: email, isFromLogin: true },
        });
      })
      .catch((err) => {
        showToast("Registrasi Gagal", err?.message, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" && 60}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Image
              source={require("../../assets/header.png")}
              style={styles.headerImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.formWrapper}>
            {/* Email */}
            <View style={styles.marginBottom}>
              <InputField
                title="Email Kamu, Yuk!"
                placeholder="email@kamu.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                inputClassName="pr-12"
              />
              {/* Alert Validasi Email */}
              <View style={styles.validationRow}>
                <Feather
                  name={isEmailValid() ? "check-circle" : "x-circle"}
                  size={18}
                  color={isEmailValid() ? "#4ade80" : "#f87171"}
                />
                <Text
                  style={[
                    styles.validationText,
                    { color: isEmailValid() ? "#16a34a" : "#f87171" },
                  ]}
                >
                  {isEmailValid() ? "Email valid" : "Email tidak valid"}
                </Text>
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputRelative}>
              <InputField
                title="Kata Sandi Rekbr"
                placeholder="Masukkan kata sandi kamu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                isPassword={true}
                inputClassName="pr-12"
              />
              <TouchableOpacity
                style={styles.passwordToggleIcon}
                onPress={togglePasswordVisibility}
              >
                <MaterialIcons
                  name={isPasswordVisible ? "visibility" : "visibility-off"}
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
              <PasswordChecklist password={password} />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputRelative}>
              <InputField
                title="Konfirmasi Kata Sandi Rekbr Kamu"
                placeholder="Pastikan sama, ya!"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!isConfirmPasswordVisible}
                isPassword={true}
                inputClassName="pr-12"
              />
              <TouchableOpacity
                style={styles.passwordToggleIcon}
                onPress={toggleConfirmPasswordVisibility}
              >
                <MaterialIcons
                  name={
                    isConfirmPasswordVisible ? "visibility" : "visibility-off"
                  }
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
              {/* Alert Validasi */}
              {confirmPassword.length > 0 && (
                <View style={styles.validationRow}>
                  <Feather
                    name={
                      confirmPassword === password ? "check-circle" : "x-circle"
                    }
                    size={18}
                    color={confirmPassword === password ? "#4ade80" : "#f87171"}
                  />
                  <Text
                    style={[
                      styles.validationText,
                      {
                        color:
                          confirmPassword === password ? "#16a34a" : "#f87171",
                      },
                    ]}
                  >
                    {confirmPassword === password
                      ? "Kata sandi sesuai"
                      : "Kata sandi tidak sesuai"}
                  </Text>
                </View>
              )}
            </View>

            {/* Checkbox TnC */}
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                onPress={() => setIsChecked(!isChecked)}
                style={[
                  styles.checkboxBox,
                  isChecked
                    ? { backgroundColor: "#3ED6C5", borderColor: "#3ED6C5" }
                    : { borderColor: "#9CA3AF" },
                ]}
              >
                {isChecked && <Text style={styles.checkboxText}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                Saya menyetujui Kebijakan Privasi yang berlaku
              </Text>
            </View>

            <View style={styles.buttonWrapper}>
              <PrimaryButton
                title="Daftar"
                onPress={handleRegister}
                disabled={!isFormValid()}
              />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerGradient}>
              <Image
                source={require("../../assets/gradasi.png")}
                style={styles.footerImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.linkWrapper}>
              <View style={styles.linkRow}>
                <Text style={styles.linkLabel}>Sudah punya akun?</Text>
                <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                  <Text style={styles.linkAction}>Silakan Login</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.linkRow}>
                <Text style={styles.linkLabel}>Terdapat kendala?</Text>
                <TouchableOpacity
                  onPress={() => Alert.alert("Berhasil terhubung")}
                >
                  <Text style={styles.linkAction}>Silakan Hubungi Kami</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.poweredByRow}>
              <Text style={styles.poweredByText}>Powered by</Text>
              <Image
                source={require("../../assets/326.png")}
                style={styles.logoIcon}
                resizeMode="contain"
              />
              <Text style={styles.poweredByBrand}>ADHIKSHA TRIBIXA</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  headerContainer: {
    backgroundColor: "white",
    alignItems: "center",
    marginBottom: 8,
  },
  headerImage: {
    width: "100%",
    height: 300,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  formWrapper: { paddingHorizontal: 20, paddingVertical: 20 },
  marginBottom: { marginBottom: 16 },
  validationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginHorizontal: 20,
  },
  validationText: { marginLeft: 8, fontSize: 14 },
  inputRelative: { position: "relative", marginBottom: 16 },
  passwordToggleIcon: { position: "absolute", top: 44, right: 40 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
    paddingHorizontal: 20,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxText: { color: "white", fontSize: 12 },
  termsText: { marginLeft: 12, color: "black", fontSize: 14, flex: 1 },
  buttonWrapper: { paddingHorizontal: 20, paddingVertical: 20 },
  footer: { alignItems: "center" },
  footerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 208,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
    zIndex: -1,
  },
  footerImage: { width: "100%", height: "100%", position: "absolute" },
  linkWrapper: { alignItems: "center", marginTop: 12 },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  linkLabel: { fontSize: 14, paddingHorizontal: 12 },
  linkAction: { fontSize: 14, color: "#2563EB", fontWeight: "500" },
  poweredByRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingBottom: 20,
  },
  poweredByText: { fontSize: 12, color: "#4B5563" },
  logoIcon: { width: 16, height: 16, marginHorizontal: 4 },
  poweredByBrand: { fontSize: 12, fontWeight: "600", color: "#F97316" },
});
