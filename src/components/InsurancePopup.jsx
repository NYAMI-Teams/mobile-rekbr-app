import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Info } from 'lucide-react-native';

export default function InsurancePopup({ onClose }) {
  return (
    <View className="absolute inset-0 z-50 justify-center items-center bg-black/30">
      <SafeAreaView className="w-[90%] bg-white rounded-xl shadow-md p-4 border border-gray-200">
        <View className="flex-row items-start">
          <Info size={20} color="#3B82F6" className="mt-1 mr-2" />
          <View className="flex-1">
            <Text className="text-xl text-blue-600 font-medium mb-1">
              Asuransi BNI Life
            </Text>
            <Text className="text-xl font-semibold text-gray-700">
              Perlindungan kehilangan/kerusakan barang saat pengiriman. Biaya 0.2% dari nominal transaksi.
            </Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Text className="text-gray-400 text-xl ml-2">×</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
