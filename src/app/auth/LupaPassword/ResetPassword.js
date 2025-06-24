import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import InputField from "@/components/InputField";
import { useState } from "react";
import { showToast } from "@/utils";
import { resetPassword } from "@/utils/api/auth";
import PrimaryButton from "@/components/PrimaryButton";
import PasswordChecklist from "@/components/PasswordChecklist";
import BuyerKonfirmasi from "@/components/BuyerKonfirmasi";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [kataSandiBaru, setKataSandiBaru] = useState("");
  const [konfirmasiKataSandiBaru, setKonfirmasiKataSandiBaru] = useState("");
  const [isKataSandiBaruVisible, setIsKataSandiBaruVisible] = useState(false);
  const [
    isKonfirmasiKataSandiBaruVisible,
    setIsKonfirmasiKataSandiBaruVisible,
  ] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleKataSandiBaruVisibility = () => {
    setIsKataSandiBaruVisible(!isKataSandiBaruVisible);
  };

  const toggleKonfirmasiKataSandiBaruVisibility = () => {
    setIsKonfirmasiKataSandiBaruVisible(!isKonfirmasiKataSandiBaruVisible);
  };

  const isPasswordValid = () => {
    return (
      konfirmasiKataSandiBaru.length >= 8 &&
      /[a-z]/.test(konfirmasiKataSandiBaru) &&
      /[A-Z]/.test(konfirmasiKataSandiBaru) &&
      /[0-9]/.test(konfirmasiKataSandiBaru) &&
      /[^a-zA-Z0-9]/.test(konfirmasiKataSandiBaru)
    );
  };

  const handleBtnPress = () => {
    if (isPasswordValid()) {
      setShowPopup(true);
    }
  };

  const handleBackBtn = () => {
    router.back();
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    if (!isPasswordValid() || !konfirmasiKataSandiBaru || !kataSandiBaru) {
      showToast("Gagal", "Password tidak valid", "error");
      return;
    }

    try {
      const res = await resetPassword(email, konfirmasiKataSandiBaru);
      setShowPopup(false);
      showToast("Berhasil", res?.message, "success");
      router.replace("/auth/login");
    } catch (error) {
      showToast("Gagal", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View className="flex-row justify-between items-center w-full px-4 pt-4">
        <TouchableOpacity onPress={handleBackBtn}>
          <Ionicons name="chevron-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-[16px] font-semibold text-black">
          Pulihkan Akses Akun Anda
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="flex-1 w-full px-4 mt-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          hideKeyboardOnScroll={true}
          keyboardDismissMode="on-drag">
          <View className="mt-4 gap-4 flex-1">
            {/* Password */}
            <View className="relative">
              <InputField
                title="Kata Sandi Baru Rekbr"
                placeholder="Masukkan kata sandi baru kamu"
                value={kataSandiBaru}
                onChangeText={setKataSandiBaru}
                secureTextEntry={!isKataSandiBaruVisible}
                isPassword={true}
                inputClassName="pr-12"
              />

              <TouchableOpacity
                className="absolute top-11 right-10"
                onPress={toggleKataSandiBaruVisibility}>
                <MaterialIcons
                  name={
                    isKataSandiBaruVisible ? "visibility" : "visibility-off"
                  }
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
              <PasswordChecklist password={kataSandiBaru} />
            </View>

            {/* Confirm Password */}
            <View className="relative">
              <InputField
                title="Konfirmasi Kata Sandi Baru Rekbr"
                placeholder="Pastikan sama, ya!"
                value={konfirmasiKataSandiBaru}
                onChangeText={setKonfirmasiKataSandiBaru}
                secureTextEntry={!isKonfirmasiKataSandiBaruVisible}
                isPassword={true}
                inputClassName="pr-12"
              />

              <TouchableOpacity
                className="absolute top-11 right-10"
                onPress={toggleKonfirmasiKataSandiBaruVisibility}>
                <MaterialIcons
                  name={
                    isKonfirmasiKataSandiBaruVisible
                      ? "visibility"
                      : "visibility-off"
                  }
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>

              {/* Alert Validasi */}
              {konfirmasiKataSandiBaru.length > 0 && (
                <View className="flex-row items-center mt-2 mx-5">
                  <Feather
                    name={
                      konfirmasiKataSandiBaru === kataSandiBaru
                        ? "check-circle"
                        : "x-circle"
                    }
                    size={18}
                    color={
                      konfirmasiKataSandiBaru === kataSandiBaru
                        ? "#4ade80"
                        : "#f87171"
                    }
                  />
                  <Text
                    className={`ml-2 text-sm ${konfirmasiKataSandiBaru === kataSandiBaru
                      ? "text-green-600"
                      : "text-red-400"
                      }`}>
                    {konfirmasiKataSandiBaru === kataSandiBaru
                      ? "Kata sandi sesuai"
                      : "Kata sandi tidak sesuai"}
                  </Text>
                </View>
              )}
            </View>
          </View>
          {/* Button */}
          <View className="w-full pb-16">
            <PrimaryButton
              title="Kirim"
              onPress={handleBtnPress}
              disabled={isLoading ? false : !isPasswordValid()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>


      {showPopup && (
        <BuyerKonfirmasi
          onClose={() => setShowPopup(false)}
          onBtn2={handleChangePassword}
          onBtn1={() => setShowPopup(false)}
          title="Pastikan semuanya sudah benar yaa sebelum kamu kirim!"
          btn1="Kembali"
          btn2="Kirim"
        />
      )}
    </View>
  );
}
