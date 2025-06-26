"use client";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useEffect, useState } from "react";
import RekeningKamu from "../../../components/RekeningKamu";
import PrimaryButton from "../../../components/PrimaryButton";
import InputField from "../../../components/InputField";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  checkUser,
  sellerCreateTransaction,
} from "../../../utils/api/transaction";
import { showToast } from "../../../utils";
import { Feather } from "@expo/vector-icons";
import NavBackHeader from "@/components/NavBackHeader";

export default function CreateRekber() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const bankData =
    typeof params.selectedBank === "string"
      ? JSON.parse(params.selectedBank)
      : params.selectedBank;
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState(0);
  const [isUserFound, setIsUserFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
  };

  const handleCheckUser = async () => {
    setIsLoading(true);
    try {
      await checkUser(email);
      setIsUserFound(true);
      showToast(
        "Pengguna Ditemukan",
        "Silakan lanjutkan untuk membuat transaksi",
        "success"
      );
    } catch (error) {
      showToast(
        "Pengguna Tidak Ditemukan",
        "Pastikan email yang dimasukkan benar",
        "error"
      );
      setIsUserFound(false);
    } finally {
      setIsLoading(false);
    }
  };

  const isEmailValid = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleToConfirmPage = () => {
    const payload = {
      email,
      itemName,
      itemPrice: Number(amount),
      withdrawalBankAccountId: bankData?.id,
      isInsurance: isChecked,
    };
    router.push({
      pathname: "/CreateTransaksi/CreateRekbr/GenerateVA",
      params: {
        payload: JSON.stringify(payload),
        bankData: JSON.stringify(bankData),
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <NavBackHeader title={"Buat Transaksi Rekber"} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" && 60}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.innerContainer}>
            <View style={styles.sectionContainer}>
              {bankData?.bankId !==
                "484f56b2-4f2e-49e6-aec3-6050f1b8e091" && (
                  <View style={styles.infoBox}>
                    <Icon name="info" size={16} color="#FBBF24" />
                    <Text style={styles.infoText}>
                      Pilih bank selain BNI? Biaya admin akan kami potong
                      otomatis dari pembayaran kamu, ya!
                    </Text>
                  </View>
                )}
              {/* Bank Account Section */}
              <RekeningKamu bankData={bankData} />

              {/* Form Section */}
              <View style={styles.formSection}>
                {/* Email Input */}
                <View style={styles.emailInputSection}>
                  <InputField
                    title="Masukkan Email Pembeli"
                    placeholder="Cari email pembeli barang kamu"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setIsUserFound(false);
                    }}
                    style={styles.fullWidth}
                  />
                  {/* Alert Validasi Email*/}
                  {email.length > 0 && (
                    <View style={styles.emailValidationRow}>
                      <Feather
                        name={
                          isEmailValid()
                            ? isUserFound
                              ? "check-circle"
                              : "info"
                            : "x-circle"
                        }
                        size={18}
                        color={
                          isEmailValid()
                            ? isUserFound
                              ? "#4ade80"
                              : "#fbbf24"
                            : "#f87171"
                        }
                      />
                      <Text
                        style={[
                          styles.emailValidationText,
                          isEmailValid()
                            ? isUserFound
                              ? styles.textGreen
                              : styles.textYellow
                            : styles.textRed,
                        ]}
                      >
                        {isEmailValid()
                          ? isUserFound
                            ? "Pengguna ditemukan"
                            : "Tekan cari untuk menemukan pengguna"
                          : "Email tidak valid"}
                      </Text>
                    </View>
                  )}
                  <View style={styles.emailButtonRow}>
                    <TouchableOpacity
                      onPress={handleCheckUser}
                      style={[
                        styles.searchButton,
                        !isEmailValid()
                          ? styles.searchButtonDisabled
                          : styles.searchButtonEnabled,
                      ]}
                      disabled={!isEmailValid()}
                    >
                      <Icon name="search" size={16} color="white" />
                      <Text style={styles.searchButtonText}>Cari</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Item Name Input */}
                <InputField
                  title="Nama Barang"
                  placeholder="Masukkan nama barang yang kamu jual"
                  value={itemName}
                  onChangeText={setItemName}
                  style={styles.fullWidth}
                />

                {/* Amount Input */}
                <InputField
                  title="Nominal Barang"
                  placeholder="Tuliskan harga barang yang kamu jual (Rupiah)"
                  value={amount}
                  renderValue={(amount) => {
                    if (!amount) return "";
                    const number = parseInt(amount, 10);
                    return new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(number);
                  }}
                  onChangeText={(text) => {
                    const cleanedText = text.replace(/[^0-9]/g, "");
                    if (cleanedText > 10000000) {
                      setErrorText("Maksimum nominal adalah Rp10.000.000");
                      return;
                    }
                    setErrorText("");
                    setAmount(cleanedText);
                  }}
                  style={styles.fullWidth}
                  keyboardType="numeric"
                  inputMode="numeric"
                  errorText={errorText}
                />

                {/* Insurance Checkbox */}
                <View style={styles.checkboxRow}>
                  <TouchableOpacity
                    onPress={handleCheckboxPress}
                    style={[
                      styles.checkbox,
                      isChecked
                        ? styles.checkboxChecked
                        : styles.checkboxUnchecked,
                    ]}
                  >
                    {isChecked && (
                      <Text style={styles.checkboxCheckmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>
                    Gunakan Asuransi Pengiriman BNI Life (0,2%)
                  </Text>
                  <TouchableOpacity
                    onPress={() => console.log("Info Asuransi")}
                    style={styles.checkboxInfoButton}
                  >
                    <Icon name="info" size={16} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Lanjut"
              onPress={handleToConfirmPage}
              disabled={
                !isUserFound || isLoading || !itemName || !amount || !email
              }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  keyboardAvoiding: {
    flex: 1,
    width: "100%",
    padding: 12,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: "flex-start",
    width: "100%",
    gap: 8,
  },
  sectionContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 0,
    position: "relative",
    alignSelf: "stretch",
    width: "100%",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2D3",
    padding: 8,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  infoText: {
    color: "#262626",
    fontSize: 14,
    fontWeight: "400",
  },
  formSection: {
    flexDirection: "column",
    width: "100%",
    gap: 16,
  },
  emailInputSection: {
    width: "100%",
    gap: 8,
  },
  fullWidth: {
    width: "100%",
  },
  emailValidationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginHorizontal: 20,
    width: "100%",
    marginBottom: 8,
  },
  emailValidationText: {
    marginLeft: 8,
    fontSize: 14,
  },
  textGreen: {
    color: "#4ade80",
  },
  textYellow: {
    color: "#fbbf24",
  },
  textRed: {
    color: "#f87171",
  },
  emailButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  searchButton: {
    flexDirection: "row",
    height: 34,
    width: 80,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  searchButtonEnabled: {
    backgroundColor: "#000",
  },
  searchButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  checkboxRow: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#3ED6C5",
    borderColor: "#3ED6C5",
  },
  checkboxUnchecked: {
    borderColor: "#9ca3af",
  },
  checkboxCheckmark: {
    color: "#fff",
    fontSize: 16,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#000",
    fontWeight: "400",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxInfoButton: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 32,
    paddingHorizontal: 16,
  },
});