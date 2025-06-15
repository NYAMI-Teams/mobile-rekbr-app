// screens/TransactionSummaryScreen.jsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info } from 'lucide-react-native';
import PrimaryButton from '../../components/PrimaryButton';
import RekeningKamu from '../../components/RekeningKamu';
import { useRouter } from 'expo-router';

export default function TransactionSummaryScreen({ bankData }) {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white relative">
            {/* Header */}
            <View className="flex-row items-center justify-center mb-6 relative">
                <TouchableOpacity className="absolute left-0" onPress={() => router.back()}>
                    <ChevronLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-center">Ringkasan Transaksi Rekber</Text>
            </View>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 160 }}
                className="px-4 pt-6"
            >

                {/* Rekening Kamu */}
                <RekeningKamu bankData={bankData} />

                {/* Detail Transaksi */}
                <View className="space-y-3 mb-6 mt-6">
                    <Text className="text-base text-gray-800">Pembeli Barang</Text>
                    <Text className="text-lg font-semibold text-gray-900">bayuseptyan925@gmail.com</Text>

                    <Text className="text-base text-gray-800 mt-4">Nama Barang</Text>
                    <Text className="text-lg font-semibold text-gray-900">Iphone 13 Pro Max</Text>

                    <Text className="text-base text-gray-800 mt-4">Nominal Barang</Text>
                    <Text className="text-lg font-semibold text-gray-900">Rp. 8.000.000,00</Text>
                </View>

                <View className="border-t border-gray-200 my-4" />

                {/* Biaya Tambahan */}
                <View className="mb-4">
                    <View className="flex-row items-center mb-1">
                        <Text className="text-lg text-gray-800">Asuransi Pengiriman BNI Life</Text>
                        <Info size={14} color="#888" className="ml-1" />
                    </View>
                    <Text className="text-base font-medium text-gray-800">Rp. 16.000,00</Text>
                </View>

                <View className="mb-6 mt-3">
                    <View className="flex-row items-center mb-1">
                        <Text className="text-lg text-gray-800">Biaya Jasa Aplikasi</Text>
                        <Info size={14} color="#888" className="ml-1" />
                    </View>
                    <Text className="text-base font-medium text-gray-800">Rp. 64.000,00</Text>
                </View>
            </ScrollView>

            {/* Footer */}
            <View className="p-3 border-t-2 rounded-t-3xl border-x-2 border-gray-200 drop-shadow-xl items-center justify-between">
                <View className="flex-row justify-between items-center mb-4 w-full px-2">
                    <Text className="text-base text-gray-700 font-medium">Total Tagihan Buyer</Text>
                    <Text className="text-xl font-bold text-gray-900">Rp. 8.080.000,00</Text>
                </View>
                <PrimaryButton
                    title="Generate VA dan Kirim"
                    onPress={() => {
                        // Aksi tombol
                        router.replace("/");
                    }}
                />
            </View>
        </SafeAreaView>
    );
}
