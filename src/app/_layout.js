import { Stack } from "expo-router";
import "../../global.css";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Tambahkan ini

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // sementara true

  useEffect(() => {
    // cek token login valid atau tidak
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="auth/login" />
        )}
      </Stack>
    </GestureHandlerRootView>
  );
}
