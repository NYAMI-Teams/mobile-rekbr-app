import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Info } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BuyerKonfirmasi({ visible, onBtn2, onBtn1, title, btn1, btn2, isBatalkan = false }) {
    return (
        // <View className="absolute inset-0 z-50 justify-center items-center bg-black/30 ">
        //     {/* <SafeAreaView className="w-[90%] bg-white rounded-xl shadow-md p-4 border border-gray-200"> */}
                
        //     {/* </SafeAreaView> */}
        // </View >
        
        <Modal visible={visible} transparent animationType="fade" className="absolute inset-0 z-50 justify-center items-center bg-black/30 h-20 flex-1">
                    <View className="flex-1 justify-center items-center bg-black/30 ">
                        <View className="bg-white rounded-2xl p-5 mx-6 shadow-lg w-full max-w-sm h-[18%]">
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
