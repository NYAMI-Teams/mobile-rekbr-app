import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  Text,
  View,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { ChevronLeftCircle, Play } from 'lucide-react-native';
import StepSuccesBar from '../../components/SuccesBar';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current; // Start off-screen (bottom)

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setIsPaymentDone(false);
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
              }}
              className="bg-white px-5 pt-5 pb-8 rounded-t-3xl"
            >
              <Pressable onPress={closeModal}>
                <View className="flex-row items-center mb-6">
                  <ChevronLeftCircle size={24} color="#00C2C2" />
                  <Text className="text-lg font-semibold text-gray-800 ml-2">
                    {isPaymentDone ? 'Uang Kamu Kami Terima' : 'Mengecek...'}
                  </Text>
                </View>
              </Pressable>

              <View className="bg-green-100 flex-row items-center rounded-xl p-3 mb-4">
                <Text className="text-base font-semibold text-gray-500 ml-16">ID Transaksi</Text>
                <Text className="text-base font-semibold tracking-wider mt-1 ml-5">
                  RKB - 8080123456789
                </Text>
              </View>

              <View className="items-center px-4">
                <StepSuccesBar currentStep={isPaymentDone ? 1 : 0} steps={['Mengecek', 'Diterima']} />
              </View>

              {!isPaymentDone ? (
                <>
                  <Text className="text-center text-gray-600 mt-6 mb-1">
                    Kamu sebaiknya transfer sebelum :
                  </Text>
                  <View className="items-center mb-1">
                    <Text className="text-2xl font-bold bg-yellow-100 px-4 py-1 rounded-lg text-yellow-800">
                      03 : 00 : 00
                    </Text>
                  </View>
                  <Text className="text-center text-gray-600 mb-5">
                    09 Juni 2025, 17 : 00 WIB
                  </Text>

                  <Pressable
                    className="bg-gray-100 py-3 rounded-xl flex-row justify-center items-center mb-5"
                    onPress={() => setIsPaymentDone(true)}
                  >
                    <Play size={20} color="#000" />
                    <Text className="ml-2 font-semibold text-gray-800">Simulate Payment</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text className="text-xl font-bold text-center mt-6 mb-1">
                    Transaksi Berhasil Diproses
                  </Text>
                  <Text className="text-center text-gray-600 mb-5">
                    09 Juni 2025, 16 : 40 WIB
                  </Text>
                  <View className="flex-row justify-between items-center w-11/12 mb-5">
                    <Text className="text-xl font-semibold text-gray-500 ml-7">Buyer</Text>
                    <Text className="text-xl font-bold tracking-wide">0600604502</Text>
                  </View>
                </>
              )}

              <Text className="text-center text-gray-500">
                Terdapat kendala?{' '}
                <Text className="text-blue-500 font-medium">Silahkan Hubungi Kami</Text>
              </Text>
            </Animated.View>
          </View>
        </Modal>

        <Pressable
          className="bg-[#00C2C2] px-4 py-3 rounded-lg"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white font-semibold">Show Modal</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
