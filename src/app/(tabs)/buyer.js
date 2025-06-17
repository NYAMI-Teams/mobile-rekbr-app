import { View } from "react-native";
import NavigationBar from "../../components/NavigationBar";
import { useState, useEffect } from "react";
import BuyerEmptyContent from "../../screens/buyer/index";
import { StatusBar } from "expo-status-bar";
import BuyerCard from "../../components/card-transaction/BuyerCard";
import { ScrollView, RefreshControl } from "react-native";
import { getBuyerTransactions } from "../../utils/api/buyer";
import InputResi from "../../components/InputResi";

export default function Home() {
  const [isEmptyTransaction, setIsEmptyTransaction] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
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
      console.error("Error fetching buyer transactions:", err);
    } finally {
      console.log("finally");
    }
  };

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
          onNotificationPress={() => console.log("Notification pressed")}
          onProfilePress={() => console.log("Notification pressed")}
        />
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
      </View>
    </View>
  );
}
