import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Info } from 'lucide-react-native';

export default function BuyerKonfirmasi({ visible, onBtn2, onBtn1, title, btn1, btn2, isBatalkan = false }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onBtn1}
        >
            <View className="flex-1 justify-center items-center bg-black/30">
                <View className="bg-white rounded-2xl px-6 py-6 w-[90%] max-w-sm">
                    <View className="flex-row items-start mb-4 gap-2">
                        <Info size={20} color="#3B82F6" className="mt-1 mr-2" />
                        <Text className="text-[15px] font-medium flex-1">
                            {title}
                        </Text>
                    </View>
                    <View className="flex-row justify-between mt-4">
                        <TouchableOpacity
                            onPress={onBtn1}
                            className="flex-1 p-4 rounded-lg bg-gray-100 mr-2"
                        >
                            <Text className="text-center text-black font-medium">{btn1}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onBtn2}
                            className={`flex-1 p-4 rounded-lg ${isBatalkan ? "bg-red-100" : "bg-blue-100"} ml-2`}
                        >
                            <Text className="text-center text-black font-medium">{btn2}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
