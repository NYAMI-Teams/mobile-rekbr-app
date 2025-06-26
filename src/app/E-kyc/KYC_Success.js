import Success from "../../components/Success";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function SuccessKYC() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Success
        title="Pendaftaran KYC Selesai"
        subTitle="Kamu sudah siap untuk mulai transaksi! Sekarang kamu bisa menikmati pengalaman transaksi rekber yang lebih aman dan nyaman."
        fromRegister={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
