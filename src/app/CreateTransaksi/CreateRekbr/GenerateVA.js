import { useLocalSearchParams } from "expo-router";
import TransactionSummaryScreen from "../../../screens/summary";

export default function GenerateVA() {
  const { payload, bankData } = useLocalSearchParams();

  return <TransactionSummaryScreen payload={JSON.parse(payload)} bankData={JSON.parse(bankData)} />;
}
