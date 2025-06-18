"use client";
import RekeningKamu from "../../components/RekeningKamu";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useEffect, useState } from "react";
import clsx from "clsx";
import PrimaryButton from "../../components/PrimaryButton";
import InputField from "../../components/InputField";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  checkUser,
  sellerCreateTransaction,
} from "../../utils/api/transaction";
import { showToast } from "../../utils";
import { Feather } from "@expo/vector-icons";

export default function CreateRekber({ bankData }) {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState(0);
  const [isUserFound, setIsUserFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
    console.log(isChecked);
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
    <SafeAreaView style={styles.container}>
      <View className="flex-col w-full h-full items-center justify-between pt-4 bg-white">
        <ScrollView className="flex-1 w-full">
          <View className="flex-col items-start gap-2 w-full">
            {/* Header */}
            <View className="flex flex-row items-center gap-2 px-2 py-0 relative self-stretch w-full bg-transparent">
              <TouchableOpacity onPress={() => router.back()} className="p-2">
                <Icon name="arrow-left" size={20} color="black" />
              </TouchableOpacity>

              <Text className="flex-1 text-center text-neutral-950 text-lg font-medium">
                Buat Transaksi Rekber
              </Text>

              <View className="relative w-7 h-7" />
            </View>

            <View className="flex flex-col items-center gap-4 px-4 py-0 relative self-stretch w-full">
              {bankData?.bankId !== "484f56b2-4f2e-49e6-aec3-6050f1b8e091" ? (
                <View className="flex-row items-center gap-2 bg-[#FEF2D3] p-2 rounded-lg mx-4">
                  <Icon name="info" size={16} color="#FBBF24" />
                  <Text className="text-neutral-950 text-sm font-normal">
                    Pilih bank selain BNI? Biaya admin akan kami potong otomatis
                    dari pembayaran kamu, ya!
                  </Text>
                </View>
              ) : null}
              {/* Bank Account Section */}
              <RekeningKamu bankData={bankData} />

              {/* Form Section */}
              <View className="flex-col w-full items-center gap-4">
                {/* Email Input */}
                <View className="w-full items-center gap-2">
                  <InputField
                    title="Masukkan Email Pembeli"
                    placeholder="Cari email pembeli barang kamu"
                    value={email}
                    onChangeText={setEmail}
                    className="w-full"
                  />
                  {/* Alert Validasi Email*/}{" "}
                  {email.length > 0 && (
                    <View className="flex-row items-center mt-2 mx-5 w-full mb-2">
                      <Feather
                        name={isEmailValid() ? "check-circle" : "x-circle"}
                        size={18}
                        color={isEmailValid() ? "#4ade80" : "#f87171"}
                      />
                      <Text
                        className={`ml-2 text-sm ${
                          isEmailValid() ? "text-green-600" : "text-red-400"
                        }`}>
                        {isEmailValid() ? "Email valid" : "Email tidak valid"}
                      </Text>
                    </View>
                  )}
                  <View className="flex flex-row items-center gap-2 w-full">
                    <TouchableOpacity
                      onPress={handleCheckUser}
                      className={`flex-row h-[34px] w-20 rounded-lg items-center justify-center text-white gap-2 ${
                        !isEmailValid() ? "bg-gray-400" : "bg-black"
                      }`}
                      disabled={!isEmailValid()}>
                      <Icon name="search" size={16} color="white" />
                      <Text className="text-white text-xs font-medium">
                        Cari
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Item Name Input */}

                <InputField
                  title="Nama Barang"
                  placeholder="Masukkan nama barang yang kamu jual"
                  value={itemName}
                  onChangeText={setItemName}
                  className="w-full"
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
                  className="w-full"
                  keyboardType="numeric"
                  inputMode="numeric"
                  errorText={errorText}
                />

                {/* Insurance Checkbox */}
                <View className="flex-row items-start gap-2 w-full">
                  <TouchableOpacity
                    onPress={handleCheckboxPress}
                    className={`w-6 h-6 border ${
                      isChecked
                        ? "bg-[#3ED6C5] border-[#3ED6C5]"
                        : "bg-white border-gray-400"
                    } rounded flex items-center justify-center`}>
                    {isChecked && (
                      <Text className="text-white text-lg font-medium items-center justify-center pb-7">
                        ✓
                      </Text>
                    )}
                  </TouchableOpacity>
                  <Text className="text-[14px] text-black font-normal items-center justify-center">
                    Gunakan Asuransi Pengiriman BNI Life (0,2%)
                  </Text>
                  <TouchableOpacity
                    onPress={() => console.log("Info Asuransi")}
                    className="items-end justify-center text-black">
                    <Icon name="info" size={16} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        {/* Continue Button */}
        <View className="w-full mb-5 px-4">
          <PrimaryButton
            title="Lanjut"
            onPress={handleToConfirmPage}
            disabled={
              !isUserFound || isLoading || !itemName || !amount || !email
            }
          />
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
