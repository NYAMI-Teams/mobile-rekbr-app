import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import "./global.css";

export default function App() {
  const params = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});
