import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useRef } from "react";
import { getHistoryBuyer } from "@/utils/api/buyer";
import { getHistorySeller } from "@/utils/api/seller";
import { showToast } from "@/utils";
import BuyerCard from "@/components/card-transaction/BuyerCard";
import SellerCard from "@/components/card-transaction/SellerCard";
import EmptyIllustration from "@/components/Ilustration";
import TransactionSkeleton from "@/components/skeleton/TransactionSkeleton";

export default function History() {
  const [selectedTab, setSelectedTab] = useState("pembelian");
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 7;
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const flatListRef = useRef();

  const fetchData = async (reset = false) => {
    if (isFetching || (!hasMore && !reset)) return;

    setIsFetching(true);
    const currentOffset = reset ? 0 : offset;

    try {
      const fetchFn =
        selectedTab === "pembelian" ? getHistoryBuyer : getHistorySeller;
      const res = await fetchFn(currentOffset, limit);
      const newData = res?.data || [];

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (reset) {
        setData(newData);
      } else {
        setData((prev) => [...prev, ...newData]);
      }

      setOffset(currentOffset + limit);
      setHasMore(newData.length === limit);
    } catch (err) {
      showToast("Gagal", "Gagal memuat data", "error");
    } finally {
      setIsFetching(false);
      setRefreshing(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setData([]);
    setIsInitialLoading(true);
    fetchData(true);
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [selectedTab]);

  const onRefresh = () => {
    setRefreshing(true);
    setOffset(0);
    setData([]);
    setIsInitialLoading(true);
    setHasMore(true);
    fetchData(true);
  };

  const renderItem = ({ item }) => {
    return selectedTab === "pembelian" ? (
      <BuyerCard data={item} />
    ) : (
      <SellerCard data={item} />
    );
  };

  const ListEmpty = () => {
    if (isInitialLoading) {
      return (
        <View>
          {Array.from({ length: 4 }).map((_, idx) => (
            <TransactionSkeleton key={idx} />
          ))}
        </View>
      );
    }

    return (
      <View className='mt-8 items-center justify-center'>
        <EmptyIllustration
          text={
            selectedTab === "pembelian"
              ? "Belum ada riwayat pembelian, semua masih kosong\nTunggu sampai kamu mulai rekber pertama!"
              : "Belum ada riwayat penjualan, semua masih kosong\nTunggu sampai kamu mulai rekber pertama!"
          }
        />
      </View>
    );
  };

  return (
    <View className='flex-1 bg-white'>
      <StatusBar style='dark' />
      <View className='flex-row w-full px-4 h-10'>
        <TouchableOpacity
          onPress={() => setSelectedTab("pembelian")}
          className={`flex-1 items-center justify-center h-full ${
            selectedTab === "pembelian"
              ? "border-b-2 border-[#49DBC8]"
              : "border-b-2 border-gray-300"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              selectedTab === "pembelian" ? "text-black" : "text-gray-400"
            }`}
          >
            Pembelian
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab("penjualan")}
          className={`flex-1 items-center justify-center h-full ${
            selectedTab === "penjualan"
              ? "border-b-2 border-[#49DBC8]"
              : "border-b-2 border-gray-300"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              selectedTab === "penjualan" ? "text-black" : "text-gray-400"
            }`}
          >
            Penjualan
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        className='w-full px-4'
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={() => fetchData(false)}
        onEndReachedThreshold={0.3}
        initialNumToRender={limit}
        ListEmptyComponent={<ListEmpty />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          isFetching && offset > 0 ? (
            <View>
              {Array.from({ length: 2 }).map((_, i) => (
                <TransactionSkeleton key={i} />
              ))}
            </View>
          ) : null
        }
      />
    </View>
  );
}
