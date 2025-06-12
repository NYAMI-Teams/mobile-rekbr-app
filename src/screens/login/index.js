import React, { useState } from "react";
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
import { MaterialIcons } from "@expo/vector-icons"; // Tambahkan ini

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    if (email === "user@example.com" && password === "password123") {
      Alert.alert("Login Successful", "Welcome!");
      navigation.replace("Home");
    } else {
      Alert.alert("Login Failed", "Invalid email or password.");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header */}
      <View className="bg-white items-center mb-2">
        <Image
          source={require("../../../assets/header.png")}
          className="w-full h-[300px] rounded-b-2xl"
          resizeMode="cover"
        />
      </View>

      {/* Form */}
      <View className="px-6 py-5">
        {/* Email */}
        <View className="mb-4">
          <InputField
            title="Email Kamu, Yuk!"
            placeholder="email@kamu.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Password */}
        <View className=" mb-4">
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
              onPress={togglePasswordVisibility}
            >
              <MaterialIcons
                name={isPasswordVisible ? "visibility" : "visibility-off"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="self-end mt-2 mb-2">
            <Text className="text-blue-600 text-sm">Lupa Kata Sandi?</Text>
          </TouchableOpacity>

          {error ? (
            <Text className="text-red-500 text-sm text-center">{error}</Text>
          ) : null}
        </View>

        {/* Button & Links */}
        <View className="items-center mt-40 space-y-4">
          <View className="absolute bottom-0 left-0 right-0 h-52 rounded-b-3xl overflow-hidden z-[-1]">
            <Image
              source={require("../../../assets/gradasi.png")}
              className="w-full h-full absolute"
              resizeMode="cover"
            />
          </View>
          <PrimaryButton title="Masuk" onPress={handleLogin} />

          {/* Registrasi / Hubungi Kami */}
          <View className="items-center space-y1 mt-3">
            <Text className="text-sm mb-4">
              Belum punya akun?{" "}
              <Text className="text-blue-600 font-medium">
                Silakan Registrasi
              </Text>
            </Text>
            <Text className="text-sm mb-2">
              Terdapat kendala?{" "}
              <Text className="text-blue-600 font-medium">
                Silakan Hubungi Kami
              </Text>
            </Text>
          </View>

          {/* Powered by */}
          <View className="flex-row items-center space-x-1 mt-4">
            <Text className="text-xs text-gray-600">Powered by</Text>
            <Image
              source={require("../../../assets/326.png")}
              className="w-4 h-4"
              resizeMode="contain"
            />
            <Text className="text-xs font-semibold text-orange-500">
              ADHIKSHA TRIBIXA
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
