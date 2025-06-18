import { FontAwesome } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  tabStyle: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 48, // rounded-t-3xl (3xl = 1.75rem = 28px * 1.75 = 48px)
    borderTopRightRadius: 48,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 80,
    borderWidth: 2,
    borderTopWidth: 2,
    borderColor: "#e5e7eb", // gray-200
    paddingHorizontal: 12, // p-3
    paddingVertical: 9,    // p-3
    alignItems: "center",
  },
  tabBar: {
    backgroundColor: "#fff",
    height: 80,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default function TabLayout() {
  return (

    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#3ED6C5",
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: styles.tabLabel,
        tabStyle: styles.tabStyle,
      }}>
      <Tabs.Screen
        name="index" // nama filenya
        options={{
          title: "As Seller",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="buyer"
        options={{
          title: "As Buyer",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="shopping-cart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dispute"
        options={{
          title: "Dispute",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="exclamation-circle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
