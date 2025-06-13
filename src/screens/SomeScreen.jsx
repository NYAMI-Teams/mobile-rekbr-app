import React, { useState } from 'react';
import { View, Button } from 'react-native';
import InsurancePopup from '../components/InsurancePopup';

export default function SomeScreen() {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <View className="flex-1 justify-center items-center">
            <Button title="Tampilkan Info Asuransi" onPress={() => setShowPopup(true)} />
            {showPopup && <InsurancePopup onClose={() => setShowPopup(false)} />}
        </View>
    );
}