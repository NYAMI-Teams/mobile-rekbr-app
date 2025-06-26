import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TagihanDetail = ({ status, price }) => {
  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailStatus}>{status}</Text>
      <Text style={styles.detailPrice}>{price}</Text>
    </View>
  );
};

const Tagihan = ({ caption, price, details = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity onPress={toggleExpand}>
      <View style={styles.header}>
        <Text style={styles.caption}>{caption}</Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="black"
        />
      </View>

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
    </TouchableOpacity>
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
