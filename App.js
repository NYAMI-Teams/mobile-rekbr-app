import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import NavigationBar from "./src/components/NavigationBar";
import AccountBalance from "./src/components/AccountBalance";
import QuickActions from "./src/components/QuickActions";
// import Welcoming from './src/screens/e-KYC/Welcoming';
import AttachmentFilled from './src/components/AttachmentFilled';
import Register from './src/screens/register';
import "./global.css"


export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <NavigationBar onMenuPress={() => console.log("Menu pressed")} />
      <AccountBalance balance={10000000} />
      <QuickActions />
      <StepProgressBar currentStep={2} steps={steps} />
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
