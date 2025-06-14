import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { Info } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BuyerDispute({ visible, onCancel, onComplain, onClose }) {
    return (
        <View className="absolute inset-0 z-50 justify-center items-center bg-black/30">
            <SafeAreaView className="w-[90%] bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <Modal visible={visible} transparent animationType="fade">
                    <View className="flex-1 justify-center items-center bg-black/30">
                        <View className="bg-white rounded-2xl p-5 mx-6 shadow-lg w-full max-w-sm">
                            <View className="flex-row items-start mb-4">
                                <Info size={25} color="#3B82F6" className="mt-1 mr-2" />
                                <Text className="text-lg text-black font-medium">
                                    Masalah sama barang? Cek dulu, baru ajukan komplain. Kami siap bantu!
                                </Text>
                            </View>

                            <View className="flex-row justify-between mt-4">
                                <Pressable
                                    onPress={onClose}
                                    className="flex-1 py-2 rounded-full bg-gray-100 mr-2"
                                >
                                    <Text className="text-center text-black font-semibold">Batalin</Text>
                                </Pressable>
                                <Pressable
                                    onPress={onComplain}
                                    className="flex-1 py-2 rounded-full bg-red-100 ml-2"
                                >
                                    <Text className="text-center text-red-700 font-semibold">Komplain</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View >
    );
}
