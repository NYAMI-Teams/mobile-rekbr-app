// import React, { useState } from "react";
// import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
// import InputField from "../../components/InputField";
// import PrimaryButton from "../../components/PrimaryButton";
// import PasswordChecklist from "../../components/PasswordChecklist";
// import { MaterialIcons } from "@expo/vector-icons";
// import { Feather } from "@expo/vector-icons";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import { Alert } from "react-native";

// export default function Register() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);

//   const togglePasswordVisibility = () => {
//     setIsPasswordVisible(!isPasswordVisible);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setConfirmPasswordVisible(!confirmPasswordVisible);
//   };

//   const isPasswordValid = () => {
//     return (
//       password.length >= 8 &&
//       /[a-z]/.test(password) &&
//       /[A-Z]/.test(password) &&
//       /[0-9]/.test(password) &&
//       /[^a-zA-Z0-9]/.test(password)
//     );
//   };

//   const isFormValid = () => {
//     return (
//       //   name &&
//       //   email &&
//       //   isPasswordValid() &&
//       //   password === confirmPassword &&
//       //   isChecked
//       true
//     );
//   };

//   const handleRegister = () => {
//     // console.log("Registering with:", { name, email, password });
//     router.push("/auth/otp");
//   };

//   return (
//     <SafeAreaView className="bg-white">
//       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//         <View className="bg-white items-center mb-2">
//           <Image
//             source={require("../../assets/header.png")}
//             className="w-full h-[300px] rounded-b-2xl"
//             resizeMode="cover"
//           />
//         </View>

//         <View className="py-5">
//           {/* Email */}
//           <View className="mb-4">
//             <InputField
//               title="Email Kamu, Yuk!"
//               placeholder="email@kamu.com"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               inputClassName="pr-12"
//             />
//           </View>

//           {/* Password */}
//           <View className="relative mb-4">
//             <InputField
//               title="Kata Sandi Rekbr"
//               placeholder="Masukkan kata sandi kamu"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!isPasswordVisible}
//               isPassword={true}
//               inputClassName="pr-12"
//             />

//             <TouchableOpacity
//               className="absolute top-11 right-10"
//               onPress={togglePasswordVisibility}>
//               <MaterialIcons
//                 name={isPasswordVisible ? "visibility" : "visibility-off"}
//                 size={22}
//                 color="#666"
//               />
//             </TouchableOpacity>
//             <PasswordChecklist password={password} />
//           </View>

//           {/* Confirm Password */}
//           <View className="relative mb-4">
//             <InputField
//               title="Konfirmasi Kata Sandi Rekbr Kamu"
//               placeholder="Pastikan sama, ya!"
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//               secureTextEntry={!isPasswordVisible}
//               isPassword={true}
//               inputClassName="pr-12"
//             />

//             <TouchableOpacity
//               className="absolute top-11 right-10"
//               onPress={togglePasswordVisibility}>
//               <MaterialIcons
//                 name={isPasswordVisible ? "visibility" : "visibility-off"}
//                 size={22}
//                 color="#666"
//               />
//             </TouchableOpacity>

//             {/* Alert Validasi */}
//             {confirmPassword.length > 0 && (
//               <View className="flex-row items-center mt-2 mx-5">
//                 <Feather
//                   name={
//                     confirmPassword === password ? "check-circle" : "x-circle"
//                   }
//                   size={18}
//                   color={confirmPassword === password ? "#4ade80" : "#f87171"}
//                 />
//                 <Text
//                   className={`ml-2 text-sm ${confirmPassword === password
//                     ? "text-green-600"
//                     : "text-red-400"
//                     }`}>
//                   {confirmPassword === password
//                     ? "Kata sandi sesuai"
//                     : "Kata sandi tidak sesuai"}
//                 </Text>
//               </View>
//             )}
//           </View>

//           {/* Checkbox TnC */}
//           <View className="flex-row items-start  mt-4 px-5">
//             <TouchableOpacity
//               onPress={() => setIsChecked(!isChecked)}
//               className={`w-5 h-5 rounded border ${isChecked ? "bg-[#3ED6C5] border-[#3ED6C5]" : "border-gray-400"
//                 } items-center justify-center`}>
//               {isChecked && <Text className="text-white text-xs">✓</Text>}
//             </TouchableOpacity>

//             <Text className="ml-3 text-black text-sm">
//               Saya menyetujui Kebijakan Privasi yang berlaku
//             </Text>
//           </View>

//           <View className="px-5 py-5">
//             <PrimaryButton
//               title="Masuk"
//               onPress={handleRegister}
//               disabled={!isFormValid()}
//             />
//           </View>
//         </View>

//         <View className="items-center">
//           <View className="absolute bottom-0 left-0 right-0 h-52 rounded-b-3xl overflow-hidden z-[-1]">
//             <Image
//               source={require("../../assets/gradasi.png")}
//               className="w-full h-full absolute"
//               resizeMode="cover"
//             />
//           </View>

//           <View className="items-center mt-3">
//             <View className="flex-row items-center justify-between mb-4">
//               <Text className="text-sm px-3">Sudah punya akun?</Text>
//               <TouchableOpacity onPress={() => router.replace("/auth/login")}>
//                 <Text className="text-sm text-blue-600 font-medium">
//                   Silakan Login
//                 </Text>
//               </TouchableOpacity>
//             </View>
//             <View className="flex-row items-center justify-between mb-4">
//               <Text className="text-sm px-3">Terdapat kendala?</Text>
//               <TouchableOpacity
//                 onPress={() => Alert.alert("Berhasil terhubung")}>
//                 <Text className="text-sm text-blue-600 font-medium">
//                   Silakan Hubungi Kami
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View className="flex-row items-center space-x-1 mt-4">
//             <Text className="text-xs text-gray-600">Powered by</Text>
//             <Image
//               source={require("../../assets/326.png")}
//               className="w-4 h-4"
//               resizeMode="contain"
//             />
//             <Text className="text-xs font-semibold text-orange-500">
//               ADHIKSHA TRIBIXA
//             </Text>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation } from "expo-router";

export default function Dispute() {
  const navigation = useNavigation();
  const complaints = [
    {
      label: "Barang belum sampai atau kesasar",
      icon: require("../../assets/belumsampai.png"),
    },
    {
      label: "Barang rusak",
      icon: require("../../assets/barangrusak.png"),
    },
    {
      label: "Tidak sesuai deskripsi",
      icon: require("../../assets/tidaksesuai.png"),
    },
    {
      label: "Masalah atau komplain lainnya",
      icon: require("../../assets/komplain.png"),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4 pt-4">
        <View className="relative items-center justify-center mb-4">
          {/* Tombol Back di kiri */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-0"
          >
            <ChevronLeft size={24} color="black" />
          </TouchableOpacity>

          {/* Judul di tengah */}
          <Text className="text-xl font-semibold text-center">
            Permintaan Komplain Buyer
          </Text>
        </View>

        {/* Informasi Admin */}
        <View className="flex-row items-start bg-orange-50 p-4 rounded-xl mb-4 border border-orange-100 space-x-3">
          <Image
            source={require("../../assets/admin1.png")}
            className="w-10 h-10 rounded-full"
            resizeMode="contain"
          />
          <Text className="text-sm text-gray-700 flex-1">
            Harap tinjau kembali dan pastikan seluruh data kamu sebelum
            melanjutkan, ya!
          </Text>
        </View>

        {/* Info Email */}
        <Text className="text-lg font-medium text-black mb-3">
          Diskusi dengan{" "}
          <Text className="font-semibold">irgi168@gmail.com</Text>
        </Text>
        <Text className="text-base text-gray-500 mb-4">
          Cari resolusi yang lebih cepat, diskusikan dulu kendalamu dengan
          penjual
        </Text>

        {/* Button Email */}
        <View className="mb-6">
          <PrimaryButton
            title="Diskusi via email dengan penjual"
            className="mb-6"
          />
        </View>

        {/* Opsi Komplain */}
        <Text className="text-sm font-semibold mb-3">
          Pilih masalah untuk ajukan komplain
        </Text>
        <View className="flex-row flex-wrap justify-between gap-3">
          {complaints.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[48%] h-40 bg-white border border-gray-300 rounded-xl px-4 py-10 items-center justify-between"
            >
              <Image
                source={item.icon}
                className="w-10 h-10"
                resizeMode="contain"
              />
              <Text className="text-center text-xs font-medium text-black">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* Footer */}
      <View className="absolute bottom-16 left-0 right-0 items-center">
        <Text className="text-xs text-gray-400">
          Terdapat kendala?{" "}
          <Text className="text-blue-500 font-medium">
            Silahkan Hubungi Kami
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
