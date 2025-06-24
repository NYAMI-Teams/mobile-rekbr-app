import { router } from "expo-router";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NavBackHeader({ title, onBackPress = () => {
  router.back();
} }) {
  return (
    <View style={styles.appBar}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}>
        <Image
          source={require("@/assets/icon-back.png")}
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <Text style={styles.appBarTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: Platform.OS === "android" && 8
  },
  backButton: {
    paddingRight: 12,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  appBarTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 24,
  },
});
