import { FontAwesome } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
    paddingVertical: 9, // p-3
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
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "As Seller",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              name='storefront'
              size={24}
              color={color}
              style={{ opacity: focused ? 1 : 0.4 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='buyer'
        options={{
          title: "As Buyer",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              name='wallet-outline'
              size={24}
              color={color}
              style={{ opacity: focused ? 1 : 0.4 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='complaint'
        options={{
          title: "Complaint",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              name='chat-processing-outline'
              size={24}
              color={color}
              style={{ opacity: focused ? 1 : 0.4 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='history'
        options={{
          title: "History",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              name='clock-time-three-outline'
              size={24}
              color={color}
              style={{ opacity: focused ? 1 : 0.4 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
