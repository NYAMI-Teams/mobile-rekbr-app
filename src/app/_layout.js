import { View } from "react-native";
import { Stack } from "expo-router";
import "../../global.css";
import Toast from "react-native-toast-message";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppBootProvider } from "@/context/AppBootContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppBootProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "!bottom"]}>
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
