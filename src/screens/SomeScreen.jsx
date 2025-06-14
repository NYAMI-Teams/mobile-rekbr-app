import React, { useState } from 'react';
import { View, Button } from 'react-native';
import InsurancePopup from '../components/InsurancePopup';
import BuyerDispute from '../components/BuyerDispute';
import BuyerKonfirmasi from '../components/BuyerKonfirmasi';

export default function SomeScreen() {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <View className="flex-1 justify-center items-center">
            <Button title="Tampilkan Info" onPress={() => setShowPopup(true)} />
            {showPopup && <BuyerKonfirmasi onClose={() => setShowPopup(false)} />}
        </View>
    );
}