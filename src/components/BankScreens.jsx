import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Search } from 'lucide-react-native';

const BankSelector = ({ banks, onSelectBank }) => {
  return (
    <>
      <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 mb-5">
        <TextInput
          placeholder="Cari Bank"
          className="flex-1 text-base text-gray-800"
          placeholderTextColor="#A0A0A0"
        />
        <Search size={18} color="#A0A0A0" />
      </View>

      <Text className="text-base font-semibold text-gray-800 mb-4">
        Bank Terpopuler
      </Text>

      <FlatList
        data={banks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelectBank(item)}
            className="flex-row items-center space-x-3 mb-5"
          >
            <Image
              source={{ uri: item.logo }}
              className="w-20 h-20 rounded-md"
              resizeMode="contain"
            />
            <Text className="text-xl text-gray-800 ml-3">{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </>
  );
};

export default BankSelector;
