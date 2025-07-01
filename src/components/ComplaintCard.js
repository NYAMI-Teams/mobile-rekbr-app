import React from "react";
import { View, Text, Image, Pressable, Alert, StyleSheet } from "react-native";
import { Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";

// Konversi tailwind ke warna hex untuk StyleSheet
const getStatusStyle = (status) => {
  switch (status) {
    case "approved_by_admin":
      return {
        dotColor: "#22c55e", // green-500
        textColor: "#16a34a", // green-600
        label: "Komplain Disetujui",
      };
    case "under_investigation":
      return {
        dotColor: "#fb923c", // orange-400
        textColor: "#f97316", // orange-500
        label: "Investigasi Pengiriman",
      };
    case "rejected_by_seller":
      return {
        dotColor: "#f87171", // red-400
        textColor: "#ef4444", // red-500
        label: "Komplain Ditolak",
      };
    case "canceled":
      return {
        dotColor: "#9ca3af", // gray-400
        textColor: "#6b7280", // gray-500
        label: "Komplain Dibatalkan",
      };
    case "completed":
      return {
        dotColor: "#22c55e", // green-500
        textColor: "#16a34a", // green-600
        label: "Transaksi Selesai",
      };
    default:
      return {
        dotColor: "#d1d5db", // gray-300
        textColor: "#9ca3af", // gray-400
        label: "Status Tidak Diketahui",
      };
  }
};

const getIssueLabel = (type) => {
  switch (type) {
    case "lost":
      return "Barang belum sampai atau kesasar";
    case "damaged":
      return "Barang rusak";
    case "not_as_described":
      return "Barang tidak sesuai deskripsi";
    default:
      return "Masalah lainnya";
  }
};

const getIssueIcon = (type) => {
  switch (type) {
    case "lost":
      return require("../assets/belumsampai.png");
    case "damaged":
      return require("../assets/barangrusak.png");
    case "not_as_described":
      return require("../assets/tidaksesuai.png");
    default:
      return require("../assets/komplain.png");
  }
};

export default function ComplaintCard({
  productName,
  price,
  sellerEmail,
  resi,
  ekspedisi,
  complaint,
}) {
  const handleCopy = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Disalin", `${text} berhasil disalin.`);
  };

  const statusInfo = getStatusStyle(complaint?.status);
  const issueLabel = getIssueLabel(complaint?.type);
  const issueIcon = getIssueIcon(complaint?.type);

  const rows = [
    { label: "Nama Produk", value: productName },
    { label: "Seller", value: sellerEmail },
    { label: "No Resi", value: resi, copyable: true },
    { label: "Ekspedisi", value: ekspedisi },
    {
      label: "Harga",
      value: `Rp. ${Number(price || 0).toLocaleString("id-ID")},00`,
    },
  ];

  return (
    <View style={styles.card}>
      {/* Info Utama */}
      <View style={styles.cardContent}>
        {rows.map((row, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <View style={styles.rowValueWrapper}>
              <Text style={styles.rowValue} numberOfLines={1}>
                {row.value || "-"}
              </Text>
              {row.copyable && !!row.value && (
                <Pressable
                  onPress={() => handleCopy(row.value)}
                  style={styles.copyButton}
                >
                  <Copy size={16} color="#999" />
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Footer Status dan Tipe Masalah */}
      <View style={styles.footer}>
        <View style={styles.issueRow}>
          <Image
            source={issueIcon}
            style={styles.issueIcon}
            resizeMode="contain"
          />
          <Text style={styles.issueLabel}>{issueLabel}</Text>
        </View>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: statusInfo.dotColor },
            ]}
          />
          <Text style={[styles.statusText, { color: statusInfo.textColor }]}>
            {statusInfo.label}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginVertical: 8,
    width: "100%",
    overflow: "hidden",
  },
  cardContent: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
    width: "40%",
  },
  rowValueWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
    justifyContent: "flex-end",
  },
  rowValue: {
    fontSize: 14,
    textAlign: "right",
    fontWeight: "600",
    color: "#1f2937",
    maxWidth: "90%",
  },
  copyButton: {
    padding: 4,
    marginLeft: 8,
  },
  footer: {
    backgroundColor: "#f3f4f6",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 12,
  },
  issueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  issueIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  issueLabel: {
    fontSize: 14,
    color: "#111",
    fontWeight: "bold",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
