import { View, Text, Image, StyleSheet } from "react-native";

export const InfoBanner = ({ contentBefore, dateTime, contentAfter }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/admin1.png")}
        style={styles.icon}
      />
      <Text style={styles.text}>
        {contentBefore}
        {dateTime && (
          <>
            {" "}
            <Text style={styles.bold}>{dateTime}</Text>
          </>
        )}
        {contentAfter}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 24,
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 16,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    lineHeight: 20,
  },
  bold: {
    fontWeight: "bold",
  },
});
