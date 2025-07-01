import { View } from "react-native";
import { Stack } from "expo-router";
import "../../global.css";
import Toast from "react-native-toast-message";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppBootProvider } from "@/context/AppBootContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureNotificationHandler,
  setupNotificationListeners,
} from "@/utils/notifications";
import { useEffect } from "react";
export default function RootLayout() {
  useEffect(() => {
    configureNotificationHandler(); // Atur handler
    const unsubscribe = setupNotificationListeners(); // Pasang listener

    return () => {
      if (unsubscribe) unsubscribe(); // Bersihkan listener saat unmount
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppBootProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView
              style={{ flex: 1, backgroundColor: "#fff" }}
              edges={["top", "!bottom"]}
            >
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: "#fff" },
                  statusBarBackgroundColor: "#fff",
                }}
              />
            </SafeAreaView>
          </GestureHandlerRootView>
        </AppBootProvider>
      </SafeAreaProvider>
      <Toast />
    </View>
  );
}
