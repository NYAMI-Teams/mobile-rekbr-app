import TransactionSummaryScreen from "../../../screens/summary";

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
export default function GenerateVA() {
  return <TransactionSummaryScreen bankData={bankData.data} />;
}
