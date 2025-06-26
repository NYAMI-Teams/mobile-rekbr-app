import Success from "../../components/Success";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function SuccessLogin() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Success
        title="Pendaftaran Akun Selesai"
        subTitle="Kamu Seller atau bukan? Biar bisa create Rekber, jangan lupa KYC dulu, ya!"
        fromRegister={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
