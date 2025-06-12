import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import PasswordChecklist from '../../components/PasswordChecklist';
import { MaterialIcons } from '@expo/vector-icons';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const isPasswordValid = () => {
    return (
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^a-zA-Z0-9]/.test(password)
    );
  };

  const isFormValid = () => {
    return (
      name &&
      email &&
      isPasswordValid() &&
      password === confirmPassword
    );
  };

  const handleRegister = () => {
    console.log('Registering with:', { name, email, password });
  };

  return (
    <ScrollView className="flex-1 bg-white relative">
      <View className="bg-white items-center mb-2">
        <Image
          source={require('../../../assets/header.png')}
          className="w-full h-[300px] rounded-b-2xl"
          resizeMode="cover"
        />
      </View>

      <View className="px-6 py-5">
        {/* Email */}
        <View className="mb-4">
          <Text className="mb-2 text-base text-black">Email Kamu, Yuk!</Text>
          <InputField
            placeholder="email@kamu.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View className="relative">
          <InputField
            placeholder="Masukkan kata sandi kamu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            isPassword={true}
          />
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={togglePasswordVisibility}
          >
            <MaterialIcons
              name={isPasswordVisible ? 'visibility' : 'visibility-off'}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
          <PasswordChecklist password={password} />
        </View>

        {/* Confirm Password */}
        <View className="relative">
          <InputField
            placeholder="Masukkan kata sandi kamu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            isPassword={true}
          />
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={togglePasswordVisibility}
          >
            <MaterialIcons
              name={isPasswordVisible ? 'visibility' : 'visibility-off'}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="items-center space-y-4">
        <View className="absolute bottom-0 left-0 right-0 h-52 rounded-b-3xl overflow-hidden z-[-1]">
          <Image
            source={require('../../../assets/gradasi.png')}
            className="w-full h-full absolute"
            resizeMode="cover"
          />
        </View>

        <PrimaryButton title="Masuk" onPress={handleRegister} disabled={!isFormValid()} />

        <View className="items-center space-y-1 mt-3">
          <Text className="text-sm mb-4">
            Belum punya akun?{' '}
            <Text className="text-blue-600 font-medium">Silakan Registrasi</Text>
          </Text>
          <Text className="text-sm mb-2">
            Terdapat kendala?{' '}
            <Text className="text-blue-600 font-medium">Silakan Hubungi Kami</Text>
          </Text>
        </View>

        <View className="flex-row items-center space-x-1 mt-4">
          <Text className="text-xs text-gray-600">Powered by</Text>
          <Image
            source={require('../../../assets/326.png')}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-xs font-semibold text-orange-500">ADHIKSHA TRIBIXA</Text>
        </View>
      </View>
    </ScrollView>
  );
}
