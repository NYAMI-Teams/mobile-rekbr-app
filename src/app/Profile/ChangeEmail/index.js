import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import InputField from "@/components/InputField";
import { useState } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import { Feather } from "@expo/vector-icons";
import { getProfile, resendVerifyEmail } from "@/utils/api/auth";
import { showToast } from "@/utils";

export default function ChangeEmailScreen() {
  const router = useRouter();
  const [emailSaatIni, setEmailSaatIni] = useState("");
  const [emailBaru, setEmailBaru] = useState("");
  const [emailSaatIniValid, setEmailSaatIniValid] = useState(false);
  const [checkEmailSaatIniBtn, setCheckEmailSaatIniBtn] = useState(false);

  const handleBackBtn = () => {
    router.back();
  };

  const handleBtnPress = () => {
    if (checkEmailSaatIniBtn) {
      //Hit API OTP
      handleUpdateEmail();
    } else {
      handleVerifyEmailSaatIni(emailSaatIni);
    }
  };

  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleVerifyEmailSaatIni = async (text) => {
    try {
      const res = await getProfile();

      if (res.data.email == text) {
        setEmailSaatIniValid(true);
        setCheckEmailSaatIniBtn(true);
        showToast("Email Valid", "Email kamu valid", "success");
      } else {
        setEmailSaatIniValid(false);
        showToast("Email Tidak Valid", "Email saat ini salah", "error");
      }
    } catch (err) {
      setEmailSaatIniValid(false);
      showToast("Gagal", "Silahkan coba lagi", "error");
    }
  };

  const handleUpdateEmail = async () => {
    try {
      // BELUM FIX NUNGGU BE
      const res = await resendVerifyEmail(emailBaru);
      router.push({
        pathname: "/auth/otp",
        params: { email: res.data.email, isFromLogin: false },
      });
    } catch (err) {
      console.log(err);
      showToast("Gagal", "Silahkan coba lagi", "error");
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
          Ganti Email
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
          <>
            {/* Email Saat Ini */}
            <View className="relative mb-4">
              <InputField
                title="Masukkan Email Saat Ini"
                placeholder="Masukkan email kamu saat ini"
                value={emailSaatIni}
                onChangeText={setEmailSaatIni}
                keyboardType="email-address"
                editable={!emailSaatIniValid}
              />
              {/* Alert Validasi Email*/}
              <View className="flex-row items-center mt-2 mx-5">
                <Feather
                  name={
                    isEmailValid(emailSaatIni)
                      ? emailSaatIniValid
                        ? "check-circle"
                        : "info"
                      : "x-circle"
                  }
                  size={18}
                  color={
                    isEmailValid(emailSaatIni)
                      ? emailSaatIniValid
                        ? "#4ade80"
                        : "#fbbf24"
                      : "#f87171"
                  }
                />
                <Text
                  className={`ml-2 text-sm ${
                    isEmailValid(emailSaatIni)
                      ? emailSaatIniValid
                        ? "text-green-600"
                        : "text-yellow-600"
                      : "text-red-400"
                  }`}>
                  {isEmailValid(emailSaatIni)
                    ? emailSaatIniValid
                      ? "Email Ditemukan"
                      : "Check Email"
                    : "Email tidak valid"}
                </Text>
              </View>
            </View>
            {/* Email Baru */}
            {emailSaatIniValid && (
              <View className="relative mb-4">
                <InputField
                  title="Masukkan Email Baru"
                  placeholder="Masukkan email baru kamu"
                  value={emailBaru}
                  onChangeText={setEmailBaru}
                  keyboardType="email-address"
                />
                {/* Alert Validasi Email*/}
                <View className="flex-row items-center mt-2 mx-5">
                  <Feather
                    name={isEmailValid(emailBaru) ? "check-circle" : "x-circle"}
                    size={18}
                    color={isEmailValid(emailBaru) ? "#4ade80" : "#f87171"}
                  />
                  <Text
                    className={`ml-2 text-sm ${
                      isEmailValid(emailBaru)
                        ? "text-green-600"
                        : "text-red-400"
                    }`}>
                    {isEmailValid(emailBaru)
                      ? "Email valid"
                      : "Email tidak valid"}
                  </Text>
                </View>
              </View>
            )}
          </>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Button */}
      <View className="w-full px-4 py-4">
        <PrimaryButton
          title={`${
            checkEmailSaatIniBtn ? "Email Baru" : "Check Email Saat Ini"
          }`}
          onPress={handleBtnPress}
        />
      </View>
    </SafeAreaView>
  );
}
