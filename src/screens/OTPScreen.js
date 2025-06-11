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
import Icon from "react-native-vector-icons/Ionicons";
import { PinInput } from "@pakenfit/react-native-pin-input";

export default function OTPScreen() {
  const [timeLeft, setTimeLeft] = useState(299);
  const [isError, setIsError] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef([]);

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
  };

  const submitOtp = (otpValue) => {
    try {
      console.log("Submitting OTP:", otpValue);
      // Simulasi validasi OTP
      setTimeout(() => {
        if (otpValue === "123456") {
          setIsError(false);
          setIsValid(true);
          setTimeLeft(0);
          setErrorMessage("");
          console.log("OTP valid!");
          // Navigasi atau aksi selanjutnya
        } else {
          setIsError(true);
          setErrorMessage("Kode OTP yang Anda masukkan salah.");
        }
      }, 1000);
    } catch (error) {
      console.error("Error submitting OTP:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Verifikasi Email Kamu</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Masukkan kode yang kami kirimkan</Text>
        <Text style={styles.emailInfo}>
          Sudah dikirim ke email kamu{" "}
          <Text style={styles.email}>irgi168@gmail.com</Text>
        </Text>

        <View style={styles.otpContainer}>
          <PinInput
            length={6}
            onFillEnded={(otp) => submitOtp(otp)}
            inputStyle={{
              width: 40,
              height: 40,
              borderWidth: 1,
              borderColor: isValid ? "#009688" : isError ? "#FF3B30" : "#ccc",
              borderRadius: 8,
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 16,
            }}
          />
        </View>

        <Text
          style={[styles.timer, { color: timeLeft > 0 ? "#000" : "#FF3B30" }]}>
          {formatTime(timeLeft)}
        </Text>

        {isError && (
          <Text style={{ color: "#FF3B30", fontSize: 12, marginTop: 4 }}>
            {errorMessage}
          </Text>
        )}

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Tidak menerima kode?</Text>
          <TouchableOpacity onPress={handleResendCode} disabled={timeLeft > 0}>
            <Text
              style={[
                styles.resendLink,
                { color: timeLeft > 0 ? "#aaa" : "#007AFF" },
              ]}>
              Klik untuk kirim ulang
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.errorLink}>Salah alamat email?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
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
    fontSize: 12,
    color: "#333",
    textAlign: "left",
  },
  emailInfo: {
    width: "100%",
    fontSize: 10,
    color: "#616161",
    textAlign: "left",
  },
  email: {
    fontWeight: "500",
    color: "#111",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: 280,
    marginTop: 16,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  otpInput: {
    width: 40,
    height: 40,
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
    fontSize: 10,
    color: "#000",
  },
  resendLink: {
    fontSize: 10,
    marginLeft: 4,
    textDecorationLine: "underline",
  },
  errorLink: {
    fontSize: 10,
    color: "#007AFF",
    marginTop: 8,
    textDecorationLine: "underline",
  },
});
