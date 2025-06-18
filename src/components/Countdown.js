import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import moment from "moment";

// Helper function to safely parse dates
const parseDate = (date) => {
  if (!date) return null;

  // First try parsing as ISO format (which includes timezone)
  const parsed = moment(date);
  if (parsed.isValid()) return parsed;

  // If that fails, try other formats
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
  // Hitung selisih detik saat komponen pertama kali render
  // Parse dates safely
  const parsedDeadline = parseDate(deadline);
  const parsedFromTime = parseDate(fromTime);

  // If either date is invalid, return 0
  if (!parsedDeadline || !parsedFromTime) return <Text>00:00:00</Text>;

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

  // Format detik menjadi HH : MM : SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(
      2,
      "0"
    )} : ${String(seconds).padStart(2, "0")}`;
  };

  return (
    <Text className="font-poppins-semibold text-[14px] text-gray-800">
      {formatTime(timeLeftInSeconds)}
    </Text>
  );
};

export default CountdownTimer;
