import React from 'react';
import { Image, Text, StyleSheet } from 'react-native';

export default function EmptyIllustration({ text }) {
    return (
        <>
            <Image
                source={require('../assets/illustration-empty.png')}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.text}>{text}</Text>
        </>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 288, // 72 * 4 (karena Tailwind w-72 = 18rem = 288px)
        height: 288,
        marginBottom: 16,
    },
    text: {
        fontSize: 14, // Tailwind text-sm
        color: '#4B5563', // Tailwind gray-600
        fontWeight: '400', // normal
        textAlign: 'center',
    },
});
