import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Info } from "lucide-react-native";
import InfoModal from "../InfoModal";

const TagihanDetail = ({ status, price }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <View style={styles.detailContainer}>
        <TouchableOpacity onPress={() => setVisible(true)} disabled={status !== "Biaya Jasa Aplikasi"}>
          <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
            <Text style={styles.detailStatus}>{status}</Text>
            {status == "Biaya Jasa Aplikasi" && <Info size={14} color="#888" style={styles.iconMargin} />}
          </View>
        </TouchableOpacity>
        <Text style={styles.detailPrice}>{price}</Text>
      </View>
      <InfoModal
        title={"Biaya Jasa Aplikasi"}
        desc={
          `Biaya jasa aplikasi Rekbr by BNI dihitung berdasarkan nominal transaksi:\n\n` +
          `• Rp 10.000 - Rp 499.999: minimum Rp 5.000\n` +
          `• Rp 500.000 - Rp 4.999.999: 1% dari nominal\n` +
          `• Rp 5.000.000 - Rp 10.000.000: 0,8% dari nominal\n\n` +
          `Biaya ini digunakan untuk mendukung layanan, keamanan, dan pengembangan aplikasi Rekbr by BNI.`
        }
        modalVisible={visible}
        setModalVisible={setVisible}
      />
    </>
  );
};

const Tagihan = ({ caption, price, details = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <TouchableOpacity onPress={toggleExpand}>
        <View style={styles.header}>
          <Text style={styles.caption}>{caption}</Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="black"
          />
        </View>
      </TouchableOpacity>

      {isExpanded &&
        details.map((item, index) => (
          <TagihanDetail key={index} status={item.status} price={item.price} />
        ))}

      <Text
        style={[
          styles.totalPrice,
          isExpanded && { marginTop: 16 }, // mt-4 if expanded
        ]}
      >
        {price}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingBottom: 10,
    borderLeftColor: "#F5F5F5",
    borderLeftWidth: 4,
    marginHorizontal: 4,
  },
  detailStatus: {
    fontSize: 14,
    fontWeight: "400",
    color: "#616161",
  },
  detailPrice: {
    fontSize: 13,
    fontWeight: "500",
    color: "#616161",
    marginVertical: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  caption: {
    fontSize: 15,
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: "500",
  },
});

export default Tagihan;
