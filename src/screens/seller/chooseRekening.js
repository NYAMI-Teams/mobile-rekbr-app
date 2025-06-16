import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Platform,
  StatusBar,
  FlatList,
  Animated,
  UIManager,
  LayoutAnimation,
  Alert,
  Pressable,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import BankSelector from "../../../src/components/BankScreens";
import { mockBank } from "../../../src/services/apiMock/api";
import { ChevronLeftCircle } from "lucide-react-native";
import PrimaryButton from "../../components/PrimaryButton";
import CreateRekber from "../../../app/CreateTransaksi/CreateRekbr/index";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const initialFavorites = [];

const initialSaved = [
  {
    id: "1",
    name: "Bayu",
    bank: "Bank Negara Indonesia",
    accountNumber: "0900604501",
    bankLogo: require("../../../assets/logo-bni.png"),
    isFavorite: false,
  },
  {
    id: "2",
    name: "Zhirazzi",
    bank: "Bank Negara Indonesia",
    accountNumber: "0900604502",
    bankLogo: require("../../../assets/logo-bni.png"),
    isFavorite: false,
  },
  {
    id: "3",
    name: "Diffa",
    bank: "Bank Negara Indonesia",
    accountNumber: "0900604503",
    bankLogo: require("../../../assets/logo-bni.png"),
    isFavorite: false,
  },
  {
    id: "4",
    name: "Reynhard",
    bank: "Bank Negara Indonesia",
    accountNumber: "0900604504",
    bankLogo: require("../../../assets/logo-bni.png"),
    isFavorite: false,
  },
];

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "x"]; // The null will be handled in the map function

const formatAccountNumber = (number) => {
  if (!number) return "";
  return number.slice(0, 4) + "XXXXX";
};

export default function PilihRekeningScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState(initialFavorites);
  const [saved, setSaved] = useState(initialSaved);

  const [modalVisible, setModalVisible] = useState(false);
  const [isSelectBankDone, setIsSelectBankDone] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [isAlreadyCheckedRekening, setIsAlreadyCheckedRekening] =
    useState(false);
  const slideAnim = useRef(new Animated.Value(250)).current;

  const closeModal = () => {
    setModalVisible(false);
    setIsSelectBankDone(false);
    setAccountNumber("");
  };

  const handleKeyPress = (key) => {
    if (key === "x") {
      setAccountNumber((prev) => prev.slice(0, -1));
    } else if (key !== "") {
      setAccountNumber((prev) => prev + key);
    }
  };

  const handleBackToBankSelection = () => {
    setIsSelectBankDone(false);
    setAccountNumber("");
  };

  const handleBackToInputRekening = () => {
    setIsAlreadyCheckedRekening(false);
  };

  const handleToCreateRekbr = () => {
    setIsAlreadyCheckedRekening(true);
    setModalVisible(false);
    router.push("/CreateTransaksi/CreateRekbr");
  };

  const toggleFavorite = (item, fromFavorites) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (fromFavorites) {
      setFavorites((prev) => prev.filter((x) => x.id !== item.id));
      setSaved((prev) => [{ ...item, isFavorite: false }, ...prev]);
    } else {
      setSaved((prev) => prev.filter((x) => x.id !== item.id));
      setFavorites((prev) => [{ ...item, isFavorite: true }, ...prev]);
    }
  };

  const renderAccountItem = (item, fromFavorites, index) => {
    return (
      // <View style={styles.accountItemContainer}>
      <AnimatedAccountItem
        item={item}
        fromFavorites={fromFavorites}
        toggleFavorite={() => toggleFavorite(item, fromFavorites)}
        index={index}
      />
      // </View>
    );
  };

  const isEmpty = favorites.length === 0 && saved.length === 0;
  const isSavedEmpty = saved.length === 0;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.appBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Image
              source={require("../../../assets/icon-back.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Pilih Rekening Kamu</Text>
        </View>

        <View style={styles.topBackground}>
          <Image
            source={require("../../../assets/illustration-transfer.png")}
            style={styles.topImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Cari nama, bank, atau nomor rekening"
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
          <Image
            source={require("../../../assets/icon-search.png")}
            style={styles.searchIcon}
          />
        </View>

        {isEmpty ? (
          <View style={styles.emptyState}>
            <Image
              source={require("../../../assets/illustration-empty.png")}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>
              Kamu belum pernah transaksi sebelumnya, jadi belum ada tujuan
              rekening yang bisa dituju.
            </Text>
          </View>
        ) : (
          <FlatList
            ListHeaderComponent={
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingTop: 16,
                }}
              >
                <Text style={styles.sectionTitle}>Tujuan Favorit kamu!</Text>
                {favorites.length === 0 ? (
                  <Text style={styles.noFavoritesText}>
                    Tambah tujuan favorit kamu biar lebih gampang nyarinya
                    nanti, biar nggak ribet!
                  </Text>
                ) : (
                  favorites.map((item, index) =>
                    renderAccountItem(item, true, index)
                  )
                )}

                {!isSavedEmpty && (
                  <>
                    <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                      Tujuan Tersimpan
                    </Text>
                    {saved.map((item, index) =>
                      renderAccountItem(item, false, index)
                    )}
                  </>
                )}
              </View>
            }
            data={[]}
            renderItem={null}
            keyExtractor={() => ""}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 100,
              width: "100%",
            }}
          />
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Rekening</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 w-full h-full bg-red-500">
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              closeModal();
            }}
          >
            <View className="bg-black/50 w-full h-full">
              <Animated.View
                style={{ transform: [{ translateY: slideAnim }] }}
                className="bg-white px-5 pt-5 pb-8 rounded-t-3xl"
              >
                <Pressable
                  onPress={
                    isAlreadyCheckedRekening
                      ? handleBackToInputRekening
                      : isSelectBankDone
                      ? handleBackToBankSelection
                      : closeModal
                  }
                >
                  <View className="flex-row items-center mb-6">
                    <ChevronLeftCircle size={24} color="#00C2C2" />
                    <Text className="text-lg font-normal text-gray-800 ml-2">
                      {!isSelectBankDone
                        ? "Pilih Bank Kamu"
                        : !isAlreadyCheckedRekening
                        ? "Masukan No Rekening Kamu"
                        : "Rekening Kamu Ditemukan"}
                    </Text>
                  </View>
                </Pressable>

                {!isSelectBankDone ? (
                  <BankSelector
                    banks={mockBank.data}
                    onSelectBank={(bank) => {
                      setSelectedBank({
                        logoSrc: bank.logoUrl,
                        name: bank.bankName,
                        bankId: bank.bankId,
                      });
                      setIsSelectBankDone(true);
                    }}
                  />
                ) : !isAlreadyCheckedRekening ? (
                  <>
                    {selectedBank && (
                      <View className="flex-row items-center mt-2 mb-2 gap-4">
                        <View className="w-20 h-10 rounded bg-[#EDFBFA] justify-center items-center py-2">
                          <Image
                            source={{ uri: selectedBank.logo }}
                            className="w-12 h-12 object-contain"
                            resizeMode="contain"
                          />
                        </View>
                        <Text className="text-base font-normal">
                          {selectedBank.name}
                        </Text>
                      </View>
                    )}

                    <View className="mt-2">
                      <Text className="text-sm font-normal mb-1">
                        Nomor Rekening
                      </Text>
                      <TextInput
                        value={accountNumber}
                        placeholder="Contoh : 00900604501"
                        editable={false}
                        className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-gray-100 text-black"
                      />
                    </View>

                    <View className="w-full items-center justify-center">
                      <View className="flex-row flex-wrap justify-center items-center mt-8 px-6 w-[80%]">
                        {keys.map((key, index) => {
                          // Tombol 1-9
                          if (index < 9) {
                            return (
                              <View
                                key={index}
                                className="w-1/3 items-center justify-center mb-4"
                              >
                                <TouchableOpacity
                                  onPress={() => handleKeyPress(key)}
                                  className="size-[62px] aspect-square rounded-full bg-white border border-gray-300 justify-center items-center shadow-sm"
                                >
                                  <Text className="text-2xl font-normal text-gray-800">
                                    {key}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            );
                          }

                          // Tombol baris terakhir (0 dan x)
                          if (index === 9) {
                            return (
                              <View
                                key="last-row"
                                className="flex-row w-full justify-around items-center mt-2"
                              >
                                {/* Spacer kiri biar seimbang */}
                                <View className="size-[62px] aspect-square opacity-0" />

                                {/* Tombol 0 */}
                                <TouchableOpacity
                                  onPress={() => handleKeyPress("0")}
                                  className="size-[62px] aspect-square rounded-full bg-white border border-gray-300 justify-center items-center shadow-sm"
                                >
                                  <Text className="text-2xl font-normal text-gray-800">
                                    0
                                  </Text>
                                </TouchableOpacity>

                                {/* Tombol x */}
                                <TouchableOpacity
                                  onPress={() => handleKeyPress("x")}
                                  className="size-[62px] aspect-square rounded-full bg-white border border-gray-300 justify-center items-center shadow-sm"
                                >
                                  <Text className="text-2xl font-normal text-gray-800">
                                    x
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            );
                          }

                          return null;
                        })}
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => setIsAlreadyCheckedRekening(true)}
                      className="bg-black rounded-lg py-4 mt-3"
                    >
                      <Text className="text-white text-center font-semibold text-base">
                        Cek Rekening
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Animated.View className="w-full h-[75%] items-start mb-4 justify-between ">
                    <View className="w-full h-36 bg-[#EAFBF8] rounded-2xl p-4">
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-start",
                          flex: 1,
                          justifyContent: "flex-start",
                        }}
                      >
                        <View className="flex-col gap-2 w-full">
                          <Text className="text-base font-medium">
                            Bayu Septyan Nur Hidayat
                          </Text>
                          <View className="flex-row mt-2 justify-start items-center gap-2">
                            <Image
                              source={{ uri: selectedBank.logo }}
                              style={{
                                width: 60,
                                height: 32,
                                resizeMode: "contain",
                              }}
                            />
                            <View className="flex-col justify-center items-start p-2">
                              <Text className="text-sm font-medium">
                                {selectedBank.name}
                              </Text>
                              <Text className="text-sm font-normal">
                                {formatAccountNumber(accountNumber)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    <PrimaryButton
                      onPress={() => handleToCreateRekbr()}
                      title="Simpan dan Gunakan Rekening"
                    />
                  </Animated.View>
                )}
              </Animated.View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const AnimatedAccountItem = ({
  item,
  fromFavorites,
  toggleFavorite,
  index = 0,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100), // Staggered animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.accountItem,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <Image source={item.bankLogo} style={styles.bankLogo} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.accountName}>{item.name}</Text>
          <Text style={styles.bankName}>{item.bank}</Text>
          <Text style={styles.accountNumber}>
            {formatAccountNumber(item.accountNumber)}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => toggleFavorite(item, fromFavorites)}>
        <Image
          source={
            item.isFavorite
              ? require("../../../assets/icon-star-filled.png")
              : require("../../../assets/icon-star-outline.png")
          }
          style={styles.favoriteIcon}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  accountItemContainer: {
    marginBottom: 16,
    width: "100%",
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    paddingRight: 12,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  appBarTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 24,
  },
  topBackground: {
    backgroundColor: "#EAFBF8",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    minHeight: screenHeight * 0.22,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 16,
    width: "100%",
  },
  topImage: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: -screenHeight * 0.035,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#999",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyImage: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  noFavoritesText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAFBF8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  bankLogo: {
    width: 60,
    height: 32,
    resizeMode: "contain",
  },
  accountName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  bankName: {
    fontSize: 12,
    color: "#444",
    marginTop: 4,
  },
  accountNumber: {
    fontSize: 12,
    color: "#444",
    marginTop: 2,
  },
  favoriteIcon: {
    width: 24,
    height: 24,
    marginLeft: 12,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    bottom: 50,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
