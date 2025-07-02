import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  StyleSheet,
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
      <View style={styles.emptyContainer}>
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
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setSelectedTab("pembelian")}
          style={[
            styles.tabButton,
            selectedTab === "pembelian" ? styles.tabActive : styles.tabInactive,
          ]}>
          <Text
            style={[
              styles.tabText,
              selectedTab === "pembelian"
                ? styles.tabTextActive
                : styles.tabTextInactive,
            ]}>
            Pembelian
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab("penjualan")}
          style={[
            styles.tabButton,
            selectedTab === "penjualan" ? styles.tabActive : styles.tabInactive,
          ]}>
          <Text
            style={[
              styles.tabText,
              selectedTab === "penjualan"
                ? styles.tabTextActive
                : styles.tabTextInactive,
            ]}>
            Penjualan
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        style={styles.flatList}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 16,
    height: 40,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    borderBottomWidth: 2,
  },
  tabActive: {
    borderBottomColor: "#49DBC8",
  },
  tabInactive: {
    borderBottomColor: "#D1D5DB", // gray-300
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#000000",
  },
  tabTextInactive: {
    color: "#9CA3AF", // gray-400
  },
  flatList: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  emptyContainer: {
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
