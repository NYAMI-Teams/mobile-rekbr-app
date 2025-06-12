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
import { MaterialIcons } from "@expo/vector-icons";
import ProgressBar from "../../components/ProgressBar";

export default function Welcoming() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log("Back pressed")}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Know Your Customer</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content scrollable */}
      <ProgressBar
        currentStep={2}
        steps={["Data diri", "Lainnya", "Lampiran", "Pratinjau"]}
      />

      <View style={styles.information}>
        <Image
          source={require("../../../assets/admin 1.png")}
          style={styles.logo_admin}
        />
        <Text style={styles.informationText}>
          Harap tinjau kembali dan pastikan seluruh data kamu sebelum
          melanjutkan, ya!
        </Text>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            style={[styles.checkbox, isChecked && styles.checkedCheckbox]}
          >
            {isChecked && (
              <MaterialIcons name="check" size={18} color="white" />
            )}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            Saya menyatakan bahwa seluruh data pribadi dan pekerjaan yang saya
            isi adalah benar dan sesuai dengan peraturan yang berlaku.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isChecked ? "#000" : "#aaa" },
          ]}
          onPress={() => console.log("Lanjut pressed")}
          disabled={!isChecked}
        >
          <Text style={styles.buttonText}>Lanjut</Text>
        </TouchableOpacity>

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
    flex: 1,
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
});
