import { View, ScrollView, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import PrimaryButton from "../../components/PrimaryButton";
import SellerEmptyContent from "../../screens/seller/homeScreen";
import { useState, useEffect } from "react";
import NavigationBar from "../../components/NavigationBar";
import { StatusBar } from "expo-status-bar";
import SellerCard from "../../components/card-transaction/SellerCard";
import { getSellerTransactions } from "../../utils/api/seller";
import { getProfile } from "../../utils/api/auth";
import { removeAccessToken } from "../../store";


export default function Seller() {
  const router = useRouter();
  const [isKYCCompleted, setIsKYCCompleted] = useState(true);
  const [isEmptyTransaction, setIsEmptyTransaction] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const check = () => {
    setIsLoading(true);
    getProfile()
      .then((res) => {
        console.log("Profile data:", res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLogout = () => {
    removeAccessToken()
      .then(() => {
        router.replace("/auth/login");
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  };

  const fetchTransactions = async () => {
    try {
      const res = await getSellerTransactions();
      if (res.data.length > 0) {
        setIsEmptyTransaction(false);
      } else {
        setIsEmptyTransaction(true);
      }
      setTransactions(res.data);
      console.log("Berhasil get all transaction seller");
      // console.log(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      console.log("finally");
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, padding: 16 }}>
        <NavigationBar
          name="irgi168@gmail.com"
          // onNotificationPress={() => console.log("Notification pressed")}
          onNotificationPress={() => handleLogout()}
          // onProfilePress={() => console.log("Profile pressed")}
          // onProfilePress={() => router.replace("/auth/login")}
          onProfilePress={() => check()}
        />
        <ScrollView
          className="flex flex-col gap-12"
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
    </View>
  );
}
