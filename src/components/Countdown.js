import React, { useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";
import moment from "moment";

// Helper function to safely parse dates
const parseDate = (date) => {
  if (!date) return null;

  // First try parsing as ISO format (which includes timezone)
  const parsed = moment(date);
  if (parsed.isValid()) return parsed;

  // Try fallback formats
  const formats = [
    "YYYY-MM-DD HH:mm:ss",
    "YYYY-MM-DD",
    "MM/DD/YYYY",
    "DD/MM/YYYY",
  ];
  for (const format of formats) {
    const parsed = moment(date, format, true);
    if (parsed.isValid()) return parsed;
  }
  return null;
};

const CountdownTimer = ({ deadline, fromTime }) => {
  const parsedDeadline = parseDate(deadline);
  const parsedFromTime = parseDate(fromTime);

  if (!parsedDeadline || !parsedFromTime) return <Text style={styles.timerText}>00:00:00</Text>;

  const initialSeconds = Math.max(
    0,
    parsedDeadline.diff(parsedFromTime, "seconds")
  );

  const [timeLeftInSeconds, setTimeLeftInSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeftInSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeLeftInSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeftInSeconds]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(
      2,
      "0"
    )} : ${String(seconds).padStart(2, "0")}`;
  };

  return <Text style={styles.timerText}>{formatTime(timeLeftInSeconds)}</Text>;
};

const styles = StyleSheet.create({
  timerText: {
    fontFamily: "Poppins-SemiBold", // make sure this font is loaded
    fontSize: 14,
    color: "#1F2937", // Tailwind gray-800
  },
});

export default CountdownTimer;
