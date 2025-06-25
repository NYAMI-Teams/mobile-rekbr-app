import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import SellerCard from "../../components/card-transaction/SellerCard";
import EmptyIllustration from "../../components/Ilustration";
import TransactionSkeleton from "../../components/skeleton/TransactionSkeleton";
import { showToast } from "../../utils";
import { getSellerTransactions } from "../../utils/api/seller";
import { getProfileStore } from "@/store";

export default function Seller() {
  const router = useRouter();
  const [isKYCCompleted, setIsKYCCompleted] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 7;
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    getProfileStore()
      .then((profileData) => {
        if (profileData?.kycStatus === "verified") {
          setIsKYCCompleted(true);
        }
      })
      .catch(() => {
        showToast("Gagal", "Gagal mengambil data profil", "error");
      });

    fetchTransactions(true);
  }, []);

  const fetchTransactions = async (reset = false) => {
    if (isFetching || (!hasMore && !reset)) return;
    setIsFetching(true);

    const currentOffset = reset ? 0 : offset;

    try {
      const res = await getSellerTransactions(currentOffset, limit);
      const newData = res.data || [];

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (reset) {
        setTransactions(newData);
      } else {
        setTransactions((prev) => [...prev, ...newData]);
      }

      setOffset(currentOffset + limit);
      setHasMore(newData.length === limit);
    } catch (err) {
      showToast("Gagal", "Gagal mengambil data transaksi", "error");
    } finally {
      setIsFetching(false);
      setRefreshing(false);
      setIsInitialLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setOffset(0);
    setTransactions([]);
    setIsInitialLoading(true);
    setHasMore(true);
    fetchTransactions(true);
  };

  const renderItem = ({ item }) => <SellerCard data={item} />;

  const renderEmpty = () => {
    if (isInitialLoading) {
      return (
        <View>
          {Array.from({ length: 4 }).map((_, i) => (
            <TransactionSkeleton key={i} />
          ))}
        </View>
      );
    }

    if (!isFetching && transactions.length === 0) {
      return <SellerEmptyContent isKYCCompleted={isKYCCompleted} />;
    }

    return null;
  };

  const renderFooter = () =>
    isFetching && offset > 0 ? (
      <View className='my-4 px-4'>
        {[...Array(2)].map((_, i) => (
          <TransactionSkeleton key={i} />
        ))}
      </View>
    ) : null;

  return (
    <View className='flex-1 bg-white'>
      <FlatList
        className='flex px-4 bg-white'
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={() => fetchTransactions(false)}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
      />

      {isKYCCompleted && transactions.length > 0 && (
        <PrimaryButton
          title={"+ Rekber Baru"}
          onPress={() =>
            router.push("/CreateTransaksi/CreateRekening/ChooseRekening")
          }
          btnColor='black'
          textColor='#fff'
          width='50%'
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
  );
}

function SellerEmptyContent({ isKYCCompleted }) {
  const router = useRouter();

  return (
    <View>
      {!isKYCCompleted && (
        <View className='bg-[#FFF4D9] rounded-xl py-3 px-4 mb-4'>
          <View className='flex-row items-start'>
            <Image
              source={require("../../assets/icon-warning.png")}
              className='w-5 h-5 mt-[2px] mr-2'
              resizeMode='contain'
            />
            <Text className='flex-1 text-sm text-black font-normal leading-5'>
              Biar bisa lanjut bikin Rekber, kamu perlu selesain KYC dulu, ya!
            </Text>
          </View>
        </View>
      )}

      <View className='items-center mb-8'>
        <EmptyIllustration
          text={`Kosong banget di sini...\nBikin Rekber pertama kamu, kuy!`}
        />
      </View>

      <TouchableOpacity
        className='w-full py-4 rounded-xl bg-black items-center justify-center'
        onPress={() => {
          if (!isKYCCompleted) {
            router.push("E-kyc/KYC_Intro");
          } else {
            router.push("CreateTransaksi/CreateRekening/ChooseRekening");
          }
        }}
      >
        <Text className='text-white text-base font-semibold'>
          {isKYCCompleted ? "Bikin Rekber Baru" : "Lengkapi KYC & Bikin Rekber"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
