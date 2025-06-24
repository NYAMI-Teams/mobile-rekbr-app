import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Info } from "lucide-react-native";
import PrimaryButton from "../../../components/PrimaryButton";
import RekeningKamu from "../../../components/RekeningKamu";
import { useRouter, useLocalSearchParams } from "expo-router";
import { sellerCreateTransaction } from "../../../utils/api/transaction";
import { formatCurrency, showToast } from "../../../utils";

export default function TransactionSummary() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const payload = typeof params.payload === "string" ? JSON.parse(params.payload) : params.payload;
  const bankData = typeof params.bankData === "string" ? JSON.parse(params.bankData) : params.bankData;

  const [insuranceFee, setInsuranceFee] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const price = Number(payload?.itemPrice) || 0;
    const _insuranceFee = payload?.isInsurance ? price * 0.002 : 0;
    const _serviceFee = price * 0.008;
    setInsuranceFee(_insuranceFee);
    setServiceFee(_serviceFee);
    setTotalAmount(price + _serviceFee + _insuranceFee);
  }, [payload]);

  const handleCreateTransaction = async () => {
    setIsLoading(true);
    try {
      await sellerCreateTransaction(payload);
      showToast("Berhasil", "Transaksi berhasil dibuat");
      router.replace("/");
    } catch (error) {
      showToast(
        "Gagal",
        error?.message || "Terjadi kesalahan saat membuat transaksi",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      {/* Header */}
      <View className="flex-row items-center justify-center mb-6 relative">
        <TouchableOpacity
          className="absolute left-0"
          onPress={() => router.back()}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-center">
          Ringkasan Transaksi Rekber
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 160 }}
        className="px-4 pt-6">
        {/* Rekening Kamu */}
        <RekeningKamu bankData={bankData} />

        {/* Detail Transaksi */}
        <View className="space-y-3 mb-6 mt-6">
          <Text className="text-base text-gray-800">Pembeli Barang</Text>
          <Text className="text-lg font-semibold text-gray-900">
            {payload?.email}
          </Text>

          <Text className="text-base text-gray-800 mt-4">Nama Barang</Text>
          <Text className="text-lg font-semibold text-gray-900">
            {payload?.itemName}
          </Text>

          <Text className="text-base text-gray-800 mt-4">Nominal Barang</Text>
          <Text className="text-lg font-semibold text-gray-900">
            {formatCurrency(payload?.itemPrice)}
          </Text>
        </View>

        <View className="border-t border-gray-200 my-4" />

        {/* Biaya Tambahan */}
        {payload?.isInsurance && (
          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Text className="text-lg text-gray-800">
                Asuransi Pengiriman BNI Life
              </Text>
              <Info size={14} color="#888" className="ml-1" />
            </View>
            <Text className="text-base font-medium text-gray-800">
              {formatCurrency(insuranceFee)}
            </Text>
          </View>
        )}

        <View className="mb-6 mt-3">
          <View className="flex-row items-center mb-1">
            <Text className="text-lg text-gray-800">Biaya Jasa Aplikasi</Text>
            <Info size={14} color="#888" className="ml-1" />
          </View>
          <Text className="text-base font-medium text-gray-800">
            {formatCurrency(serviceFee)}
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="p-3 border-t-2 rounded-t-3xl border-x-2 border-gray-200 drop-shadow-xl items-center justify-between">
        <View className="flex-row justify-between items-center mb-4 w-full px-2">
          <Text className="text-base text-gray-700 font-medium">
            Total Tagihan Buyer
          </Text>
          <Text className="text-xl font-bold text-gray-900">
            {formatCurrency(totalAmount)}
          </Text>
        </View>
        <PrimaryButton
          title="Generate VA dan Kirim"
          onPress={handleCreateTransaction}
          disabled={isLoading}
        />
      </View>
    </SafeAreaView>
  );
}

