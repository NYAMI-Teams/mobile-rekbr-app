// BankSelector.jsx

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { Search } from 'lucide-react-native';

const BankSelector = ({ banks, onSelectBank }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBanks = banks?.filter((bank) =>
        bank.bankName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View>
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Cari Bank"
                    style={styles.searchInput}
                    placeholderTextColor="#A0A0A0"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Search size={18} color="#A0A0A0" />
            </View>

            <Text style={styles.sectionTitle}>Bank Terpopuler</Text>

            <ScrollView style={styles.bankList} showsVerticalScrollIndicator={false}>
                {filteredBanks?.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => onSelectBank(item)}
                        style={styles.bankItem}
                    >
                        <Image
                            source={{ uri: item.logoUrl }}
                            style={styles.bankLogo}
                            resizeMode="contain"
                        />
                        <Text style={styles.bankName}>{item.bankName}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1D5DB', // gray-300
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937', // gray-800
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937', // gray-800
        marginBottom: 16,
    },
    bankList: {
        marginBottom: 20,
    },
    bankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    bankLogo: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    bankName: {
        fontSize: 20,
        color: '#1F2937', // gray-800
        marginLeft: 12,
    },
});

export default BankSelector;
