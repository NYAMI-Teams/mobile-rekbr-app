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
} from "react-native";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProfile, login, savePushToken } from "../../utils/api/auth";
import { showToast } from "../../utils";
import { setAccessToken, setProfileStore } from "../../store";
import { registerForPushNotificationsAsync } from "@/utils/notifications";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // development (DELETE)
    // setEmail("danilardi8@gmail.com");
    // setPassword("Mobilmerah123#");
    // setIsPasswordVisible(true);
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    setError(false);
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Silahkan masukkan email dan password.");
      return;
    }
    setIsLoading(true);

    try {
      const res = await login(email, password);
      showToast(
        "Login Berhasil",
        "Selamat datang kembali, " + email + "!",
        "success"
      );
      await setAccessToken(res?.data?.accessToken);
    } catch (err) {
      setError(true);
      setErrorMsg("Email atau kata sandi salah");
      showToast("Login Gagal", "Silahkan coba lagi", "error");
      setIsLoading(false);
      return;
    }

    try {
      const pushToken = await registerForPushNotificationsAsync();

      // ✅ Tambahkan validasi format token di sini
      if (!pushToken || !pushToken.startsWith("ExponentPushToken")) {
        console.warn("Push token tidak valid:", pushToken);
      } else {
        await savePushToken(pushToken);
        console.log("Push token saved:", pushToken);
      }
    } catch (err) {
      console.warn("Gagal simpan push token:", err);
    }

    try {
      await getUserProfile();
    } catch (err) {
      console.warn("Gagal ambil profil:", err);
      showToast("Gagal", "Gagal mengambil data profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserProfile = async () => {
    try {
      const res = await getProfile();
      await setProfileStore(res?.data);
      router.replace("/");
    } catch (error) {
      showToast(
        "Gagal",
        "Gagal mengambil data profile. Silahkan coba lagi.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className='bg-white flex-1'>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" && 60}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <View className='flex-1'>
            {/* Header */}
            <View className='bg-white items-center'>
              <Image
                source={require("../../assets/header.png")}
                className='w-full h-[300px] rounded-b-2xl'
                resizeMode='cover'
              />
            </View>

            {/* Form */}
            <View className='mx-5 gap-4 mt-6 flex-1'>
              {/* Email */}
              <View className=''>
                <InputField
                  title='Email Kamu, Yuk!'
                  placeholder='email@kamu.com'
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                />
              </View>

              {/* Password */}
              <View className=''>
                {/* <Text className="mb-2 text-base text-black">Kata Sandi Rekbr</Text> */}
                <View className='relative mb-4'>
                  <InputField
                    title='Kata Sandi Rekbr'
                    placeholder='Masukkan kata sandi kamu'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    isPassword={true}
                    inputClassName='pr-12'
                  />

                  <TouchableOpacity
                    className='absolute top-11 right-10'
                    onPress={togglePasswordVisibility}
                  >
                    <MaterialIcons
                      name={isPasswordVisible ? "visibility" : "visibility-off"}
                      size={22}
                      color='#666'
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  className='self-end mt-2 px-5'
                  onPress={() => router.push("/auth/LupaPassword")}
                >
                  <Text className='text-blue-600 text-sm'>
                    Lupa Kata Sandi?
                  </Text>
                </TouchableOpacity>

                {error && (
                  <Text className='text-red-500 text-sm text-center'>
                    {errorMsg}
                  </Text>
                )}
              </View>
            </View>
            {/* Button & Links */}
            <View className='items-center'>
              <View className='absolute bottom-0 left-0 right-0 h-52 rounded-b-3xl overflow-hidden z-[-1]'>
                <Image
                  source={require("../../assets/gradasi.png")}
                  className='w-full h-full absolute'
                  resizeMode='cover'
                />
              </View>
              <View className='px-5 py-5 w-full'>
                <PrimaryButton
                  title='Masuk'
                  onPress={handleLogin}
                  disabled={isLoading || !email || !password}
                />
              </View>

              {/* Registrasi / Hubungi Kami */}
              <View className='items-center mt-3'>
                <View className='flex-row items-center justify-between mb-4'>
                  <Text className='text-sm px-3'>Belum punya akun?</Text>
                  <TouchableOpacity
                    onPress={() => router.replace("/auth/register")}
                  >
                    <Text className='text-sm text-blue-600 font-medium'>
                      Silakan Registrasi
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className='flex-row items-center justify-between mb-4'>
                  <Text className='text-sm px-3'>Terdapat kendala?</Text>
                  <TouchableOpacity
                    onPress={() => Alert.alert("Berhasil terhubung")}
                  >
                    <Text className='text-sm text-blue-600 font-medium'>
                      Silakan Hubungi Kami
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Powered by */}
              <View className='flex-row items-center space-x-1 mt-4 mb-5'>
                <Text className='text-xs text-gray-600'>Powered by</Text>
                <Image
                  source={require("../../assets/326.png")}
                  className='w-4 h-4'
                  resizeMode='contain'
                />
                <Text className='text-xs font-semibold text-orange-500'>
                  ADHIKSHA TRIBIXA
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
