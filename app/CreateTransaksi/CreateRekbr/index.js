import { View, Text } from "react-native";
import CreateRekber from "../../../src/screens/CreateRekbr";

const bankData = {
  success: true,
  message: "Daftar rekening berhasil diambil",
  data: {
    accountNumber: "1343531",
    accountHolderName: "diffa suka kamu",
    detailBank: {
      logoUrl: "https://...",
      bankName: "Bank Negara Indonesia",
    },
  },
};

export default function CreateRekbrScreen() {
  return <CreateRekber bankData={bankData.data} />;
}
