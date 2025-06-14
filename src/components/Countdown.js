import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import moment from "moment";

const CountdownTimer = ({ deadline, fromTime }) => {
  // Hitung selisih detik saat komponen pertama kali render
  const initialSeconds = Math.max(
    0,
    moment(deadline).diff(moment(fromTime), "seconds")
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
