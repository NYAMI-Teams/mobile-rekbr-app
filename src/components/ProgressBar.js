import React, { Fragment } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // ganti di sini

const StepProgressBar = ({ currentStep, steps }) => {
  return (
    <View className="flex-row items-start justify-center px-4 my-5 mb-4 mx-4">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isFinalStep = isActive && currentStep === steps.length - 1;

        return (
          <Fragment key={index}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.completedCircle,
                  isActive && !isFinalStep && styles.activeCircle,
                  isFinalStep && styles.finalCircle,
                ]}>
                {isCompleted || isFinalStep ? (
                  <MaterialIcons
                    name="check"
                    size={16}
                    color={isFinalStep ? "#4CD964" : "#4CD7D0"}
                  />
                ) : (
                  isActive && (
                    <View
                      style={[
                        styles.dot,
                        isFinalStep && { backgroundColor: "#4CD964" },
                      ]}
                    />
                  )
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  isCompleted && styles.completedLabel,
                  isActive && !isFinalStep && styles.activeLabel,
                  isFinalStep && styles.finalLabel,
                ]}>
                {label}
              </Text>
            </View>
            {index !== steps.length - 1 && (
              <View style={[styles.line, index < currentStep && styles.completedLine]} />
            )}
          </Fragment>
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
    zIndex: 1,
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
    width: 80,
    height: 2,
    backgroundColor: "#ccc",
    marginHorizontal: -13,
    marginTop: 12,
    zIndex: 0,
  },
  completedLine: {
    backgroundColor: "#4CD7D0",
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
});

export default StepProgressBar;
