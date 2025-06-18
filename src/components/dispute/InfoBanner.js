import { View, Text, Image } from "react-native";

export const InfoBanner = ({ contentBefore, dateTime, contentAfter }) => {
  return (
    <View className="flex-row px-4 mt-6">
      <Image
        source={require("../../assets/admin1.png")}
        className="w-5 h-5 mr-4"
      />
      <Text className="flex-1 text-base text-gray-700 leading-5">
        {contentBefore}
        {dateTime && (
          <>
            {" "}
            <Text className="font-bold">{dateTime}</Text>
          </>
        )}
        {contentAfter}
      </Text>
    </View>
  );
};
