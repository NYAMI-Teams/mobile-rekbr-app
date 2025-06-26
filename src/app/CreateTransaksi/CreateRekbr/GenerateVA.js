import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Info } from "lucide-react-native";
import PrimaryButton from "../../../components/PrimaryButton";
import RekeningKamu from "../../../components/RekeningKamu";
import { useRouter, useLocalSearchParams } from "expo-router";
import { sellerCreateTransaction } from "../../../utils/api/transaction";
import { formatCurrency, showToast } from "../../../utils";
import NavBackHeader from "@/components/NavBackHeader";

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
    <View style={styles.container}>
      {/* Header */}
      <NavBackHeader title="Ringkasan Transaksi Rekber" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Rekening Kamu */}
        <RekeningKamu bankData={bankData} />

        {/* Detail Transaksi */}
        <View style={styles.transactionDetail}>
          <Text style={styles.label}>Pembeli Barang</Text>
          <Text style={styles.value}>{payload?.email}</Text>

          <Text style={[styles.label, styles.marginTop]}>Nama Barang</Text>
          <Text style={styles.value}>{payload?.itemName}</Text>

          <Text style={[styles.label, styles.marginTop]}>Nominal Barang</Text>
          <Text style={styles.value}>{formatCurrency(payload?.itemPrice)}</Text>
        </View>

        <View style={styles.divider} />

        {/* Biaya Tambahan */}
        {payload?.isInsurance && (
          <View style={styles.additionalFee}>
            <View style={styles.rowCenter}>
              <Text style={styles.additionalFeeTitle}>Asuransi Pengiriman BNI Life</Text>
              <Info size={14} color="#888" style={styles.iconMargin} />
            </View>
            <Text style={styles.additionalFeeValue}>
              {formatCurrency(insuranceFee)}
            </Text>
          </View>
        )}

        <View style={styles.additionalFee}>
          <View style={styles.rowCenter}>
            <Text style={styles.additionalFeeTitle}>Biaya Jasa Aplikasi</Text>
            <Info size={14} color="#888" style={styles.iconMargin} />
          </View>
          <Text style={styles.additionalFeeValue}>
            {formatCurrency(serviceFee)}
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Total Tagihan Buyer</Text>
          <Text style={styles.footerTotal}>
            {formatCurrency(totalAmount)}
          </Text>
        </View>
        <PrimaryButton
          title="Generate VA dan Kirim"
          onPress={handleCreateTransaction}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 160,
  },
  transactionDetail: {
    marginTop: 24,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#374151",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  marginTop: {
    marginTop: 16,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginVertical: 16,
  },
  additionalFee: {
    marginBottom: 16,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  additionalFeeTitle: {
    fontSize: 16,
    color: "#374151",
  },
  additionalFeeValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  iconMargin: {
    marginLeft: 4,
  },
  footer: {
    padding: 12,
    borderTopWidth: 2,
    borderColor: "#E5E7EB",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  footerLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  footerTotal: { 
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
});

