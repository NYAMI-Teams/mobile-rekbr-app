import { View, Text } from "react-native";
import { useRouter } from "expo-router";

import { mockAPIBuyer } from "../../src/services/apiMock/api";

import DetailTransaksiBuyer from "../../src/components/DetailRekber/DetailTransaksiBuyer";

export default function BuyerDetail() {
  return <DetailTransaksiBuyer data={mockAPIBuyer.data} />;
}
