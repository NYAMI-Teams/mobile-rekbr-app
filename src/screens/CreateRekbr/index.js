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
import { useState } from "react";
import clsx from "clsx";
import PrimaryButton from "../../components/PrimaryButton";
import InputField from "../../components/InputField";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateRekber({ bankData }) {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-col w-full h-full items-center justify-between pt-4 bg-white">
        <ScrollView className="flex-1 w-full">
          <View className="flex-col items-start gap-2 w-full">
            {/* Header */}
            <View className="flex flex-row items-center gap-2 px-2 py-0 relative self-stretch w-full bg-transparent">
              <TouchableOpacity
                onPress={() => console.log("Go Back")}
                className="p-2">
                <Icon name="arrow-left" size={20} color="black" />
              </TouchableOpacity>

              <Text className="flex-1 text-center text-neutral-950 text-sm font-medium">
                Buat Transaksi Rekber
              </Text>

              <View className="relative w-7 h-7" />
            </View>

            <View className="flex flex-col items-center gap-4 px-4 py-0 relative self-stretch w-full">
              <View className="flex-row items-center gap-2 bg-[#FEF2D3] p-2 rounded-lg mx-4">
                <Icon name="info" size={16} color="#FBBF24" />
                <Text className="text-neutral-950 text-sm font-normal">
                  Pilih bank selain BNI? Biaya admin akan kami potong otomatis
                  dari pembayaran kamu, ya!
                </Text>
              </View>
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
                  <View className="flex flex-row items-center gap-2 w-full">
                    <TouchableOpacity
                      onPress={() => console.log("Cari Email")}
                      className="flex-row h-[34px] w-20 rounded-lg items-center justify-center bg-black text-white gap-2">
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
                  onChangeText={setAmount}
                  className="w-full"
                />

                {/* Insurance Checkbox */}
                <View className="flex-row items-start gap-2 w-full">
                  <TouchableOpacity
                    onPress={() => setIsChecked(!isChecked)}
                    className={clsx(
                      "w-6 h-6 border border-black bg-white rounded flex items-center justify-center",
                      isChecked && "bg-[#3ED6C5] border-[#3ED6C5]"
                    )}>
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
          <PrimaryButton title="Lanjut" onPress={() => console.log("Lanjut")} />
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
