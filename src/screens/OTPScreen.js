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

export default function OTPScreen() {
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(299);
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

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index, key) => {
    if (key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = async () => {
    const clipboardContent = await Clipboard.getString();
    const numbers = clipboardContent.replace(/\D/g, "").slice(0, 6);
    const newOtpValues = Array(6).fill("");
    for (let i = 0; i < numbers.length; i++) {
      newOtpValues[i] = numbers[i];
    }
    setOtpValues(newOtpValues);
    const nextEmptyIndex = newOtpValues.findIndex((val) => val === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResendCode = () => {
    setTimeLeft(299);
    setOtpValues(Array(6).fill(""));
    inputRefs.current[0]?.focus();
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
          {otpValues.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={value}
              onChangeText={(text) => handleOtpChange(index, text)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(index, nativeEvent.key)
              }
              autoComplete="one-time-code"
            />
          ))}
        </View>

        <Text
          style={[
            styles.timer,
            { color: timeLeft > 0 ? "#007AFF" : "#FF3B30" },
          ]}>
          {formatTime(timeLeft)}
        </Text>

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
    justifyContent: "space-between",
    width: 300,
    marginTop: 16,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
  },
  timer: {
    fontSize: 12,
    marginTop: 16,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
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
