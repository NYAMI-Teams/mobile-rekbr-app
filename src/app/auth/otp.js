"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import { PinInput } from "@pakenfit/react-native-pin-input";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  verifyEmail,
  resendVerifyEmail,
  resetPasswordOTP,
  changeEmail,
  forgotPassword,
} from "../../utils/api/auth";
import { showToast } from "../../utils";
import { setAccessToken } from "../../store";

export default function OTP() {
  const { email, isFromLogin, isFromResetPassword } = useLocalSearchParams();
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
    if (isFromLogin) {
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
    } else if (isFromResetPassword) {
      forgotPassword(email)
        .then((res) => {
          showToast("Berhasil", res?.message, "success");
        })
        .catch((error) => {
          showToast("Gagal", error?.message, "error");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

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
      resetPasswordOTP(email, otpValue)
        .then((res) => {
          showToast("Berhasil", res?.message, "success");
          router.replace({
            pathname: "/auth/LupaPassword/ResetPassword",
            params: { email },
          });
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
    <View style={styles.container}>
      <GestureHandlerRootView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Icon name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Verifikasi Email Kamu</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* OTP Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Masukkan kode yang kami kirimkan
            </Text>

            <View style={styles.subTextWrapper}>
              <Text style={styles.subText}>
                Sudah dikirim ke email kamu
                <Text style={styles.emailText}> {email}</Text>
              </Text>
            </View>

            {/* OTP Input */}
            <View style={styles.otpInputWrapper}>
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
                  fontSize: 16,
                }}
              />
              <Text
                style={[
                  styles.timerText,
                  { color: timeLeft > 0 ? "#000" : "#EF4444" },
                ]}
              >
                {formatTime(timeLeft)}
              </Text>
            </View>

            {isError && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}

            <View style={styles.resendWrapper}>
              <Text style={styles.resendLabel}>Tidak menerima kode?</Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={timeLeft > 0}
              >
                <Text
                  style={[
                    styles.resendAction,
                    { color: timeLeft > 0 ? "#9CA3AF" : "#3B82F6" },
                  ]}
                >
                  Klik untuk kirim ulang
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backText}>Salah alamat email?</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 16 },
  keyboardView: { flex: 1, alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  cardTitle: {
    width: "100%",
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
    paddingBottom: 4,
    textAlign: "left",
  },
  subTextWrapper: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  subText: {
    width: "100%",
    fontSize: 14,
    color: "#616161",
    textAlign: "left",
  },
  emailText: {
    fontWeight: "500",
    color: "#111",
    fontSize: 16,
  },
  otpInputWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 16,
  },
  errorMessage: {
    color: "#EF4444",
    fontSize: 14,
    marginTop: 4,
  },
  resendWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  resendLabel: { fontSize: 14, color: "#000" },
  resendAction: {
    fontSize: 14,
    textDecorationLine: "underline",
    marginLeft: 4,
  },
  backText: {
    fontSize: 14,
    color: "#3B82F6",
    marginTop: 8,
    textDecorationLine: "underline",
  },
});
