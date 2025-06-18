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
import BankSelector from "../../components/BankScreens";
import { ChevronLeftCircle } from "lucide-react-native";
import PrimaryButton from "../../components/PrimaryButton";
import {
  getListBankAccount,
  getAllBankList,
  checkRekeningExist,
} from "../../utils/api/seller";
import { saveAccountBank } from "../../utils/api/bank";
import { showToast } from "../../utils";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const initialFavorites = [];

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "x"]; // The null will be handled in the map function

const formatAccountNumber = (number) => {
  if (!number) return "";
  return number.slice(0, 4) + "XXXXX";
};

export default function PilihRekeningScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState(initialFavorites);
  const [saved, setSaved] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSelectBankDone, setIsSelectBankDone] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isAlreadyCheckedRekening, setIsAlreadyCheckedRekening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(250)).current;

  useEffect(() => {
    fetchBankAccount();
    fetchBankList();
  }, []);

  const fetchBankAccount = async () => {
    try {
      const res = await getListBankAccount();
      if (res) {
        // console.log("ini rekening user", res);
        setSaved(res.data);
        return res.data;
      }
    } catch (error) {
      console.error("Error get list bank account:", error);
    }
  };

  const fetchBankList = async () => {
    try {
      const res = await getAllBankList();
      if (res) {
        // console.log("ini all bank", res);
        setBankList(res.data);
      }
    } catch (error) {
      console.error("Error get list bank account:", error);
    }
  };

  const checkRekening = async () => {
    try {
      const res = await checkRekeningExist(accountNumber, selectedBank.id);
      if (res.success === true) {
        // console.log("rekening user ditemukan", res);
        setAccountName(res.data.accountName);
        setIsAlreadyCheckedRekening(true);
      }
      if (res.success === false) {
        // console.log("rekening user tidak ditemukan", res);
        setIsAlreadyCheckedRekening(false);
      }
    } catch (error) {
      console.error("Error get list bank account:", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
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

  const handleToCreateRekbr = async () => {
    setIsLoading(true);
    try {
      await saveAccountBank(
        selectedBank.bankId,
        accountNumber,
        accountName
      )
      showToast(
        "Sukses",
        "Rekening berhasil disimpan",
        "success"
      );
      const resData = await fetchBankAccount();
      const bankData = resData.find(
        (item) =>
          item.bankId == selectedBank.bankId &&
          item.accountNumber == accountNumber
      )
      console.log(bankData, "ini data rekening yang disimpan");
      router.push({
        pathname: "/CreateTransaksi/CreateRekbr",
        params: {
          selectedBank: JSON.stringify(bankData),
        }
      });
    } catch (error) {
      showToast(
        "Gagal",
        "Gagal menyimpan rekening. Silakan coba lagi.",
        "error"
      );
    } finally {
      setIsLoading(false);
      closeModal();
    }
    // setModalVisible(false);
    // router.push("/CreateTransaksi/CreateRekbr");
    // handleBackToInputRekening();
    // handleBackToBankSelection();
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
        key={index}
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
            onPress={() => router.back()}>
            <Image
              source={require("../../assets/icon-back.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Pilih Rekening Kamu</Text>
        </View>

        <View style={styles.topBackground}>
          <Image
            source={require("../../assets/illustration-transfer.png")}
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
            source={require("../../assets/icon-search.png")}
            style={styles.searchIcon}
          />
        </View>

        {isEmpty ? (
          <View style={styles.emptyState}>
            <Image
              source={require("../../assets/illustration-empty.png")}
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
                }}>
                <Text style={styles.sectionTitle}>Rekening Favorit kamu!</Text>
                {favorites.length === 0 ? (
                  <Text style={styles.noFavoritesText}>
                    Tambah rekening favorit kamu biar lebih gampang nyarinya
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
                      Rekening Tersimpan
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
            onPress={() => {
              setModalVisible(true);
              // console.log("bank list", bankList);
            }}>
            <Text style={styles.addButtonText}>+ Rekening</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 w-full h-full">
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              closeModal();
            }}>
            <View className="bg-black/50 w-full h-full">
              <Animated.View
                style={{ transform: [{ translateY: slideAnim }] }}
                className="bg-white px-5 pt-5 pb-8 rounded-t-3xl">
                <Pressable
                  onPress={
                    isAlreadyCheckedRekening
                      ? handleBackToInputRekening
                      : isSelectBankDone
                        ? handleBackToBankSelection
                        : closeModal
                  }>
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
                  // <View className="bg-red-300">
                  <BankSelector
                    banks={bankList}
                    onSelectBank={(bank) => {
                      setSelectedBank({
                        logoUrl: bank.logoUrl,
                        bankName: bank.bankName,
                        bankId: bank.id,
                      });
                      setIsSelectBankDone(true);
                    }}
                  />
                ) : // </View>
                  !isAlreadyCheckedRekening ? (
                    <>
                      {selectedBank && (
                        <View className="flex-row items-center mt-2 mb-2 gap-4">
                          <View className="w-20 h-10 rounded bg-[#EDFBFA] justify-center items-center py-2">
                            <Image
                              source={{ uri: selectedBank.logoUrl }}
                              className="w-12 h-12 object-contain"
                              resizeMode="contain"
                            />
                          </View>
                          <Text className="text-base font-normal">
                            {selectedBank.bankName}
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
                                  className="w-1/3 items-center justify-center mb-4">
                                  <TouchableOpacity
                                    onPress={() => handleKeyPress(key)}
                                    className="size-[62px] aspect-square rounded-full bg-white border border-gray-300 justify-center items-center shadow-sm">
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
                                  className="flex-row w-full justify-around items-center mt-2">
                                  {/* Spacer kiri biar seimbang */}
                                  <View className="size-[62px] aspect-square opacity-0" />

                                  {/* Tombol 0 */}
                                  <TouchableOpacity
                                    onPress={() => handleKeyPress("0")}
                                    className="size-[62px] aspect-square rounded-full bg-white border border-gray-300 justify-center items-center shadow-sm">
                                    <Text className="text-2xl font-normal text-gray-800">
                                      0
                                    </Text>
                                  </TouchableOpacity>

                                  {/* Tombol x */}
                                  <TouchableOpacity
                                    onPress={() => handleKeyPress("x")}
                                    className="size-[62px] aspect-square rounded-full bg-white border border-gray-300 justify-center items-center shadow-sm">
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
                        onPress={checkRekening}
                        className="bg-black rounded-lg py-4 mt-3">
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
                          }}>
                          <View className="flex-col gap-2 w-full">
                            <Text className="text-base font-medium">
                              {accountName}
                            </Text>
                            <View className="flex-row mt-2 justify-start items-center gap-2">
                              <Image
                                source={{ uri: selectedBank.logoUrl }}
                                style={{
                                  width: 60,
                                  height: 32,
                                  resizeMode: "contain",
                                }}
                              />
                              <View className="flex-col justify-center items-start p-2">
                                <Text className="text-sm font-medium">
                                  {selectedBank.bankName}
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
                        disabled={isLoading}
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
  const router = useRouter();
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
    <TouchableOpacity onPress={() => {
      // console.log(item, "ini item rekening");
      router.push({
        pathname: "/CreateTransaksi/CreateRekbr",
        params: {
          selectedBank: JSON.stringify(item)
        }
      })
    }}>
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
          <Image source={{ uri: item.bank.logoUrl }} style={styles.bankLogo} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.accountName}>{item.accountHolderName}</Text>
            <Text style={styles.bankName}>{item.bank.bankName}</Text>
            <Text style={styles.accountNumber}>
              {formatAccountNumber(item.accountNumber)}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(item, fromFavorites)}>
          <Image
            source={
              item.isFavorite
                ? require("../../assets/icon-star-filled.png")
                : require("../../assets/icon-star-outline.png")
            }
            style={styles.favoriteIcon}
          />
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
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
    // alignItems: "center",
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
