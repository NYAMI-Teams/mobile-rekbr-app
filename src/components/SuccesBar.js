import React, { Fragment, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const StepProgressBar = ({ currentStep, steps, buttonSimulatePress = false }) => {


    return (
        <View style={styles.container}>
            {steps.map((label, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;
                const isFinalStep = isActive && currentStep === steps.length - 1;
                const progress = useRef(new Animated.Value(0)).current;

                useEffect(() => {
                    if (buttonSimulatePress) {
                        Animated.timing(progress, {
                            toValue: 1,
                            duration: 1000, // durasi animasi
                            useNativeDriver: false,
                        }).start();
                    }
                }, [buttonSimulatePress]);

                const LINE_WIDTH = 250;

                const animatedWidth = progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, LINE_WIDTH],
                });

                const animatedDotLeft = progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, LINE_WIDTH - 8], // 8 = diameter dot
                });

                return (
                    <Fragment key={index}>
                        <Fragment>
                            <View style={styles.stepContainer}>
                                <View
                                    style={[
                                        styles.circle,
                                        isCompleted && styles.completedCircle,
                                        isActive && !isFinalStep && styles.activeCircle,
                                        isFinalStep && styles.finalCircle,
                                    ]}
                                >
                                    {isCompleted || isFinalStep ? (
                                        <MaterialIcons
                                            name="check"
                                            size={16}
                                            color={isFinalStep ? "#4CD964" : "#4CD7D0"}
                                        />
                                    ) : isActive && (
                                        <View
                                            style={[
                                                styles.dot,
                                                isFinalStep && { backgroundColor: "#4CD964" },
                                            ]}
                                        />
                                    )}
                                </View>
                                <Text
                                    style={[
                                        styles.label,
                                        isCompleted && styles.completedLabel,
                                        isActive && !isFinalStep && styles.activeLabel,
                                        isFinalStep && styles.finalLabel,
                                    ]}
                                >
                                    {label}
                                </Text>
                            </View>
                        </Fragment >
                        {index < steps?.length - 1 && (
                            <View style={[styles.lineWrapper, { width: LINE_WIDTH }]}>
                                <View style={styles.lineBase} />
                                <Animated.View style={[styles.completedLine, { width: animatedWidth }]}>
                                    <Animated.View style={[styles.animatedDot, { left: animatedDotLeft }]} />
                                </Animated.View>
                            </View>
                        )}
                    </Fragment>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 16,
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
        width: "100%",
        height: 2,
        backgroundColor: "#ccc",
        marginHorizontal: 5,
        marginTop: 12,
        marginHorizontal: -20,
        zIndex: 0
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
    lineWrapper: {
        // flex: 1,
        height: 3,
        backgroundColor: "#000",
        marginTop: 12,
        marginHorizontal: -25,
        zIndex: 0,
        // overflow: "hidden",
    },
    lineBase: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#ccc",
    },
    completedLine: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#4CD7D0",
        width: "0%",
    },
    animatedDot: {
        position: "absolute",
        top: -3, // agar dot sejajar dengan garis
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
});

export default StepProgressBar;
