// Welcoming.js

import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";
import { useRouter } from "expo-router";

export default function Welcoming() {
  const router = useRouter();

  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      {/* <SafeAreaView className="flex-1 bg-white"> */}
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log("Back pressed")}>
          <Ionicons name="chevron-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Know Your Customer</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content scrollable */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Image
          source={require("../../../assets/kyc-image.png")}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Kenapa Seller Wajib KYC Dulu Sebelumnya?
          </Text>
          <Text style={styles.paragraph}>
            Dengan KYC, kita pastiin penjual asli, bukan akun palsu atau penipu.
            Jadi, kamu bisa jualan tanpa takut ribet, dan pembeli juga yakin
            barangnya beneran nyata.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            Saya setuju data saya digunakan untuk verifikasi identitas demi
            keamanan transaksi.
          </Text>
        </View>

        <PrimaryButton
          title="Lanjut"
          onPress={() => router.push("/E-kyc/KYC_DataDiri")}
          disabled={!isChecked}
        />

        <View style={styles.footer}>
          <Image
            source={require("../../../assets/bni-logo.png")}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={styles.footerText}>
            Proses Registrasi KYC-nya dengan perantara BNI langsung. Gak ribet &
            pasti aman!
          </Text>
        </View>
      </View>
      {/* </SafeAreaView> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backArrow: {
    fontSize: 24,
    color: "#000",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  image: {
    width: "100%",
    height: 280,
    borderRadius: 16,
    marginBottom: 24,
    marginTop: 16,
  },
  textContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000",
  },
  paragraph: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 8, // rounded sesuai gambar
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#fff", // default background putih
  },
  checkboxChecked: {
    backgroundColor: "#3ED6C5", // hijau toska saat dicentang
    borderColor: "#3ED6C5", // border hilang / sama dengan background
  },
  checkmark: {
    color: "#fff", // centang putih
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 20,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  footerLogo: {
    width: 36, // diperbesar sesuai request
    height: 36,
    marginRight: 8,
  },
  footerText: {
    flex: 1,
    fontSize: 12,
    color: "#444",
    lineHeight: 16,
  },
});
