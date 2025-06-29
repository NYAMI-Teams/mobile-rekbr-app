import { useRouter } from "expo-router";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import InputField from "@/components/InputField";
import { showToast } from "@/utils";
import { checkUser } from "@/utils/api/transaction";
import { forgotPassword } from "@/utils/api/auth";
import NavBackHeader from "@/components/NavBackHeader";

export default function MasukkanEmailScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailFound, setEmailFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBackBtn = () => {
    router.back();
  };

  const isEmailValid = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleBtnPress = async () => {
    setIsLoading(true);
    try {
      const resCheckUser = await checkUser(email);
      if (resCheckUser.data) {
        setEmailFound(true);
        const resForgotPassword = await forgotPassword(email);
        showToast("Email Ditemukan", resForgotPassword.message, "success");
        router.push({
          pathname: "/auth/otp",
          params: { email: resCheckUser.data.email, isFromResetPassword: true },
        });
      }
    } catch (err) {
      setEmailFound(false);
      showToast("Gagal", err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <NavBackHeader title={"Pulihkan Akses Akun Anda"} />

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Email Input */}
          <View style={styles.formWrapper}>
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
            {/* Email Validation Alert */}
            <View style={styles.alertRow}>
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
                style={[
                  styles.alertText,
                  {
                    color: isEmailValid()
                      ? emailFound
                        ? "#4ade80"
                        : "#fbbf24"
                      : "#f87171",
                  },
                ]}
              >
                {isEmailValid()
                  ? emailFound
                    ? "Email valid"
                    : "Check Email"
                  : "Email tidak valid"}
              </Text>
            </View>
          </View>

          {/* Button */}
          <View style={styles.buttonWrapper}>
            <PrimaryButton
              title="Kirim"
              onPress={handleBtnPress}
              disabled={!isEmailValid() || isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  formWrapper: {
    flex: 1,
    marginBottom: 16,
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertText: {
    marginLeft: 8,
    fontSize: 14,
  },
  buttonWrapper: {
    width: "100%",
    paddingBottom: 64,
  },
});
