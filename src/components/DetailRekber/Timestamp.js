import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import CountdownTimer from "../Countdown";

const TimestampDetail = ({ status, date }) => {
  const formatDateWIB = (dateTime) => {
    if (!dateTime) return "Invalid date";
    return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
  };

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailStatus}>{status}</Text>
      <Text style={styles.detailDate}>{formatDateWIB(date)}</Text>
    </View>
  );
};

const Timestamp = ({ data, caption, date, details = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const formatDateWIB = (dateTime) => {
    if (!dateTime) return "Invalid date";
    return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
  };

  const shippedApproved =
    data?.status === "shipped" &&
    data?.fundReleaseRequest?.status !== "approved";

  const completedApproved =
    data?.status === "completed" &&
    (data?.fundReleaseRequest?.status === "approved" ||
      data?.fundReleaseRequest?.status === null);

  const renderBottomSection = () => {
    const status = data?.status;

    if (status === "pending_payment") {
      return (
        <Text style={styles.countdownText}>
          <CountdownTimer
            deadline={data?.paymentDeadline}
            fromTime={data?.currentTimestamp}
          />
        </Text>
      );
    }

    if (status === "waiting_shipment") {
      return <Text style={styles.countdownText}>2 x 24 jam</Text>;
    }

    if (
      status === "shipped" &&
      data?.fundReleaseRequest?.requested &&
      data?.fundReleaseRequest?.status === "approved"
    ) {
      return (
        <Text style={styles.countdownText}>
          <CountdownTimer
            deadline={data?.buyerConfirmDeadline}
            fromTime={data?.currentTimestamp}
          />
        </Text>
      );
    }

    return null;
  };

  const hideCountdown =
    (data?.status === "shipped" &&
      data?.fundReleaseRequest?.status !== "approved") ||
    (data?.status === "completed" &&
      (data?.fundReleaseRequest?.status === "approved" ||
        data?.fundReleaseRequest?.status === null)) ||
    data?.status === "canceled" ||
    data?.status === "refunded";

  return (
    <TouchableOpacity onPress={toggleExpand}>
      <View style={styles.header}>
        <Text style={styles.caption}>{caption}</Text>

        {!hideCountdown && (
          <View style={styles.countdownContainer}>
            <View style={styles.countdownBox}>{renderBottomSection()}</View>
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
          <TimestampDetail
            key={index}
            status={item?.status}
            date={item?.date}
          />
        ))}

      <View
        style={[
          styles.bottomContainer,
          {
            marginTop: isExpanded ? 12 : 0,
            padding: shippedApproved || completedApproved ? 0 : 16,
            backgroundColor:
              shippedApproved || completedApproved ? "#fff" : "#FEF2D3",
          },
        ]}
      >
        {!shippedApproved && !completedApproved && (
          <Image
            source={require("../../assets/timer.png")}
            style={styles.bottomTimerIcon}
          />
        )}
        <Text
          style={[
            styles.bottomDateText,
            {
              marginLeft:
                !shippedApproved && !completedApproved ? 10 : 0,
            },
          ]}
        >
          {formatDateWIB(date)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  caption: {
    fontSize: 14,
    flex: 1,
    paddingRight: 10,
  },
  countdownContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countdownBox: {
    padding: 10,
    backgroundColor: "#FEF2D3",
    borderRadius: 8,
    marginRight: 20,
  },
  countdownText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#1f2937", // gray-800
  },
  bottomContainer: {
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center",
  },
  bottomTimerIcon: {
    width: 24,
    height: 24,
  },
  bottomDateText: {
    fontSize: 17,
  },
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
  detailDate: {
    fontSize: 13,
    marginVertical: 5,
    fontWeight: "500",
    color: "#616161",
  },
});

export default Timestamp;
