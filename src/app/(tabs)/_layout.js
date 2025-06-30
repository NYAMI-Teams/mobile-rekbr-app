import NavigationBar from "@/components/NavigationBar";
import { getAccessToken, removeAccessToken, setProfileStore } from "@/store";
import { showToast } from "@/utils";
import { getProfile } from "@/utils/api/auth";
import { Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SellerIcon from "@/assets/icon-seller.svg";
import BuyerIcon from "@/assets/icon-buyer.svg";
import DisputeIcon from "@/assets/icon-complaint.svg";
import HistoryIcon from "@/assets/icon-history.svg";

export default function TabLayout() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }
      const res = await getProfile();
      setProfileStore(res.data);
      setProfile(res.data);
    } catch (err) {
      showToast(
        "Sesi Berakhir",
        "Sesi Anda telah berakhir. Silahkan login kembali.",
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
      showToast("Logout Berhasil", "Anda telah berhasil logout.", "success");
      router.replace("Onboarding");
    } catch (err) {
      showToast("Logout Gagal", "Gagal logout. Silahkan coba lagi.", "error");
    }
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <NavigationBar
          name={profile?.email}
          onNotificationPress={() => {
            showToast(
              "Notification pressed",
              "Notification pressed",
              "success"
            );
          }}
          onLogoutPress={() => handleLogout()}
        />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabStyle,
            tabBarActiveTintColor: "#3ED6C5",
            tabBarInactiveTintColor: "#666",
            tabBarLabelStyle: styles.tabLabel,
            tabBarPressColor: "transparent",
            tabBarItemStyle: {
              backgroundColor: "transparent",
            },
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: "As Seller",
              tabBarIcon: ({ color, focused, size }) => (
                <SellerIcon
                  width={16}
                  height={16}
                  color={color}
                  opacity={focused ? 1 : 0.4}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="buyer"
            options={{
              title: "As Buyer",
              tabBarIcon: ({ color, focused, size }) => (
                <BuyerIcon
                  width={16}
                  height={16}
                  color={color}
                  opacity={focused ? 1 : 0.4}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="complaint"
            options={{
              title: "Complaint",
              tabBarIcon: ({ color, focused, size }) => (
                <DisputeIcon
                  width={16}
                  height={16}
                  color={color}
                  opacity={focused ? 1 : 0.4}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="history"
            options={{
              title: "History",
              tabBarIcon: ({ color, focused, size }) => (
                <HistoryIcon
                  width={16}
                  height={16}
                  color={color}
                  opacity={focused ? 1 : 0.4}
                />
              ),
            }}
          />
        </Tabs>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  tabStyle: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 32,
    shadowColor: "##F5F5F5",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    height: 80,
    shadowRadius: 5,
    borderWidth: 0,
    borderTopWidth: 0,
    borderColor: "#00000000", // gray-200
    paddingHorizontal: 8,
    alignItems: "center",
  },
  tabIcon: {
    fontSize: 24,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});
