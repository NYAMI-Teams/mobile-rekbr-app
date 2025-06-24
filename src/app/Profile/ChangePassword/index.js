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
import { useRouter } from "expo-router";
import InputField from "@/components/InputField";
import { useState } from "react";
import { showToast } from "@/utils";
import { changePassword } from "@/utils/api/auth";
import PrimaryButton from "@/components/PrimaryButton";
import PasswordChecklist from "@/components/PasswordChecklist";
import BuyerKonfirmasi from "@/components/BuyerKonfirmasi";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [kataSandiSaatIni, setKataSandiSaatIni] = useState("");
  const [kataSandiBaru, setKataSandiBaru] = useState("");
  const [konfirmasiKataSandiBaru, setKonfirmasiKataSandiBaru] = useState("");
  const [isKataSandiSaatIniVisible, setIsKataSandiSaatIniVisible] =
    useState(false);
  const [isKataSandiBaruVisible, setIsKataSandiBaruVisible] = useState(false);
  const [
    isKonfirmasiKataSandiBaruVisible,
    setIsKonfirmasiKataSandiBaruVisible,
  ] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleKataSandiSaatIniVisibility = () => {
    setIsKataSandiSaatIniVisible(!isKataSandiSaatIniVisible);
  };

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
    if (
      !isPasswordValid() ||
      !kataSandiSaatIni ||
      !konfirmasiKataSandiBaru ||
      !kataSandiBaru
    ) {
      showToast("Gagal", "Password tidak valid", "error");
      return;
    }

    try {
      await changePassword(kataSandiSaatIni, konfirmasiKataSandiBaru);
      setShowPopup(false);
      showToast("Berhasil", "Password valid", "success");
      router.replace("/");
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
          Ganti Kata Sandi
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === 'ios' && 60}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="px-4 mt-5"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-4 flex-1">
            <View className="relative mb-4">
              <InputField
                title="Kata Sandi Rekbr Saat Ini"
                placeholder="Masukkan kata sandi kamu saat ini"
                value={kataSandiSaatIni}
                onChangeText={setKataSandiSaatIni}
                secureTextEntry={!isKataSandiSaatIniVisible}
                isPassword={true}
                inputClassName="pr-12"
              />

              <TouchableOpacity
                className="absolute top-11 right-10"
                onPress={toggleKataSandiSaatIniVisibility}>
                <MaterialIcons
                  name={
                    isKataSandiSaatIniVisible ? "visibility" : "visibility-off"
                  }
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Password */}
            <View className="relative mb-4">
              <InputField
                title="Kata Sandi Rekbr"
                placeholder="Masukkan kata sandi kamu"
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
            <View className="relative mb-4">
              <InputField
                title="Konfirmasi Kata Sandi Rekbr Kamu"
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
          <View className="w-full py-4 mb-16">
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
          title="Pastikan semua data di form sudah benar dan lengkap sebelum kamu kirim. Cek lagi, ya!"
          btn1="Kembali"
          btn2="Konfirmasi"
        />
      )}
    </View>
  );
}
