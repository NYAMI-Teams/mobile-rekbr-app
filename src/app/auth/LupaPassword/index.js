import { useRouter } from "expo-router";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import { KeyboardAvoidingView } from "react-native";
import InputField from "@/components/InputField";
import { Ionicons } from "@expo/vector-icons";
import { showToast } from "@/utils";
import { checkUser } from "@/utils/api/transaction";
import { forgotPassword } from "@/utils/api/auth";

export default function MasukkanEmailScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailFound, setEmailFound] = useState(false);

  const handleBackBtn = () => {
    router.back();
  };

  const isEmailValid = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleBtnPress = async () => {
    try {
      const resCheckUser = await checkUser(email);
      if (resCheckUser.data) {
        setEmailFound(true);
        const resForgotPassword = await forgotPassword(email);
        showToast("Email Ditemukan", resForgotPassword.message, "success");
        //Next Router ke OTP
        router.push({
          pathname: "/auth/otp",
          params: { email: resCheckUser.data.email, isFromResetPassword: true },
        });
      }
    } catch (err) {
      setEmailFound(false);
      showToast("Gagal", err.message, "error");
    }
  };

  return (
    <View className="bg-white flex-1">
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
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-4 pt-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Email Kamu */}
          <View className="flex-1 mb-4">
            <InputField
              title="Masukkan Email"
              placeholder="Masukkan email kamu"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailFound(false);
              }}
              keyboardType="email-address"
            />
            {/* Alert Validasi Email*/}
            <View className="flex-row items-center mt-2 mx-5">
              <Feather
                name={
                  isEmailValid()
                    ? emailFound
                      ? "check-circle"
                      : "info"
                    : "x-circle"
                }
                size={18}
                color={
                  isEmailValid()
                    ? emailFound
                      ? "#4ade80"
                      : "#fbbf24"
                    : "#f87171"
                }
              />
              <Text
                className={`ml-2 text-sm ${isEmailValid()
                  ? emailFound
                    ? "text-green-600"
                    : "text-yellow-600"
                  : "text-red-400"
                  }`}>
                {isEmailValid()
                  ? emailFound
                    ? "Email valid"
                    : "Check Email"
                  : "Email tidak valid"}
              </Text>
            </View>
          </View>
          {/* Button */}
          <View className="w-full pb-16">
            <PrimaryButton
              title="Kirim"
              onPress={handleBtnPress}
              disabled={!isEmailValid()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    </View>
  );
}
