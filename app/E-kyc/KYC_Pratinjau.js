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
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import ProgressBar from "../../src/components/ProgressBar";
import PrimaryButton from "../../src/components/PrimaryButton";
import DropDownField from "../../src/components/DropDownField";
import { useRouter } from "expo-router";

export default function Pratinjau() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Know Your Customer</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content scrollable */}
      <ProgressBar
        currentStep={3}
        steps={["Data diri", "Lainnya", "Lampiran", "Pratinjau"]}
      />

      <View style={styles.information}>
        <Image
          source={require("../../assets/admin1.png")}
          style={styles.logo_admin}
        />
        <Text style={styles.informationText}>
          Harap tinjau kembali dan pastikan seluruh data kamu sebelum
          melanjutkan, ya!
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}>
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Data Diri</Text>
            <Ionicons
              name={"chevron-down-circle"}
              size={24}
              color={"#49DBC8"}
            />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Lainnya</Text>
            <Ionicons
              name={"chevron-down-circle"}
              size={24}
              color={"#49DBC8"}
            />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Lampiran</Text>
            <Ionicons
              name={"chevron-down-circle"}
              size={24}
              color={"#49DBC8"}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            style={[styles.checkbox, isChecked && styles.checkedCheckbox]}>
            {isChecked && (
              <MaterialIcons name="check" size={18} color="white" />
            )}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            Saya menyatakan bahwa seluruh data pribadi dan pekerjaan yang saya
            isi adalah benar dan sesuai dengan peraturan yang berlaku.
          </Text>
        </View>

        <PrimaryButton
          title="Lanjut"
          onPress={() => router.push("/E-kyc/KYC_Success")}
          disabled={!isChecked}
        />

        <View style={styles.footer}>
          <Image
            source={require("../../assets/bni-logo.png")}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={styles.footerText}>
            Proses Registrasi KYC-nya dengan perantara BNI langsung. Gak ribet &
            pasti aman!
          </Text>
        </View>
      </View>
    </SafeAreaView>
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
  information: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 24,
  },
  logo_admin: {
    width: 20,
    height: 20,
    marginRight: 16,
  },
  informationText: {
    flex: 1,
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
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#4CD7D0",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  checkedCheckbox: {
    backgroundColor: "#4CD7D0",
    borderColor: "#4CD7D0",
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    marginLeft: 12,
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
    width: 40,
    marginRight: 8,
  },
  footerText: {
    flex: 1,
    fontSize: 12,
    color: "#444",
    lineHeight: 16,
  },
  content: {
    marginTop: 16,
    marginHorizontal: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
    paddingVertical: 14,
  },
});
