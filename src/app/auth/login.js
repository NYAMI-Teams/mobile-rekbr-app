import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { login } from "../../utils/api/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // development purposes, remove this in production
    setEmail("buyer@gmail.com");
    setPassword("pass123");
  }, [])

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = () => {

    setError(false);
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    
    // Call the login API
    login(email, password).then((res) => {
      Alert.alert("Login Successful", "Welcome back!");
    }).catch((err) => {
      console.error("Login error:", err);
      setError(true);
      setErrorMsg("Login failed. Please try again.");
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <SafeAreaView className="bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="justify-between">
          {/* Header */}
          <View className="bg-white items-center">
            <Image
              source={require("../../assets/header.png")}
              className="w-full h-[300px] rounded-b-2xl"
              resizeMode="cover"
            />
          </View>

          {/* Form */}
          <View className="py-5 justify-between">
            {/* Email */}
            <View className="mb-4 mt-5">
              <InputField
                title="Email Kamu, Yuk!"
                placeholder="email@kamu.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            {/* Password */}
            <View className=" mb-4 mt-5">
              {/* <Text className="mb-2 text-base text-black">Kata Sandi Rekbr</Text> */}
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
              </View>

              <TouchableOpacity className="self-end mt-2 mb-2 px-5">
                <Text className="text-blue-600 text-sm">Lupa Kata Sandi?</Text>
              </TouchableOpacity>

              {error ? (
                <Text className="text-red-500 text-sm text-center">
                  {errorMsg}
                </Text>
              ) : null}
            </View>

            {/* Button & Links */}
            <View className="items-center mt-10 space-y-4">
              <View className="absolute bottom-0 left-0 right-0 h-52 rounded-b-3xl overflow-hidden z-[-1]">
                <Image
                  source={require("../../assets/gradasi.png")}
                  className="w-full h-full absolute"
                  resizeMode="cover"
                />
              </View>
              <View className="px-5 py-5 w-full">
                <PrimaryButton title="Masuk" onPress={handleLogin} />
              </View>

              {/* Registrasi / Hubungi Kami */}
              <View className="items-center mt-3">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-sm px-3">Belum punya akun?</Text>
                  <TouchableOpacity
                    onPress={() => router.replace("/auth/register")}>
                    <Text className="text-sm text-blue-600 font-medium">
                      Silakan Registrasi
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

              {/* Powered by */}
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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
