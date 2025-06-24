"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
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
    <View className="flex-1 bg-white p-4">
      <GestureHandlerRootView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 items-center">
          {/* Header */}
          <View className="flex-row items-center justify-between w-full mb-4">
            <TouchableOpacity onPress={() => router.back()}>
              <Icon name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-center flex-1">
              Verifikasi Email Kamu
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* OTP Card */}
          <View className="w-full bg-white rounded-2xl p-5 items-center">
            <Text className="w-full text-[18px] text-[#333] text-left font-medium pb-1">
              Masukkan kode yang kami kirimkan
            </Text>
            <View className="flex-col items-center w-full">
              <Text className="w-full text-sm text-[#616161] text-left">
                Sudah dikirim ke email kamu
                <Text className="font-medium text-[#111] text-base"> {email}</Text>
              </Text>
            </View>

            {/* OTP Input */}
            <View className="flex-col justify-center items-center py-6">
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
                  fontSize: 16, // lebih besar
                }}
                
              />
              <Text
                className={`text-sm font-medium mt-4 mb-4 ${timeLeft > 0 ? "text-black" : "text-red-500"
                  }`}
              >
                {formatTime(timeLeft)}
              </Text>
            </View>

            {isError && (
              <Text className="text-red-500 text-sm mt-1">{errorMessage}</Text>
            )}

            <View className="flex-row items-center mt-4">
              <Text className="text-sm text-black">Tidak menerima kode?</Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={timeLeft > 0}
              >
                <Text
                  className={`text-sm underline ml-1 ${timeLeft > 0 ? "text-gray-400" : "text-blue-500"
                    }`}
                >
                  Klik untuk kirim ulang
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-sm text-blue-500 mt-2 underline">
                Salah alamat email?
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </View>
  );
}
