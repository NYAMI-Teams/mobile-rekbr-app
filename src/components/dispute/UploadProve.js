import { View, Text, TouchableOpacity, Image } from "react-native";

export const UploadProve = ({
  media,
  pickMedia,
  setShowTipsModal,
}) => {
  return (
    <View>
      <Text className="text-sm font-semibold text-black mb-2">
        Bukti foto & video
      </Text>
      <Text className="text-xs text-gray-600 mb-1">
        Unggah maksimal <Text className="font-semibold">5 foto</Text> atau{" "}
        <Text className="font-semibold">4 foto + 1 video</Text>. Format: .jpg,
        .png, .mp4, .mov. Maks. 10 MB (foto), 50 MB (video).
      </Text>
      <TouchableOpacity onPress={() => setShowTipsModal(true)}>
        <Text className="text-xs text-blue-500 font-medium mb-3">Pelajari</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={pickMedia}
        className="w-16 h-16 border border-gray-400 rounded-xl items-center justify-center mb-4"
      >
        <Text className="text-2xl text-gray-500">＋</Text>
      </TouchableOpacity>
      <View className="flex-row flex-wrap gap-3 mb-8">
        {media.map((item, idx) => (
          <View
            key={idx}
            className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden"
          >
            {item.type === "image" ? (
              <Image source={{ uri: item.uri }} className="w-full h-full" />
            ) : (
              <View className="w-full h-full justify-center items-center bg-black">
                <Text className="text-xs text-white">🎥 Video</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};
