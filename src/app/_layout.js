import { Stack } from "expo-router";
import "../../global.css";
import { useEffect, useState } from "react";
import { getProfile } from "../utils/api/auth";
import { showToast } from "../utils";
import { getAccessToken, setProfileStore } from "../store";
import SplashScreen from "../assets/splash.png";
import { Image, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          setIsLoggedIn(false);
          return;
        }
        const res = await getProfile();
        setProfileStore(res.data);
        setIsLoggedIn(true);
      } catch (error) {
        if (!error.includes("Error getting access token")) {
          showToast(
            "Error",
            "Gagal mengambil data profile. Silahkan coba lagi.",
            "error"
          );
        }
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    const splashTimeout = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setAppIsReady(true);
    };
    splashTimeout();
    checkAuth();
  }, []);

  if (!appIsReady || isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Image source={SplashScreen} className="w-full h-full" />
      </View>
    );
  }

  return (
    <>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="Onboarding/index" />
        )}
      </Stack>
      </GestureHandlerRootView>
      <Toast />
    </GestureHandlerRootView>
    </>
  );
}
