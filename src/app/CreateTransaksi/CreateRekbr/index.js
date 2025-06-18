import { View, Text } from "react-native";
import CreateRekber from "../../../screens/CreateRekbr";
import { useLocalSearchParams } from "expo-router";

export default function CreateRekbrScreen() {
  const { selectedBank } = useLocalSearchParams();
  return (
    <CreateRekber bankData={JSON.parse(selectedBank)} />
  );
}
