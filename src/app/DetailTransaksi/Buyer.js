import { View, Text } from "react-native";
import { useRouter } from "expo-router";

import { mockAPIBuyer } from "../../services/apiMock/api";

import DetailTransaksiBuyer from "../../components/DetailRekber/DetailTransaksiBuyer";

export default function BuyerDetail() {
  return <DetailTransaksiBuyer data={mockAPIBuyer.data} />;
}
