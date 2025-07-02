import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { ChevronLeft } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function HomeDispute() {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const router = useRouter();
  const { transactionId, sellerEmail } = useLocalSearchParams();

  const complaints = [
    {
      label: "Barang belum sampai atau kesasar",
      icon: require("../../assets/belumsampai.png"),
      route: "/Complaint/Create",
    },
    {
      label: "Barang rusak",
      icon: require("../../assets/barangrusak.png"),
      route: "/dispute/BarangRusak/pilihKomplain",
    },
    {
      label: "Tidak sesuai deskripsi",
      icon: require("../../assets/tidaksesuai.png"),
      // route: "/dispute/TidakSesuai",
    },
    {
      label: "Masalah atau komplain lainnya",
      icon: require("../../assets/komplain.png"),
      // route: "/dispute/KomplainLainnya",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}>
            <ChevronLeft size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Permintaan Komplain Buyer</Text>
        </View>

        {/* Informasi Admin */}
        <View style={styles.infoBox}>
          <Image
            source={require("../../assets/admin1.png")}
            style={styles.infoIcon}
            resizeMode="contain"
          />
          <Text style={styles.infoText}>
            Harap tinjau kembali dan pastikan seluruh data kamu sebelum
            melanjutkan, ya!
          </Text>
        </View>

        {/* Info Email */}
        <Text style={styles.emailLabel}>
          Diskusi dengan
          <Text style={styles.emailValue}> {sellerEmail}</Text>
        </Text>
        <Text style={styles.emailNote}>
          Cari resolusi yang lebih cepat, diskusikan dulu kendalamu dengan
          penjual
        </Text>

        {/* Button Email */}
        {/* <View style={styles.buttonContainer}>
          <PrimaryButton
            onPress={() => router.push("../(tabs)/complaint")}
            title="Diskusi via email dengan penjual"
          />
        </View> */}

        {/* Opsi Komplain */}
        <Text style={styles.optionLabel}>
          Pilih masalah untuk ajukan komplain
        </Text>
        <View style={styles.optionGrid}>
          {complaints.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionCard}
              onPress={() => {
                if (item.route) {
                  router.push({
                    pathname: `${item.route}`,
                    params: { id: transactionId },
                  });
                } else {
                  Alert.alert("Maaf", "Fitur sedang dalam perbaikan");
                }
              }}>
              <Image
                source={item.icon}
                style={styles.optionImage}
                resizeMode="contain"
              />
              <Text style={styles.optionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Terdapat kendala?
          <Text style={styles.footerLink}> Silahkan Hubungi Kami</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  headerContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  backBtn: {
    position: "absolute",
    left: 0,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFAEB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
  },
  emailLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
  },
  emailValue: {
    fontWeight: "700",
  },
  emailNote: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  optionCard: {
    width: "48%",
    height: 160,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionImage: {
    width: 40,
    height: 40,
  },
  optionText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    color: "#000",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  footerLink: {
    color: "#3B82F6",
    fontWeight: "500",
  },
});
