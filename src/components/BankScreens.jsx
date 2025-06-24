// BankScreens.jsx

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { Search } from 'lucide-react-native';

const BankSelector = ({ banks, onSelectBank }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBanks = banks?.filter((bank) =>
        bank.bankName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 mb-5">
                <TextInput
                    placeholder="Cari Bank"
                    className="flex-1 text-base text-gray-800"
                    placeholderTextColor="#A0A0A0"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Search size={18} color="#A0A0A0" />
            </View>

            <Text className="text-base font-semibold text-gray-800 mb-4">
                Bank Terpopuler
            </Text>

            <ScrollView className="mb-5" showsVerticalScrollIndicator={false}>
                {filteredBanks?.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => onSelectBank(item)}
                        className="flex-row items-center space-x-3 mb-5"
                    >
                        <Image
                            source={{ uri: item.logoUrl }}
                            className="w-20 h-20 rounded-md"
                            resizeMode="contain"
                        />
                        <Text className="text-xl text-gray-800 ml-3">{item.bankName}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default BankSelector;
