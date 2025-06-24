import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import PrimaryButton from "../../components/PrimaryButton";
import { useState, useEffect } from "react";
import SellerCard from "../../components/card-transaction/SellerCard";
import { getSellerTransactions } from "../../utils/api/seller";
import { showToast } from "../../utils";
import EmptyIllustration from "../../components/Ilustration";
import { getProfileStore } from "@/store";

export default function Seller() {
  const router = useRouter();
  const [isKYCCompleted, setIsKYCCompleted] = useState(false);
  const [isEmptyTransaction, setIsEmptyTransaction] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getProfileStore()
      .then((profileData) => {
        if (profileData?.kycStatus === "verified") {
          setIsKYCCompleted(true);
        }       
      })
      .catch((error) => {
        showToast(
          "Gagal",
          "Gagal mengambil data profil. Silahkan coba lagi.",
          "error"
        );
      });
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await getSellerTransactions();
      if (res.data.length > 0) {
        setIsEmptyTransaction(false);
      } else {
        setIsEmptyTransaction(true);
      }
      setTransactions(res.data);
    } catch (err) {
      showToast(
        "Gagal",
        "Gagal mengambil data transaksi. Silahkan coba lagi.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  return (
    <>
      <View className="flex-1 bg-white">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <ScrollView
            className="flex flex-col px-4 bg-white"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {isEmptyTransaction ? (
              <SellerEmptyContent isKYCCompleted={isKYCCompleted} />
            ) : (
              transactions.map((transaction) => (
                <SellerCard key={transaction.id} data={transaction} />
              ))
            )}
          </ScrollView>
        )}
        {isKYCCompleted && !isEmptyTransaction && (
          <PrimaryButton
            title={"+ Rekber Baru"}
            onPress={() =>
              router.push("/CreateTransaksi/CreateRekening/ChooseRekening")
            }
            btnColor="black"
            textColor="#fff"
            width="50%"
            height={50}
            style={{
              position: "absolute",
              bottom: 30,
              right: 16,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 8,
              zIndex: 10,
            }}
          />
        )}
      </View>
    </>
  );
}

function SellerEmptyContent({ isKYCCompleted }) {
  const router = useRouter();

  return (
    <View className="">
      {/* Warning Banner (jika belum KYC) */}
      {!isKYCCompleted && (
        <View className="bg-[#FFF4D9] rounded-xl py-3 px-4">
          <View className="flex-row items-start">
            <Image
              source={require("../../assets/icon-warning.png")}
              className="w-5 h-5 mt-[2px] mr-2"
              resizeMode="contain"
            />
            <Text className="flex-1 text-sm text-black font-normal leading-5">
              Biar bisa lanjut bikin Rekber, kamu perlu selesain KYC dulu, ya!
            </Text>
          </View>
        </View>
      )}

      {/* Empty Illustration + Text */}
      <View className="items-center mb-8">
        <EmptyIllustration
          text={`Kosong banget di sini...\nBikin Rekber pertama kamu, kuy!`}
        />
      </View>

      {/* CTA Button */}
      <View className="">
        <TouchableOpacity
          className="w-full py-4 rounded-xl bg-black items-center justify-center"
          onPress={() => {
            if (!isKYCCompleted) {
              router.push("E-kyc/KYC_Intro");
            } else {
              router.push("CreateTransaksi/CreateRekening/ChooseRekening");
            }
          }}>
          <Text className="text-white text-base font-semibold">
            {isKYCCompleted
              ? "Bikin Rekber Baru"
              : "Lengkapi KYC & Bikin Rekber"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
