import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import PasswordChecklist from "../../components/PasswordChecklist";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
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
      name &&
      email &&
      isPasswordValid() &&
      password === confirmPassword &&
      isChecked
    );
  };

  const handleRegister = () => {
    console.log("Registering with:", { name, email, password });
  };

  return (
    <ScrollView className="flex-1 bg-white relative">
      <View className="bg-white items-center mb-2">
        <Image
          source={require("../../assets/header.png")}
          className="w-full h-[300px] rounded-b-2xl"
          resizeMode="cover"
        />
      </View>

      <View className="px-6 py-5">
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

          {/* Alert Validasi */}
          {confirmPassword.length > 0 && (
            <View className="flex-row items-center mt-2">
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
        <View className="flex-row items-center justify-center mt-4">
          <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            className={`w-5 h-5 rounded border ${
              isChecked ? "bg-blue-600 border-blue-600" : "border-gray-400"
            } items-center justify-center`}>
            {isChecked && <Text className="text-white text-xs">✓</Text>}
          </TouchableOpacity>

          <Text className="ml-3 text-gray-700 text-sm">
            Saya menyetujui Kebijakan Privasi yang berlaku
          </Text>
        </View>

        <PrimaryButton
          title="Masuk"
          onPress={handleRegister}
          disabled={!isFormValid()}
        />
      </View>

      <View className="items-center space-y-4">
        <View className="absolute bottom-0 left-0 right-0 h-52 rounded-b-3xl overflow-hidden z-[-1]">
          <Image
            source={require("../../assets/gradasi.png")}
            className="w-full h-full absolute"
            resizeMode="cover"
          />
        </View>

        <View className="items-center space-y-1 mt-3">
          <Text className="text-sm mb-4">
            Belum punya akun?
            <Text className="text-blue-600 font-medium">
              Silakan Registrasi
            </Text>
          </Text>
          <Text className="text-sm mb-2">
            Terdapat kendala?
            <Text className="text-blue-600 font-medium">
              Silakan Hubungi Kami
            </Text>
          </Text>
        </View>

        <View className="flex-row items-center space-x-1 mt-4">
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
  );
}
