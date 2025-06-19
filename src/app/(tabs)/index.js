import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import PrimaryButton from "../../components/PrimaryButton";
import SellerEmptyContent from "../../screens/seller/homeScreen";
import { useState, useEffect } from "react";
import NavigationBar from "../../components/NavigationBar";
import { StatusBar } from "expo-status-bar";
import SellerCard from "../../components/card-transaction/SellerCard";
import { getSellerTransactions } from "../../utils/api/seller";
import { getProfile } from "../../utils/api/auth";
import { getAccessToken, removeAccessToken } from "../../store";
import { showToast } from "../../utils";
import Toast from "react-native-toast-message";

export default function Seller() {
  const router = useRouter();
  const [isKYCCompleted, setIsKYCCompleted] = useState(false);
  const [isEmptyTransaction, setIsEmptyTransaction] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    checkAuth();
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
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
    }
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
      if (res.data?.kycStatus === "verified") {
        setIsKYCCompleted(true);
      }
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await removeAccessToken();
      router.replace("Onboarding");
      showToast("Logout Berhasil", "Anda telah berhasil logout.", "success");
    } catch (err) {
      showToast("Logout Gagal", "Gagal logout. Silahkan coba lagi.", "error");
    }
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar style="dark" />
        <View style={{ flex: 1, padding: 16 }}>
          <NavigationBar
            name={profile?.email}
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
              title={"+ Rekbr Baru"}
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
        {/* Modal */}
      </View>
    </>
  );
}
