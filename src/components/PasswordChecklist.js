import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
        <View style={styles.container}>
            {criteria.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                    <Feather
                        name={item.isValid ? 'check-circle' : 'x-circle'}
                        size={18}
                        color={item.isValid ? '#4ade80' : '#f87171'} // green-400 / red-400
                    />
                    <Text
                        style={[
                            styles.itemText,
                            { color: item.isValid ? '#16a34a' : '#f87171' }, // green-600 / red-400
                        ]}
                    >
                        {item.label}
                    </Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 4,
        gap: 4,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
    },
    itemText: {
        fontSize: 14,
    },
});

export default PasswordChecklist;
