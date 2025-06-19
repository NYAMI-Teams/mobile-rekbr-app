"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import { PinInput } from "@pakenfit/react-native-pin-input";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  verifyEmail,
  resendVerifyEmail,
  resetPasswordOTP,
  changeEmail,
} from "../../utils/api/auth";
import { showToast } from "../../utils";
import { setAccessToken } from "../../store";

export default function OTP() {
  const { email } = useLocalSearchParams();
  const { isFromLogin } = useLocalSearchParams();
  const { isFromResetPassword } = useLocalSearchParams();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(299);
  const [isError, setIsError] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleResendCode = () => {
    setTimeLeft(299);
    inputRefs[0]?.focus();
    resendVerifyEmail(email)
      .then((res) => {
        showToast("Berhasil", res?.message, "success");
      })
      .catch((error) => {
        showToast("Gagal", error?.message, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const submitOtp = (otpValue) => {
    setIsLoading(true);
    if (isFromLogin) {
      verifyEmail(email, otpValue)
        .then((res) => {
          setAccessToken(res?.data?.accessToken);
          showToast("Selamat datang, " + email, res?.message, "success");
          router.replace("/auth/SuccessLogin");
        })
        .catch((error) => {
          setIsError(true);
          setErrorMessage("Kode OTP yang Anda masukkan salah.");
          showToast("Gagal", error?.message, "error");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (isFromResetPassword) {
      console.log("hitted from reset password", otpValue);

      resetPasswordOTP(email, otpValue)
        .then((res) => {
          showToast("Berhasil", res?.message, "success");
          router.replace({
            pathname: "/auth/LupaPassword/ResetPassword",
            params: { email },
          });
        })
        .catch((error) => {
          console.log(error, "error from reset password otp");

          setIsError(true);
          setErrorMessage("Kode OTP yang Anda masukkan salah.");
          showToast("Gagal", error?.message, "error");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      //Backend Belum Siap (DEV)
      changeEmail(email)
        .then((res) => {
          showToast(
            "Berhasil ganti email",
            "Email kamu sudah berganti menjadi " + email,
            "success"
          );
          router.replace("/auth/LupaPassword/ResetPassword");
        })
        .catch((error) => {
          setIsError(true);
          setErrorMessage("Kode OTP yang Anda masukkan salah.");
          showToast("Gagal", error?.message, "error");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1 p-4">
      <GestureHandlerRootView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Icon name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Verifikasi Email Kamu</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* OTP Card */}
          <View style={styles.card}>
            <Text style={styles.subtitle}>
              Masukkan kode yang kami kirimkan
            </Text>
            <View className="flex-col items-center">
              <Text style={styles.emailInfo}>
                Sudah dikirim ke email kamu
                <Text style={styles.email}> {email}</Text>
              </Text>
            </View>

            {/* OTP Input */}
            <View style={styles.otpContainer}>
              <PinInput
                length={6}
                onFillEnded={(otp) => submitOtp(otp)}
                inputStyle={{
                  width: 40,
                  height: 40,
                  borderWidth: 1,
                  borderColor: isValid
                    ? "#009688"
                    : isError
                    ? "#FF3B30"
                    : "#ccc",
                  borderRadius: 8,
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 16,
                }}
              />
              <Text
                style={[
                  styles.timer,
                  { color: timeLeft > 0 ? "#000" : "#FF3B30" },
                ]}>
                {formatTime(timeLeft)}
              </Text>
            </View>

            {isError && (
              <Text style={{ color: "#FF3B30", fontSize: 12, marginTop: 4 }}>
                {errorMessage}
              </Text>
            )}

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Tidak menerima kode?</Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={timeLeft > 0}>
                <Text
                  style={[
                    styles.resendLink,
                    { color: timeLeft > 0 ? "#aaa" : "#007AFF" },
                  ]}>
                  Klik untuk kirim ulang
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.errorLink}>Salah alamat email?</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  card: {
    width: "100%",
    height: "auto",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  subtitle: {
    width: "100%",
    fontSize: 17,
    color: "#333",
    textAlign: "left",
    fontWeight: "500",
    paddingBottom: 4,
  },
  emailInfo: {
    width: "100%",
    fontSize: 12,
    color: "#616161",
    textAlign: "left",
  },
  email: {
    fontWeight: "500",
    color: "#111",
  },
  otpContainer: {
    flexDirection: "col",
    justifyContent: "center",
    alignItems: "center",
    width: 320,
    paddingVertical: 24,
  },
  otpInput: {
    width: 46,
    height: 46,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 16,
  },
  timer: {
    fontSize: 12,
    marginTop: 16,
    marginBottom: 16,
    fontWeight: "500",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  resendText: {
    fontSize: 12,
    color: "#000",
  },
  resendLink: {
    fontSize: 12,
    marginLeft: 4,
    textDecorationLine: "underline",
  },
  errorLink: {
    fontSize: 12,
    color: "#007AFF",
    marginTop: 8,
    textDecorationLine: "underline",
  },
});
