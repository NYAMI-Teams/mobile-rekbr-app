import { Stack } from "expo-router";
import "../../global.css";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { ActivityIndicator, View } from "react-native";
import { getProfile } from "../utils/api/auth";
import { showToast } from "../utils";
import { getAccessToken } from "../store";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Ini harusnya false, gua bikin true biar langsung masuk home
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      const res = await getProfile();
      // console.log("Profile data:", res.data);
      setIsLoggedIn(true);
    } catch {
      showToast("Session Invalid", "Your session has expired. Please log in again.", "error");
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="Onboarding/index" />
        )}
      </Stack>
      <Toast />
    </>
  );
}
