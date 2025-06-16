import { View } from "react-native";
import NavigationBar from "../../components/NavigationBar";
import { useState, useEffect } from "react";
import BuyerEmptyContent from "../../screens/buyer/index";
import { StatusBar } from "expo-status-bar";
import BuyerCard from "../../components/card-transaction/BuyerCard";
import { ScrollView } from "react-native";
import { getBuyerTransactions } from "../../utils/api/buyer";

export default function Home() {
  const [isEmptyTransaction, setIsEmptyTransaction] = useState(false);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
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

    fetchTransactions();
  }, []);

  // console.log("transactions", transactions[0]);

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
          className="flex flex-col gap-12"
          showsVerticalScrollIndicator={false}>
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
