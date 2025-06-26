import React, { useRef, useEffect } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Shimmer({ style }) {
  const translateX = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerTranslate = translateX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={[style, styles.base]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX: shimmerTranslate }],
          },
        ]}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.3)", "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
  },
});
