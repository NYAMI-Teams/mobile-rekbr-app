// index.jsx

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Modal,
    Animated,
    Easing,
    Pressable,
    Alert,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { ChevronLeftCircle } from 'lucide-react-native';
import BankSelector from '../../components/BankScreens'; // pakai file BankScreens.jsx kamu

const banks = [
    {
        id: 'bni',
        name: 'Bank Negara Indonesia',
        logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/2560px-BNI_logo.svg.png',
    },
    {
        id: 'bca',
        name: 'Bank Central Asia',
        logo: 'https://www.bca.co.id/-/media/Feature/Card/List-Card/Tentang-BCA/Brand-Assets/Logo-BCA/Logo-BCA_Biru.png',
    },
    {
        id: 'bri',
        name: 'Bank Rakyat Indonesia',
        logo: 'https://buatlogoonline.com/wp-content/uploads/2022/10/Logo-Bank-BRI.png',
    },
    {
        id: 'bsi',
        name: 'Bank Syariah Indonesia',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bank_Syariah_Indonesia.svg/1200px-Bank_Syariah_Indonesia.svg.png',
    },
    {
        id: 'mandiri',
        name: 'Bank Mandiri',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/1280px-Bank_Mandiri_logo_2016.svg.png',
    },
];

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'x'];

const BankScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isPaymentDone, setIsPaymentDone] = useState(false);
    const [isAccountVerified, setIsAccountVerified] = useState(false);
    const [accountHolderName, setAccountHolderName] = useState('');
    const [selectedBank, setSelectedBank] = useState(null);
    const [accountNumber, setAccountNumber] = useState('');
    const slideAnim = useRef(new Animated.Value(300)).current;

    const closeModal = () => {
        Animated.timing(slideAnim, {
            toValue: 300,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false);
            setIsPaymentDone(false);
            setIsAccountVerified(false);
            setAccountHolderName('');
            setAccountNumber('');
        });
    };

    useEffect(() => {
        if (modalVisible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }).start();
        }
    }, [modalVisible]);

    const handleKeyPress = (key) => {
        if (key === 'x') {
            setAccountNumber((prev) => prev.slice(0, -1));
        } else if (key !== '') {
            setAccountNumber((prev) => prev + key);
        }
    };

    const handleBackToBankSelection = () => {
        setIsPaymentDone(false);
        setIsAccountVerified(false);
        setAccountHolderName('');
        setAccountNumber('');
    };

    const handleCheckAccount = () => {
        // Simulasi verifikasi akun
        setAccountHolderName('Sdr Bayu Saptaji Rahman');
        setIsAccountVerified(true);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        closeModal();
                    }}
                >
                    <View className="flex-1 justify-end bg-black/30">
                        <Animated.View
                            style={{
                                transform: [{ translateY: slideAnim }],
                                height: '80%', // modal lebih tinggi
                                borderTopLeftRadius: 24,
                                borderTopRightRadius: 24,
                            }}
                            className="bg-white px-5 pt-5 pb-8"
                        >
                            {/* Handle di atas */}
                            <View className="w-14 h-1.5 bg-gray-300 rounded-full self-center mb-5" />

                            <Pressable onPress={isPaymentDone ? handleBackToBankSelection : closeModal}>
                                <View className="flex-row items-center mb-6">
                                    <ChevronLeftCircle size={24} color="#00C2C2" />
                                    <Text className="text-lg font-semibold text-gray-800 ml-2">
                                        {isAccountVerified
                                            ? 'Rekening Kamu Ditemukan'
                                            : isPaymentDone
                                            ? 'Masukkan No Rekening Kamu'
                                            : 'Pilih Bank Kamu'}
                                    </Text>
                                </View>
                            </Pressable>

                            {!isPaymentDone && (
                                <BankSelector
                                    banks={banks}
                                    onSelectBank={(bank) => {
                                        setSelectedBank(bank);
                                        setIsPaymentDone(true);
                                    }}
                                />
                            )}

                            {isPaymentDone && !isAccountVerified && (
                                <>
                                    {selectedBank && (
                                        <View className="flex-row items-center space-x-3 mt-2 mb-6">
                                            <Image
                                                source={{ uri: selectedBank.logo }}
                                                className="w-10 h-10 rounded"
                                                resizeMode="contain"
                                            />
                                            <Text className="text-base font-medium">{selectedBank.name}</Text>
                                        </View>
                                    )}

                                    <View className="mt-2">
                                        <Text className="text-sm font-medium mb-1">Nomor Rekening</Text>
                                        <TextInput
                                            value={accountNumber}
                                            placeholder="Contoh : 00900604501"
                                            editable={false}
                                            className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-gray-100 text-black"
                                        />
                                    </View>

                                    <View className="flex-row flex-wrap justify-center mt-8 px-4">
                                    <View className="flex-row flex-wrap justify-center mt-8 px-4">
                                        {keys.map((key, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => handleKeyPress(key)}
                                                className="w-[90px] h-[90px] rounded-full bg-white border border-gray-300 justify-center items-center m-2 shadow-sm"
                                                className="w-[90px] h-[90px] rounded-full bg-white border border-gray-300 justify-center items-center m-2 shadow-sm"
                                            >
                                                <Text className="text-2xl font-semibold text-gray-800">{key}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>



                                    <TouchableOpacity className="bg-black rounded-lg py-4 mt-2">
                                        <Text className="text-white text-center font-semibold text-base">Cek Rekening</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            {isAccountVerified && (
                                <View className="bg-[#F0FCFC] p-4 rounded-xl">
                                    <Text className="text-lg font-semibold mb-4">{accountHolderName}</Text>
                                    <View className="flex-row items-center">
                                        <Image
                                            source={{ uri: selectedBank.logo }}
                                            className="w-8 h-8"
                                            resizeMode="contain"
                                            style={{ marginRight: 12 }} // Jarak logo & teks diperbaiki
                                        />
                                        <Text className="text-base font-medium">{selectedBank.name}</Text>
                                    </View>
                                </View>
                            )}
                        </Animated.View>
                    </View>
                </Modal>

                <Pressable
                    className="bg-[#00C2C2] px-4 py-3 rounded-lg"
                    onPress={() => setModalVisible(true)}
                >
                    <Text className="text-white font-semibold">
                        {selectedBank ? selectedBank.name : 'Pilih Bank'}
                    </Text>
                </Pressable>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default BankScreen;
