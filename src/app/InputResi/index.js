import InputResi from "../../components/InputResi";
import { useLocalSearchParams } from "expo-router";

export default function InputResiScreen() {
  const { id } = useLocalSearchParams();
  return <InputResi id={id} />;
}
