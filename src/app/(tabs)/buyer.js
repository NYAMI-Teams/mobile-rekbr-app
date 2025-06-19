import { View } from "react-native";
import NavigationBar from "../../components/NavigationBar";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import BuyerCard from "../../components/card-transaction/BuyerCard";
import { ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { getBuyerTransactions } from "../../utils/api/buyer";
import { getAccessToken, removeAccessToken } from "../../store";
import { useRouter } from "expo-router";
import { showToast } from "../../utils";
import { getProfile } from "../../utils/api/auth";
import EmptyIllustration from "@/components/Ilustration";

export default function Home() {
  const router = useRouter();
  const [isEmptyTransaction, setIsEmptyTransaction] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await getBuyerTransactions();
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
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        handleLogout();
        return;
      }
      const res = await getProfile();
      setProfile(res.data);
    } catch {
      showToast(
        "Sesi Berakhir",
        "Sesi Anda telah berakhir. Silahkan login kembali.",
        "error"
      );
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await removeAccessToken();
      router.replace("Onboarding");
    } catch (err) {
      showToast("Logout Gagal", "Gagal logout. Silahkan coba lagi.", "error");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, padding: 16 }}>
        <NavigationBar
          name={profile?.email}
          onNotificationPress={() =>
            showToast("Notification", "Notification pressed", "success")
          }
          onLogoutPress={() => handleLogout()}
        />
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <ScrollView
            className="flex flex-col gap-6"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {isEmptyTransaction ? (
              <View className="items-center mt-8">
                <EmptyIllustration text={`Belum ada Rekber yang masuk.\nTunggu seller kirimkan Rekber untuk kamu`} />
              </View>
            ) : (
              transactions.map((transaction) => (
                <BuyerCard key={transaction.id} data={transaction} />
              ))
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
