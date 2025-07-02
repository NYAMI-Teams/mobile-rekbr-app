import {
  View,
  FlatList,
  RefreshControl,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import SellerCard from "../../components/card-transaction/SellerCard";
import EmptyIllustration from "../../components/Ilustration";
import TransactionSkeleton from "../../components/skeleton/TransactionSkeleton";
import { showToast } from "../../utils";
import { getSellerTransactions } from "../../utils/api/seller";
import {
  getDataNotification,
  getProfileStore,
  setDataNotification,
  setProfileStore,
} from "@/store";
import { getProfile } from "@/utils/api/auth";

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
    getDataNotification().then((data) => {
      setDataNotification(null);
      switch (data?.screen) {
        case "transaction/buyer":
          router.push({
            pathname: "/DetailTransaksi/Buyer",
            params: { id: data?.transactionId },
          });
          break;
        case "transaction/seller":
          router.push({
            pathname: "/DetailTransaksi/Seller",
            params: { id: data?.transactionId },
          });
          break;
        case "complaint/buyer":
          router.push({
            pathname: "/(tabs)/complaint",
            params: { type: "buyer" },
          });
          break;
        case "complaint/seller":
          router.push({
            pathname: "/(tabs)/complaint",
            params: { type: "seller" },
          });
          break;
        default:
          break;
      }
    });
    getUserProfile();
    fetchTransactions(true);
  }, []);

  const getUserProfile = async () => {
    try {
      setIsInitialLoading(true);
      const res = await getProfile();
      if (res?.data?.kycStatus === "verified") {
        setIsKYCCompleted(true);
      }
      await setProfileStore(res?.data);
    } catch (error) {
      showToast(
        "Gagal",
        "Gagal mengambil data profile. Silahkan coba kembali.",
        "error"
      );
    } finally {
      setIsInitialLoading(false);
    }
  };

  const fetchTransactions = async (reset = false) => {
    if (isFetching || (!hasMore && !reset)) return;
    setIsFetching(true);

    const currentOffset = reset ? 0 : offset;

    try {
      const res = await getSellerTransactions(currentOffset, limit);
      const newData = res.data || [];

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
    getUserProfile();
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
      <View style={styles.footerContainer}>
        {[...Array(2)].map((_, i) => (
          <TransactionSkeleton key={i} />
        ))}
      </View>
    ) : null;

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
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
          btnColor="black"
          textColor="#fff"
          width="50%"
          height={50}
          style={styles.floatingButton}
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
        <View style={styles.warningBox}>
          <View style={styles.warningContent}>
            <Image
              source={require("../../assets/icon-warning.png")}
              style={styles.warningIcon}
              resizeMode="contain"
            />
            <Text style={styles.warningText}>
              Biar bisa lanjut bikin Rekber, kamu perlu selesain KYC dulu, ya!
            </Text>
          </View>
        </View>
      )}

      <View style={styles.emptyIllustration}>
        <EmptyIllustration
          text={`Kosong banget di sini...\nBikin Rekber pertama kamu, kuy!`}
        />
      </View>

      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => {
          if (!isKYCCompleted) {
            router.push("E-kyc/KYC_Intro");
          } else {
            router.push("CreateTransaksi/CreateRekening/ChooseRekening");
          }
        }}>
        <Text style={styles.ctaButtonText}>
          {isKYCCompleted ? "Bikin Rekber Baru" : "Lengkapi KYC & Bikin Rekber"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  footerContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  warningBox: {
    backgroundColor: "#FFF4D9",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  warningContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  warningIcon: {
    width: 20,
    height: 20,
    marginTop: 2,
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
  },
  emptyIllustration: {
    alignItems: "center",
    marginBottom: 32,
  },
  ctaButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  floatingButton: {
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
  },
});
