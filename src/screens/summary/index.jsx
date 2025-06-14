// screens/TransactionSummaryScreen.jsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info } from 'lucide-react-native';
import PrimaryButton from '../../components/PrimaryButton';
import RekeningKamu from '../../components/RekeningKamu';

export default function TransactionSummaryScreen() {
    const bankData = {
        accountHolder: 'Sdr Bayu Saptaji Rahman',
        bankName: 'Bank Negara Indonesia',
        accountNumber: '0900604501',
        logoSrc: {
            uri: 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/2560px-BNI_logo.svg.png',
        },
    };

    return (
        <SafeAreaView className="flex-1 bg-white relative">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 160 }}
                className="px-4 pt-6"
            >
                {/* Header */}
                <View className="flex-row items-center justify-center mb-6 relative">
                    <TouchableOpacity className="absolute left-0">
                        <ChevronLeft size={24} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-lg font-semibold text-center">Ringkasan Transaksi Rekber</Text>
                </View>

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
            <View className="absolute bottom-0 left-0 right-0 bg-gray-100 rounded-t-2xl px-4 py-5 mb-4">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-base text-gray-700 font-medium">Total Tagihan Buyer</Text>
                    <Text className="text-xl font-bold text-gray-900">Rp. 8.080.000,00</Text>
                </View>
                <PrimaryButton
                    title="Generate VA dan Kirim"
                    onPress={() => {
                        // Aksi tombol
                    }}
                />
            </View>
        </SafeAreaView>
    );
}
