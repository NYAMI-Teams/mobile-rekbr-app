// RegisterSuccess.js

import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

//Kamu Seller atau bukan? Biar bisa create Rekber,{"\n"}jangan lupa KYC dulu, ya!

export default function RegisterSuccess({ title, subTitle, fromRegister }) {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Logo Rekbr + by BNI */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/logo-rekbr.png")}
          style={styles.logoRekbr}
          resizeMode="contain"
        />
      </View>

      {/* Content wrapper */}
      <View style={styles.contentWrapper}>
        {/* Image + Title Group */}
        <View style={styles.imageAndTitleWrapper}>
          <Image
            source={require("../../assets/illustration-berhasil.png")}
            style={styles.illustration}
            resizeMode="contain"
          />

          <Text style={styles.successTitle}>{title}</Text>
        </View>

        {/* Success Desc */}
        <Text style={styles.successDesc}>{subTitle}</Text>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {fromRegister ? (
          <>
            <TouchableOpacity
              style={styles.buttonLight}
              onPress={() => console.log("Silakan Masuk pressed")}>
              <Text style={styles.buttonLightText}>Silakan Masuk</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonDark}
              onPress={() => router.push("/E-kyc/KYC_Intro")}>
              <Text style={styles.buttonDarkText}>Mulai KYC Sekarang</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.buttonDark}
            onPress={() => router.replace("/")}>
            <Text style={styles.buttonDarkText}>Beranda</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  logoRekbr: {
    width: 120,
    height: 48,
    marginRight: 8,
  },
  byBNI: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
  },
  logoLine: {
    alignSelf: "center",
    width: 40,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3ED6C5",
    marginBottom: 16,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  imageAndTitleWrapper: {
    alignItems: "center",
    marginBottom: 8, // jarak ke desc bawah
  },
  illustration: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    marginBottom: 4, // <= ini supaya tulisan "Pendaftaran Akun Selesai" makin dekat
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
  successDesc: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  bottomSection: {
    paddingBottom: 16,
  },
  buttonLight: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#F2FBFA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  buttonLightText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDark: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDarkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
