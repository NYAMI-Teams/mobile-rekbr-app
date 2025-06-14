import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TagihanDetail = ({ status, price }) => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        paddingHorizontal: 8,
        paddingBottom: 10,
        borderLeftColor: "#F5F5F5",
        borderLeftWidth: 4,
        marginHorizontal: 4,
      }}>
      <Text style={{ fontSize: 14, fontWeight: "400", color: "#616161" }}>
        {status}
      </Text>
      <Text
        style={{
          fontSize: 13,
          marginVertical: 5,
          fontWeight: "500",
          color: "#616161",
        }}>
        {price}
      </Text>
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}>
        <Text style={{ fontSize: 15 }}>{caption}</Text>

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

      <Text className={`text-[15px] font-medium ${isExpanded ? "mt-4" : null}`}>
        {/* {formatCurrency(price)} */}
        {price}
      </Text>
    </TouchableOpacity>
  );
};

export default Tagihan;
