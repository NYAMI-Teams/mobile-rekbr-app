import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import NavigationBar from "./src/components/NavigationBar";
import AccountBalance from "./src/components/AccountBalance";
import QuickActions from "./src/components/QuickActions";
import PrimaryButton from "./src/components/PrimaryButton";
import AuthLink from "./src/components/AuthLinks";
import InputField from "./src/components/InputField";




export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <NavigationBar onMenuPress={() => console.log("Menu pressed")} />
      <AccountBalance balance={10000000} />
      <QuickActions />
      <Login />
      <Register />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});
