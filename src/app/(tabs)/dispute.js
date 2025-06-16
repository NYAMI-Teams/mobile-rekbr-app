import { View, StatusBar } from "react-native";
import NavigationBar from "../../components/NavigationBar";
import InputResi from "../../components/InputResi";

export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, padding: 16 }}>
        {/* <NavigationBar
          name="irgi168@gmail.com"
          onNotificationPress={() => console.log("Notification pressed")}
          onProfilePress={() => console.log("Notification pressed")}
        /> */}
        <InputResi />
      </View>
    </View>
  );
}
