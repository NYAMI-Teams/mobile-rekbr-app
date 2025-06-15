import { View, Text, SafeAreaView } from "react-native";
import BankSelector from "../../../src/components/BankScreens";
import { mockBank } from "../../../src/services/apiMock/api";
import Modal from "react-native-modal";
import {
  Alert,
  Animated,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ChevronLeftCircle } from "lucide-react-native";
import Image from "react-native";
import { useState, useRef, useEffect } from "react";

export default function SelectBank() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const slideAnim = useRef(new Animated.Value(300)).current;

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setIsPaymentDone(false);
      setAccountNumber("");
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
    if (key === "x") {
      setAccountNumber((prev) => prev.slice(0, -1));
    } else if (key !== "") {
      setAccountNumber((prev) => prev + key);
    }
  };

  const handleBackToBankSelection = () => {
    setIsPaymentDone(false);
    setAccountNumber("");
  };

  return (
    <SafeAreaView>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          closeModal();
        }}>
        <View className="flex-1 justify-end bg-black/30">
          <Animated.View
            style={{ transform: [{ translateY: slideAnim }] }}
            className="bg-white px-5 pt-5 pb-8 rounded-t-3xl">
            <Pressable
              onPress={isPaymentDone ? handleBackToBankSelection : closeModal}>
              <View className="flex-row items-center mb-6">
                <ChevronLeftCircle size={24} color="#00C2C2" />
                <Text className="text-lg font-semibold text-gray-800 ml-2">
                  {isPaymentDone
                    ? "Masukan No Rekening Kamu"
                    : "Pilih Bank Kamu"}
                </Text>
              </View>
            </Pressable>

            {!isPaymentDone ? (
              <BankSelector
                banks={mockBank.data}
                onSelectBank={(bank) => {
                  setSelectedBank(bank);
                  setIsPaymentDone(true);
                }}
              />
            ) : (
              <>
                {selectedBank && (
                  <View className="flex-row items-center space-x-3 mt-2 mb-6">
                    <Image
                      source={{ uri: selectedBank.logo }}
                      className="w-10 h-10 rounded"
                      resizeMode="contain"
                    />
                    <Text className="text-base font-medium">
                      {selectedBank.name}
                    </Text>
                  </View>
                )}

                <View className="mt-2">
                  <Text className="text-sm font-medium mb-1">
                    Nomor Rekening
                  </Text>
                  <TextInput
                    value={accountNumber}
                    placeholder="Contoh : 00900604501"
                    editable={false}
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-gray-100 text-black"
                  />
                </View>

                <View className="flex-row flex-wrap justify-between mt-8 px-4">
                  {keys.map((key, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleKeyPress(key)}
                      className="size-[83px] aspect-square rounded-full bg-white border border-gray-300 justify-center items-center mb-4 shadow-sm">
                      <Text className="text-2xl font-semibold text-gray-800">
                        {key}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity className="bg-black rounded-lg py-4 mt-2">
                  <Text className="text-white text-center font-semibold text-base">
                    Cek Rekening
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
