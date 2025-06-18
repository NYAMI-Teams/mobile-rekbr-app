import { View } from "react-native";
import NavigationBar from "../../components/NavigationBar";
import { useState, useEffect } from "react";
import BuyerEmptyContent from "../../screens/buyer/index";
import { StatusBar } from "expo-status-bar";
import BuyerCard from "../../components/card-transaction/BuyerCard";
import { ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { getBuyerTransactions } from "../../utils/api/buyer";
import { getAccessToken, removeAccessToken } from "../../store";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { showToast } from "../../utils";
import { getProfile } from "../../utils/api/auth";

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
      console.log(res.data);
      setTransactions(res.data);
    } catch (err) {
      showToast(
        "Error",
        "Failed to fetch transactions. Please try again later.",
        "error"
      );
    } finally {
      console.log("finally");
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
        "Session Invalid",
        "Your session has expired. Please log in again.",
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
      showToast(
        "Logout Failed",
        "Failed to logout. Please try again later.",
        "error"
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, padding: 16 }}>
        <NavigationBar
          name={profile?.email}
          // onNotificationPress={() => console.log("Notification pressed")}
          onNotificationPress={() =>
            Toast.show({
              type: "success",
              text1: "Notification pressed",
              position: "top",
            })
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
              <BuyerEmptyContent />
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
