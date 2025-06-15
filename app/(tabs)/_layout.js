import { FontAwesome } from '@expo/vector-icons';
import { Stack, Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} >
      <Tabs.Screen
        name="seller" // nama filenya
        options={{
          title: 'As Seller',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="buyer"
        options={{
          title: 'As Buyer',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="dispute"
        options={{
          title: 'Dispute',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}
