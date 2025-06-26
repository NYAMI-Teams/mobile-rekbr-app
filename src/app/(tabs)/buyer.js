import { View, FlatList, RefreshControl, StyleSheet } from "react-native";
import { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { getBuyerTransactions } from "../../utils/api/buyer";
import { showToast } from "../../utils";
import BuyerCard from "../../components/card-transaction/BuyerCard";
import EmptyIllustration from "@/components/Ilustration";
import TransactionSkeleton from "@/components/skeleton/TransactionSkeleton";

export default function Buyer() {
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 7;
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const listRef = useRef();

  const fetchData = async (reset = false) => {
    if (isFetching || (!hasMore && !reset)) return;
    setIsFetching(true);

    const currentOffset = reset ? 0 : offset;

    try {
      const res = await getBuyerTransactions(currentOffset, limit);
      const newData = res?.data || [];

      if (reset) {
        setTransactions(newData);
      } else {
        setTransactions((prev) => [...prev, ...newData]);
      }

      setOffset(currentOffset + limit);
      setHasMore(newData.length === limit);
    } catch (err) {
      showToast("Gagal", err?.message, "error");
    } finally {
      setIsFetching(false);
      setRefreshing(false);
      if (isInitialLoading) setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    setIsInitialLoading(true);
    fetchData(true);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    setTransactions([]);
    setIsInitialLoading(true);
    setOffset(0);
    fetchData(true);
  };

  const renderItem = ({ item }) => <BuyerCard data={item} />;

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
          text={`Belum ada Rekber yang masuk.\nTunggu seller kirimkan Rekber untuk kamu`}
        />
      </View>
    );
  };

  const ListFooter = () => {
    if (isFetching && offset > 0) {
      return (
        <View style={styles.footerContainer}>
          {[...Array(2)].map((_, i) => (
            <TransactionSkeleton key={i} />
          ))}
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar style='dark' />
      <FlatList
        ref={listRef}
        style={styles.flatList}
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={() => fetchData(false)}
        onEndReachedThreshold={0.3}
        initialNumToRender={limit}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<ListEmpty />}
        ListFooterComponent={<ListFooter />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  flatList: {
    width: "100%",
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 32,
  },
  footerContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
});
