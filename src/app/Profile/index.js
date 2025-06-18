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
import InputField from "../../components/InputField";
import { useState } from "react";
import { showToast } from "../../utils";
import {
  postCheckKataSandiSaatIniValid,
  postChangePassword,
} from "../../utils/api/auth";
import PrimaryButton from "../../components/PrimaryButton";
import PasswordChecklist from "../../components/PasswordChecklist";
import BuyerKonfirmasi from "../../components/BuyerKonfirmasi";

export default function Profile() {
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

  const [isStillKataSandiSaatIniScreen, setIsStillKataSandiSaatIniScreen] =
    useState(true);
  const [checkKataSandiSaatIniValid, setCheckKataSandiSaatIniValid] =
    useState(false);
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

  const handleCheckKataSandiSaatIniValid = async () => {
    try {
      // BELUM FIX NUNGGU BE
      const response = await postCheckKataSandiSaatIniValid(kataSandiSaatIni);
      setCheckKataSandiSaatIniValid(response.data);
      setIsStillKataSandiSaatIniScreen(false);
    } catch (error) {
      showToast("Gagal", "Password tidak valid", "error");
    }
  };

  const handleBtnPress = () => {
    if (isStillKataSandiSaatIniScreen) {
      handleCheckKataSandiSaatIniValid();
    } else {
      setShowPopup(true);
      isPasswordValid();
    }
  };

  const handleBackBtn = () => {
    if (!isStillKataSandiSaatIniScreen) {
      setIsStillKataSandiSaatIniScreen(true);
      setCheckKataSandiSaatIniValid(false);
    } else {
      router.back();
    }
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    try {
      // BELUM FIX NUNGGU BE
      await postChangePassword(kataSandiBaru, konfirmasiKataSandiBaru);
      setShowPopup(false);
      showToast("Berhasil", "Password valid", "success");
      setIsStillKataSandiSaatIniScreen(true);
      router.replace("/");
    } catch (error) {
      showToast("Gagal", "Password tidak valid", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
        style={{ flex: 1 }}>
        <ScrollView
          className="flex-1 w-full px-4 mt-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          hideKeyboardOnScroll={true}
          keyboardDismissMode="on-drag">
          {isStillKataSandiSaatIniScreen ? (
            <View className="mt-4">
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
          ) : (
            <>
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
                      className={`ml-2 text-sm ${
                        konfirmasiKataSandiBaru === kataSandiBaru
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
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Button */}
      <View className="w-full px-4 py-4">
        <PrimaryButton
          title="Kirim"
          onPress={handleBtnPress}
          disabled={
            isLoading || isStillKataSandiSaatIniScreen
              ? false
              : !isPasswordValid()
          }
        />
      </View>

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
    </SafeAreaView>
  );
}
