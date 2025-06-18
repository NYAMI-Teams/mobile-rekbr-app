import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import CountdownTimer from "../Countdown";

const TimestampDetail = ({ status, date }) => {
  const formatDateWIB = (dateTime) => {
    if (!dateTime) return "Invalid date";
    return moment(dateTime).utcOffset(0).format("DD MMMM YYYY, HH:mm [WIB]");
  };

  return (
    <>
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
          {formatDateWIB(date)}
        </Text>
      </View>
    </>
  );
};

const Timestamp = ({ data, caption, date, details = [] }) => {
  const formatDateWIB = (dateTime) => {
    if (!dateTime) return "Invalid date";
    return moment(dateTime).utcOffset(0).format("DD MMMM YYYY, HH:mm [WIB]");
  };
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderBottomSection = () => {
    const status = data.status;
    if (status === "pending_payment") {
      return (
        <Text className="font-poppins-semibold text-gray-800">
          {/* Replace this with dynamic countdown logic */}
          <CountdownTimer
            deadline={data.paymentDeadline}
            fromTime={data.currentTimestamp}
          />
        </Text>
      );
    }

    if (status === "waiting_shipment") {
      return (
        <Text className="font-poppins-semibold text-gray-800">2 x 24 jam</Text>
      );
    }

    if (
      status === "shipped" &&
      data.fundReleaseRequest.requested &&
      data.fundReleaseRequest.status === "approved"
    ) {
      return (
        <Text className="font-poppins-semibold text-gray-800">
          {/* Replace this with actual countdown (e.g., 24 jam mundur dari requestAt) */}
          <CountdownTimer
            deadline={data.buyerConfirmDeadline}
            fromTime={data.fundReleaseRequest.resolvedAt}
          />
        </Text>
      );
    }
  };

  return (
    <TouchableOpacity onPress={toggleExpand}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}>
        <Text style={{ fontSize: 14, flex: 1, paddingRight: 10 }}>
          {caption}
        </Text>
        {/* Countdown */}
        {(data.status == "shipped" &&
          data.fundReleaseRequest.status != "approved") ||
        (data.status == "completed" &&
          (data.fundReleaseRequest.status == "approved" ||
            data.fundReleaseRequest.status == null)) ||
        data.status == "canceled" ||
        data.status == "refunded" ? null : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            <View
              style={{
                padding: 10,
                backgroundColor: "#FEF2D3",
                borderRadius: 8,
                marginRight: 20,
              }}>
              {renderBottomSection()}
            </View>
          </View>
        )}
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="black"
        />
      </View>

      {isExpanded &&
        details.map((item, index) => (
          <TimestampDetail key={index} status={item.status} date={item.date} />
        ))}

      <View
        style={{
          flexDirection: "row",
          marginTop: isExpanded ? 12 : 0,
          borderRadius: 8,
          padding:
            (data.status == "shipped" &&
              data.fundReleaseRequest.status != "approved") ||
            (data.status == "completed" &&
              (data.fundReleaseRequest.status == "approved" ||
                data.fundReleaseRequest.status == null))
              ? 0
              : 16,
          backgroundColor:
            (data.status == "shipped" &&
              data.fundReleaseRequest.status != "approved") ||
            (data.status == "completed" &&
              (data.fundReleaseRequest.status == "approved" ||
                data.fundReleaseRequest.status == null))
              ? "#fff"
              : "#FEF2D3",
          alignItems: "center",
        }}>
        {(data.status == "shipped" &&
          data.fundReleaseRequest.status != "approved") ||
        (data.status == "completed" &&
          (data.fundReleaseRequest.status == "approved" ||
            data.fundReleaseRequest.status == null)) ? null : (
          <Image
            source={require("../../assets/timer.png")}
            style={{ width: 24, height: 24 }}
          />
        )}
        <Text
          style={{
            marginLeft:
              (data.status == "shipped" &&
                data.fundReleaseRequest.status != "approved") ||
              (data.status == "completed" &&
                (data.fundReleaseRequest.status == "approved" ||
                  data.fundReleaseRequest.status == null))
                ? 0
                : 10,
            fontSize: 17,
          }}>
          {formatDateWIB(date)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Timestamp;
