import { Stack } from "expo-router";
import "../../global.css";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Ini harusnya false, gua bikin true biar langsung masuk home

  useEffect(() => {
    // Cek status login / cek token valid atau engga
    // setIsLoggedIn(true/false)
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="auth/login" />
      )}
    </Stack>
  );
}
