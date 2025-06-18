import { View, Text, TouchableOpacity, Image } from "react-native";
import { ChevronLeft, ClipboardPaste, ChevronDown } from "lucide-react-native";

const ProblemDisplay = ({image, problemType} ) => {
  return (
    <View>
      <Text className="text-sm font-semibold text-black mb-2">
        Masalah yang dipilih
      </Text>
      <View className="flex-row justify-between items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6 shadow-sm">
        <View className="flex-row items-center space-x-2">
          <Image
            source={image}
            className="w-6 h-6"
            resizeMode="contain"
          />
          <Text className="text-sm font-medium ml-5">{problemType}</Text>
        </View>
        <TouchableOpacity>
          <Text className="text-sm text-blue-500 font-medium">Ganti</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProblemDisplay;