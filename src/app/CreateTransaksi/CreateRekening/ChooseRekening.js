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
  FlatList,
  Animated,
  UIManager,
  LayoutAnimation,
  Pressable,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import BankSelector from "@/components/BankScreens";
import { ChevronLeftCircle } from "lucide-react-native";
import PrimaryButton from "@/components/PrimaryButton";
import {
  getListBankAccount,
  getAllBankList,
  checkRekeningExist,
} from "@/utils/api/seller";
import { saveAccountBank } from "@/utils/api/bank";
import { showToast } from "@/utils";
import NavBackHeader from "@/components/NavBackHeader";
import { Modalize } from "react-native-modalize";

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

export default function ChooseRekening() {
  const router = useRouter();
  const [favorites, setFavorites] = useState(initialFavorites);
  const [saved, setSaved] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSelectBankDone, setIsSelectBankDone] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isAlreadyCheckedRekening, setIsAlreadyCheckedRekening] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(250)).current;

  const modalizeRef = useRef(null);

  useEffect(() => {
    fetchBankAccount();
    fetchBankList();
  }, []);

  const fetchBankAccount = async () => {
    try {
      const res = await getListBankAccount();
      if (res) {
        setSaved(res.data);
        return res.data;
      }
    } catch (error) {
      if (error?.message == "Tidak ada akun yang ditemukan") {
        return;
      }
      showToast(
        "Gagal",
        error.message || "Gagal mengambil data rekening. Silahkan coba lagi.",
        "error"
      );
    }
  };

  const fetchBankList = async () => {
    try {
      const res = await getAllBankList();
      if (res) {
        setBankList(res.data);
      }
    } catch (error) {
      showToast(
        "Gagal",
        "Gagal mengambil data bank. Silahkan coba lagi.",
        "error"
      );
    }
  };

  const checkRekening = async () => {
    try {
      const res = await checkRekeningExist(accountNumber, selectedBank.bankId);
      if (res.success === true) {
        setAccountName(res.data.accountName);
        setIsAlreadyCheckedRekening(true);
      }
      if (res.success === false) {
        setIsAlreadyCheckedRekening(false);
      }
    } catch (error) {
      showToast(
        "Gagal",
        "Rekening tidak ditemukan, silahkan coba lagi",
        "error"
      );
    }
  };

  const openModal = () => {
    modalizeRef.current?.open();
  };

  const closeModal = () => {
    modalizeRef.current?.close();
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
      await saveAccountBank(selectedBank.bankId, accountNumber, accountName);
      showToast("Sukses", "Rekening berhasil disimpan", "success");
      const resData = await fetchBankAccount();
      const bankData = resData.find(
        (item) =>
          item.bankId == selectedBank.bankId &&
          item.accountNumber == accountNumber
      );
      router.push({
        pathname: "/CreateTransaksi/CreateRekbr",
        params: {
          selectedBank: JSON.stringify(bankData),
        },
      });
    } catch (error) {
      showToast(
        "Gagal",
        "Gagal menyimpan rekening. Silahkan coba lagi.",
        "error"
      );
    } finally {
      setIsLoading(false);
      closeModal();
    }
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
      <AnimatedAccountItem
        item={item}
        fromFavorites={fromFavorites}
        toggleFavorite={() => toggleFavorite(item, fromFavorites)}
        index={index}
        key={index}
      />
    );
  };

  const isEmpty = favorites.length === 0 && saved.length === 0;
  const isSavedEmpty = saved.length === 0;

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.flex1}
          behavior={Platform.OS === "ios" ? "height" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}>
          <NavBackHeader
            title={"Pilih Rekening Kamu"}
            onBackPress={() => router.back()}
          />

          <View style={styles.topBackground}>
            <Image
              source={require("@/assets/illustration-transfer.png")}
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
              source={require("@/assets/icon-search.png")}
              style={styles.searchIcon}
            />
          </View>

          <Text style={[styles.sectionTitle]}>Rekening Tersimpan</Text>

          {isEmpty ? (
            <View style={styles.emptyState}>
              <Image
                source={require("@/assets/illustration-empty.png")}
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
                  }}
                >
                  {/* <Text style={styles.sectionTitle}>Rekening Favorit kamu!</Text>
                {favorites.length === 0 ? (
                  <Text style={styles.noFavoritesText}>
                    Tambah rekening favorit kamu biar lebih gampang nyarinya
                    nanti, biar nggak ribet!
                  </Text>
                ) : (
                  favorites.map((item, index) =>
                    renderAccountItem(item, true, index)
                  )
                )} */}

                  {!isSavedEmpty && (
                    <>
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
                openModal();
              }}
            >
              <Text style={styles.addButtonText}>+ Rekening</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        scrollViewProps={{ nestedScrollEnabled: true }}
        handleStyle={{
          backgroundColor: "#ccc",
          width: 60,
          alignSelf: "center",
          top: 32,
        }}
        modalStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "#fff",
          paddingHorizontal: 24,
          paddingVertical: 32,
        }}
      >
        <View style={styles.modalContent}>
          <Pressable
            onPress={
              isAlreadyCheckedRekening
                ? handleBackToInputRekening
                : isSelectBankDone
                ? handleBackToBankSelection
                : closeModal
            }>
            <View style={styles.modalHeader}>
              <ChevronLeftCircle size={24} color="#00C2C2" />
              <Text style={styles.modalHeaderText}>
                {!isSelectBankDone
                  ? "Pilih Bank Kamu"
                  : !isAlreadyCheckedRekening
                  ? "Masukan No Rekening Kamu"
                  : "Rekening Kamu Ditemukan"}
              </Text>
            </View>
          </Pressable>

          {/* === State 1: Pilih Bank === */}
          {!isSelectBankDone ? (
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
          ) : !isAlreadyCheckedRekening ? (
            <>
              {/* === State 2: Masukkan No Rekening === */}
              {selectedBank && (
                <View style={styles.selectedBankRow}>
                  <View style={styles.selectedBankLogoBox}>
                    <Image
                      source={{ uri: selectedBank.logoUrl }}
                      style={styles.selectedBankLogo}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.selectedBankName}>
                    {selectedBank.bankName}
                  </Text>
                </View>
              )}

              <View style={styles.inputRekeningBox}>
                <Text style={styles.inputRekeningLabel}>Nomor Rekening</Text>
                <TextInput
                  value={accountNumber}
                  placeholder="Contoh : 00900604501"
                  editable={false}
                  style={styles.inputRekeningInput}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Keypad */}
              <View style={styles.keypadContainer}>
                <View style={styles.keypadRowWrap}>
                  {keys.map((key, index) => {
                    if (index < 9) {
                      return (
                        <View key={index} style={styles.keypadItemWrap}>
                          <TouchableOpacity
                            onPress={() => handleKeyPress(key)}
                            style={styles.keypadButton}
                          >
                            <Text style={styles.keypadButtonText}>{key}</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }
                    if (index === 9) {
                      return (
                        <View key="last-row" style={styles.keypadLastRow}>
                          <View style={[styles.keypadButton, { opacity: 0 }]} />
                          <TouchableOpacity
                            onPress={() => handleKeyPress("0")}
                            style={styles.keypadButton}
                          >
                            <Text style={styles.keypadButtonText}>0</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleKeyPress("x")}
                            style={styles.keypadButton}
                          >
                            <Text style={styles.keypadButtonText}>x</Text>
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
                style={styles.cekRekeningButton}
              >
                <Text style={styles.cekRekeningButtonText}>Cek Rekening</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* === State 3: Rekening ditemukan === */}
              <View style={styles.rekeningDitemukanBox}>
                <Text style={styles.rekeningDitemukanName}>{accountName}</Text>
                <View style={styles.rekeningDitemukanRow}>
                  <Image
                    source={{ uri: selectedBank.logoUrl }}
                    style={styles.rekeningDitemukanLogo}
                  />
                  <View style={styles.rekeningDitemukanCol}>
                    <Text style={styles.rekeningDitemukanBankName}>
                      {selectedBank.bankName}
                    </Text>
                    <Text style={styles.rekeningDitemukanAccountNumber}>
                      {formatAccountNumber(accountNumber)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.saveButtonBox}>
                <PrimaryButton
                  onPress={handleToCreateRekbr}
                  title="Simpan dan Gunakan Rekening"
                  disabled={isLoading}
                />
              </View>
            </>
          )}
        </View>
      </Modalize>
    </>
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
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/CreateTransaksi/CreateRekbr",
          params: {
            selectedBank: JSON.stringify(item),
          },
        });
      }}
    >
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
        {/* <TouchableOpacity onPress={() => toggleFavorite(item, fromFavorites)}>
          <Image
            source={
              item.isFavorite
                ? require("@/assets/icon-star-filled.png")
                : require("@/assets/icon-star-outline.png")
            }
            style={styles.favoriteIcon}
          />
        </TouchableOpacity> */}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
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
    marginBottom: 8,
    paddingHorizontal: 16,
    marginTop: 8,
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
    bottom: 0,
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
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "400",
    color: "#1F2937",
    marginLeft: 8,
  },
  selectedBankRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
    gap: 16,
  },
  selectedBankLogoBox: {
    width: 80,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#EDFBFA",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  selectedBankLogo: {
    width: 48,
    height: 32,
    resizeMode: "contain",
  },
  selectedBankName: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 16,
  },
  inputRekeningBox: {
    marginTop: 8,
  },
  inputRekeningLabel: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 4,
  },
  inputRekeningInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#F3F4F6",
    color: "#000",
  },
  keypadContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  keypadRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 24,
    width: "80%",
  },
  keypadItemWrap: {
    width: "33%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  keypadButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  keypadButtonText: {
    fontSize: 28,
    fontWeight: "400",
    color: "#1F2937",
  },
  keypadLastRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 8,
  },
  cekRekeningButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 12,
    marginBottom: 24,
  },
  cekRekeningButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  rekeningDitemukanBox: {
    width: "100%",
    backgroundColor: "#EAFBF8",
    borderRadius: 20,
    padding: 16,
    gap: 8,
    marginBottom: 48,
  },
  rekeningDitemukanName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  rekeningDitemukanRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
    alignItems: "center",
  },
  rekeningDitemukanLogo: {
    width: 60,
    height: 32,
    resizeMode: "contain",
  },
  rekeningDitemukanCol: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 8,
  },
  rekeningDitemukanBankName: {
    fontSize: 14,
    fontWeight: "600",
  },
  rekeningDitemukanAccountNumber: {
    fontSize: 14,
    fontWeight: "400",
  },
  saveButtonBox: {
    marginBottom: 24,
  },
});
