import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';

const PasswordChecklist = ({ password }) => {
    const criteria = [
        {
            label: 'Minimal 8 karakter',
            isValid: password.length >= 8,
        },
        {
            label: 'Mengandung huruf besar',
            isValid: /[A-Z]/.test(password),
        },
        {
            label: 'Mengandung huruf kecil',
            isValid: /[a-z]/.test(password),
        },
        {
            label: 'Mengandung angka',
            isValid: /[0-9]/.test(password),
        },
        {
            label: 'Mengandung simbol',
            isValid: /[^A-Za-z0-9]/.test(password),
        },
    ];

    return (
        <View className="mt-3 space-y-2">
            {criteria.map((item, index) => (
                <View key={index} className="flex-row items-center space-x-2">
                    <Feather
                        name={item.isValid ? 'check-circle' : 'x-circle'}
                        size={18}
                        color={item.isValid ? '#4ade80' : '#f87171'} // green-400 / red-400
                    />
                    <Text className={`text-sm ${item.isValid ? 'text-green-600' : 'text-red-400'}`}>
                        {item.label}
                    </Text>
                </View>
            ))}
        </View>
    );
};

export default PasswordChecklist;