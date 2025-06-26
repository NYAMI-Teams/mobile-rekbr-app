import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function RekeningKamu({ bankData }) {
  return (
    <View style={styles.container}>
      {/* Bank Account Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Rekening Kamu</Text>

        <View style={styles.accountBox}>
          <View style={styles.accountNameWrapper}>
            <Text style={styles.accountName}>
              {bankData?.accountHolderName}
            </Text>
          </View>

          <View style={styles.bankRow}>
            {/* Logo Bank */}
            <View style={styles.bankLogoWrapper}>
              <Image
                style={styles.bankLogo}
                source={{ uri: bankData?.bank?.logoUrl }}
              />
            </View>

            {/* Info Bank */}
            <View style={styles.bankInfo}>
              <Text style={styles.bankText} numberOfLines={1}>
                {bankData?.bank?.bankName || "-"}
              </Text>
              <Text style={styles.bankText} numberOfLines={1}>
                {bankData?.accountNumber || "-"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "column",
    paddingVertical: 0,
    alignSelf: "stretch",
    width: "100%",
  },
  section: {
    gap: 8,
    alignSelf: "stretch",
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 15,
    color: "#000000",
    fontWeight: "400",
    marginBottom: 8,
  },
  accountBox: {
    backgroundColor: "#EDFBFA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "space-between",
    gap: 8,
    width: "100%",
    flexDirection: "column",
  },
  accountNameWrapper: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    gap: 8,
  },
  accountName: {
    color: "#0A0A0A", // neutral-950
    fontSize: 15,
    fontWeight: "500",
  },
  bankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  bankLogoWrapper: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  bankLogo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  bankInfo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 4,
  },
  bankText: {
    color: "#0A0A0A", // neutral-950
    fontSize: 14,
    fontWeight: "400",
  },
});
