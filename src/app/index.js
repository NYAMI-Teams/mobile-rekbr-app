// app/index.js
import { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { getAccessToken, getDataNotification, setDataNotification, setProfileStore } from "@/store";
import { getProfile } from "@/utils/api/auth";
import { useAppBoot } from "@/context/AppBootContext";
import SplashScreen from "@/assets/splash.png";

export default function Index() {
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const { hasBooted, setHasBooted } = useAppBoot();
  const { data } = useLocalSearchParams();

  useEffect(() => {
    // jika sudah pernah boot, redirect langsung
    if (hasBooted) {
      router.replace("/(tabs)");
      return;
    }

    const prepareApp = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // splash 2 detik
        const token = await getAccessToken();

        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        const res = await getProfile();
        setProfileStore(res.data);
        setIsLoggedIn(true);
      } catch (e) {
        setIsLoggedIn(false);
        setDataNotification(null)
      } finally {
        setAppIsReady(true);
        setHasBooted(true);
      }
    };

    prepareApp();
  }, []);

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Image
          source={SplashScreen}
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        />
      </View>
    );
  }

  return isLoggedIn ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/Onboarding" />
  );
}
