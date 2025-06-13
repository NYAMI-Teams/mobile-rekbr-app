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
import ProgressBar from "../../components/ProgressBar";

export default function TransactionPage() {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ProgressBar
        currentStep={0}
        steps={["Transfer", "Dikemas", "Dikirim", "Diterima"]}
      />

      <View style={{padding: 12, margin: 12, backgroundColor: "#EDFBFA", borderRadius: 12}}>
        <Text style={{fontSize: 16, marginBottom: 12}}>Virtual Account</Text>
        <View style={{flexDirection: "row"}}>
            <Text style={{fontSize: 16, fontWeight: "bold"}}>08643521</Text>
            <Ionicons name="copy" size={20} style={{marginLeft: 4, color: "#C2C2C2"}} />
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
});
