import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ComplaintStepBar = ({ currentStep = 0, steps = [], status }) => {
  const isRejectedStatus = [
    "rejected",
    "rejected_by_seller",
    "rejected_by_admin",
  ].includes(status);

  return (
    <View style={styles.container}>
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isFinalStep = isActive && index === steps.length - 1;
        const isRejected = isFinalStep && isRejectedStatus;

        return (
          <React.Fragment key={index}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.completedCircle,
                  isActive && !isFinalStep && styles.activeCircle,
                  isFinalStep &&
                    (isRejected ? styles.rejectedCircle : styles.finalCircle),
                ]}
              >
                {isCompleted || isFinalStep ? (
                  <MaterialIcons
                    name={isRejected ? "cancel" : "check"}
                    size={16}
                    color={isRejected ? "#FF4D4F" : "#4CD964"}
                  />
                ) : isActive ? (
                  <View
                    style={[
                      styles.dot,
                      isFinalStep && {
                        backgroundColor: isRejected ? "#FF4D4F" : "#4CD964",
                      },
                    ]}
                  />
                ) : null}
              </View>
              <Text
                style={[
                  styles.label,
                  isCompleted && styles.completedLabel,
                  isActive && !isFinalStep && styles.activeLabel,
                  isFinalStep &&
                    (isRejected ? styles.rejectedLabel : styles.finalLabel),
                ]}
              >
                {label}
              </Text>
            </View>

            {/* Progress Line */}
            {index !== steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  index < currentStep &&
                    (steps[index + 1]?.toLowerCase().includes("ditolak") &&
                    isRejectedStatus
                      ? styles.rejectedLine
                      : styles.completedLine),
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 20,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  stepContainer: {
    alignItems: "center",
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4CD7D0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  completedCircle: {
    backgroundColor: "#EDFBFA",
  },
  activeCircle: {
    backgroundColor: "#EDFBFA",
  },
  finalCircle: {
    backgroundColor: "#E6FFE6",
    borderColor: "#4CD964",
  },
  rejectedCircle: {
    backgroundColor: "#FFF0F0",
    borderColor: "#FF4D4F",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CD7D0",
    shadowColor: "#4CD7D0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 4,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "#ccc",
    marginHorizontal: 8,
  },
  completedLine: {
    backgroundColor: "#4CD7D0",
  },
  rejectedLine: {
    backgroundColor: "#FF4D4F",
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: "#aaa",
  },
  completedLabel: {
    color: "#000",
    fontWeight: "600",
  },
  activeLabel: {
    color: "#000",
    fontWeight: "600",
  },
  finalLabel: {
    color: "#4CD964",
    fontWeight: "600",
  },
  rejectedLabel: {
    color: "#FF4D4F",
    fontWeight: "600",
  },
});

export default ComplaintStepBar;
