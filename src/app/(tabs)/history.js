import { View, ActivityIndicator } from "react-native";
import NavigationBar from "../../components/NavigationBar";
import History from "../../screens/history";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { getProfile } from "../../utils/api/auth";
import { getAccessToken, removeAccessToken } from "../../store";
import { showToast } from "../../utils";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        handleLogout();
        return;
      }
      const res = await getProfile();
      setProfile(res.data);
    } catch {
      showToast(
        "Session Invalid",
        "Your session has expired. Please log in again.",
        "error"
      );
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await removeAccessToken();
      router.replace("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, padding: 16 }}>
        <NavigationBar
          name={profile?.email}
          onNotificationPress={() =>
            Toast.show({
              type: "success",
              text1: "Notification pressed",
              position: "top",
            })
          }
          onLogoutPress={() => handleLogout()}
        />

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <History />
        )}
      </View>
    </View>
  );
}
