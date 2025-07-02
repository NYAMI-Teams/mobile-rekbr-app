import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { useRouter } from "expo-router";
import { getProfile, login, savePushToken } from "../../utils/api/auth";
import { showToast } from "../../utils";
import {
  getDataNotification,
  setAccessToken,
  setProfileStore,
} from "../../store";
import { registerForPushNotificationsAsync } from "@/utils/notifications";
import CryptoJS from "crypto-js";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePushToken = async () => {
    try {
      const pushToken = await registerForPushNotificationsAsync();
      if (!pushToken || !pushToken.startsWith("ExponentPushToken")) {
        console.warn("Push token tidak valid:", pushToken);
      } else {
        await savePushToken(pushToken);
      }
    } catch (err) {
      console.warn("Gagal simpan push token:", err?.message);
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setError(false);
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Silahkan masukkan email dan password.");
      return;
    }
    setIsLoading(true);

    try {
      // Hash the password using SHA-256
      const hashedPassword = CryptoJS.SHA256(password).toString();

      const res = await login(email, hashedPassword);
      showToast(
        "Login Berhasil",
        "Selamat datang kembali, " + email + "!",
        "success"
      );
      await setAccessToken(res?.data?.accessToken);
      await handlePushToken();
      await getUserProfile();
    } catch (err) {
      setError(true);
      if (err?.message === "email atau password salah") {
        setErrorMsg("Email atau Password Salah");
      } else if (err?.message === "Validasi gagal") {
        setErrorMsg("Format Email atau Password Salah");
      } else {
        setErrorMsg(err?.message);
      }
      showToast("Login Gagal", err?.message, "error");
      setIsLoading(false);
    }
  };

  const getUserProfile = async () => {
    try {
      const res = await getProfile();
      await setProfileStore(res?.data);
      router.replace("/");
    } catch (error) {
      showToast("Gagal", error?.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        style={{ flex: 1, width: "100%" }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <Image
                source={require("../../assets/header.png")}
                style={styles.headerImage}
                resizeMode="cover"
              />
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Email */}
              <View>
                <InputField
                  title="Email Kamu, Yuk!"
                  placeholder="email@kamu.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              {/* Password */}
              <View>
                <View style={styles.passwordFieldWrapper}>
                  <InputField
                    title="Kata Sandi Rekbr"
                    placeholder="Masukkan kata sandi kamu"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text.replace(/\s/g, ""));
                    }}
                    isPassword={true}
                  />
                </View>

                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={() => router.push("/auth/LupaPassword")}>
                  <Text style={styles.linkText}>Lupa Kata Sandi?</Text>
                </TouchableOpacity>

                {error && <Text style={styles.errorText}>{errorMsg}</Text>}
              </View>
            </View>

            {/* Button & Links */}
            <View style={styles.footerContainer}>
              <View style={styles.gradientBackground}>
                <Image
                  source={require("../../assets/gradasi.png")}
                  style={styles.gradientImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.buttonWrapper}>
                <PrimaryButton
                  title="Masuk"
                  onPress={handleLogin}
                  disabled={isLoading || !email || !password}
                />
              </View>

              {/* Registrasi / Hubungi Kami */}
              <View style={styles.linkSection}>
                <View style={styles.linkRow}>
                  <Text style={styles.linkLabel}>Belum punya akun?</Text>
                  <TouchableOpacity
                    onPress={() => router.replace("/auth/register")}>
                    <Text style={styles.linkAction}>Silakan Registrasi</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.linkRow}>
                  <Text style={styles.linkLabel}>Terdapat kendala?</Text>
                  <TouchableOpacity
                    onPress={() => Alert.alert("Berhasil terhubung")}>
                    <Text style={styles.linkAction}>Silakan Hubungi Kami</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Powered by */}
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  headerContainer: { backgroundColor: "white", alignItems: "center" },
  headerImage: {
    width: "100%",
    height: 300,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  formContainer: { marginHorizontal: 20, gap: 16, marginTop: 24, flex: 1 },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  linkText: { color: "#2563EB", fontSize: 14 },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    textAlign: "center",
  },
  footerContainer: { alignItems: "center" },
  gradientBackground: {
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
  gradientImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  buttonWrapper: { paddingHorizontal: 20, paddingVertical: 20, width: "100%" },
  linkSection: { alignItems: "center", marginTop: 12 },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  linkLabel: { fontSize: 14, paddingHorizontal: 12 },
  linkAction: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "500",
  },
  poweredByRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  poweredByText: { fontSize: 12, color: "#4B5563" },
  logoIcon: { width: 16, height: 16, marginHorizontal: 4 },
  poweredByBrand: { fontSize: 12, fontWeight: "600", color: "#F97316" },
});
