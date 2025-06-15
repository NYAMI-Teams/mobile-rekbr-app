import { View, Text } from "react-native";
import { useRouter } from "expo-router";

import { mockAPIBuyer } from "../../src/services/apiMock/api";
import { ScrollView } from "react-native";
import DetailTransaksiBuyer from "../../src/components/DetailRekber/DetailTransaksiBuyer";

export default function BuyerDetail() {
  return (
    <ScrollView>
      <DetailTransaksiBuyer data={mockAPIBuyer.data} />
    </ScrollView>
  );
}
