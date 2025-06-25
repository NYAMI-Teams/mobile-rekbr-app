import { View } from "react-native";
import Shimmer from "./Shimmer";

export default function TransactionSkeleton() {
  return (
    <View className='border border-gray-200 rounded-lg overflow-hidden my-2 w-full bg-white'>
      {/* Detail Section */}
      <View className='p-3'>
        {[1, 2, 3].map((_, index) => (
          <View
            key={index}
            className='flex-row justify-between items-center mb-2'
          >
            <Shimmer style={{ width: "40%", height: 16, borderRadius: 4 }} />
            <Shimmer style={{ width: "50%", height: 16, borderRadius: 4 }} />
          </View>
        ))}
      </View>

      {/* Status Section */}
      <View className='bg-gray-100 border-t border-gray-200 p-3'>
        <View className='flex-row justify-between items-center'>
          <View className='flex-row items-center gap-2'>
            <Shimmer style={{ width: 8, height: 8, borderRadius: 4 }} />
            <Shimmer style={{ width: 96, height: 12, borderRadius: 4 }} />
          </View>
          <Shimmer style={{ width: 96, height: 24, borderRadius: 12 }} />
        </View>
      </View>
    </View>
  );
}
