import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import PasswordChecklist from "../../components/PasswordChecklist";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
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
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === 'ios' && 60}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          >
          <View className="bg-white items-center mb-2">
            <Image
              source={require("../../assets/header.png")}
              className="w-full h-[300px] rounded-b-2xl"
              resizeMode="cover"
            />
          </View>

          <View className="py-5 px-5">
            {/* Email */}
            <View className="mb-4">
              <InputField
                title="Email Kamu, Yuk!"
                placeholder="email@kamu.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                inputClassName="pr-12"
              />
              {/* Alert Validasi Email*/}
              <View className="flex-row items-center mt-2 mx-5">
                <Feather
                  name={isEmailValid() ? "check-circle" : "x-circle"}
                  size={18}
                  color={isEmailValid() ? "#4ade80" : "#f87171"}
                />
                <Text
                  className={`ml-2 text-sm ${
                    isEmailValid() ? "text-green-600" : "text-red-400"
                  }`}>
                  {isEmailValid() ? "Email valid" : "Email tidak valid"}
                </Text>
              </View>
            </View>

            {/* Password */}
            <View className="relative mb-4">
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
                className="absolute top-11 right-10"
                onPress={togglePasswordVisibility}>
                <MaterialIcons
                  name={isPasswordVisible ? "visibility" : "visibility-off"}
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
              <PasswordChecklist password={password} />
            </View>

            {/* Confirm Password */}
            <View className="relative mb-4">
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
                className="absolute top-11 right-10"
                onPress={toggleConfirmPasswordVisibility}>
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
                <View className="flex-row items-center mt-2 mx-5">
                  <Feather
                    name={
                      confirmPassword === password ? "check-circle" : "x-circle"
                    }
                    size={18}
                    color={confirmPassword === password ? "#4ade80" : "#f87171"}
                  />
                  <Text
                    className={`ml-2 text-sm ${
                      confirmPassword === password
                        ? "text-green-600"
                        : "text-red-400"
                    }`}>
                    {confirmPassword === password
                      ? "Kata sandi sesuai"
                      : "Kata sandi tidak sesuai"}
                  </Text>
                </View>
              )}
            </View>

            {/* Checkbox TnC */}
            <View className="flex-row items-start  mt-4 px-5">
              <TouchableOpacity
                onPress={() => setIsChecked(!isChecked)}
                className={`w-5 h-5 rounded border ${
                  isChecked
                    ? "bg-[#3ED6C5] border-[#3ED6C5]"
                    : "border-gray-400"
                } items-center justify-center`}>
                {isChecked && <Text className="text-white text-xs">✓</Text>}
              </TouchableOpacity>

              <Text className="ml-3 text-black text-sm">
                Saya menyetujui Kebijakan Privasi yang berlaku
              </Text>
            </View>

            <View className="px-5 py-5">
              <PrimaryButton
                title="Daftar"
                onPress={handleRegister}
                disabled={!isFormValid()}
              />
            </View>
          </View>

          <View className="items-center">
            <View className="absolute bottom-0 left-0 right-0 h-52 rounded-b-3xl overflow-hidden z-[-1]">
              <Image
                source={require("../../assets/gradasi.png")}
                className="w-full h-full absolute"
                resizeMode="cover"
              />
            </View>

            <View className="items-center mt-3">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-sm px-3">Sudah punya akun?</Text>
                <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                  <Text className="text-sm text-blue-600 font-medium">
                    Silakan Login
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-sm px-3">Terdapat kendala?</Text>
                <TouchableOpacity
                  onPress={() => Alert.alert("Berhasil terhubung")}>
                  <Text className="text-sm text-blue-600 font-medium">
                    Silakan Hubungi Kami
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row items-center space-x-1 mt-4 pb-5">
              <Text className="text-xs text-gray-600">Powered by</Text>
              <Image
                source={require("../../assets/326.png")}
                className="w-4 h-4"
                resizeMode="contain"
              />
              <Text className="text-xs font-semibold text-orange-500">
                ADHIKSHA TRIBIXA
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
