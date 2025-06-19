import { useLocalSearchParams } from "expo-router";
import DetailTransaksiSeller from "../../components/DetailRekber/DetailTransaksiSeller";
import { getDetailSellerTransaction } from "../../utils/api/seller";
import { useEffect, useState } from "react";
import { showToast } from "../../utils";

export default function SellerDetail() {
  const [detailTransaction, setDetailTransaction] = useState({});
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const res = await getDetailSellerTransaction(id);
        setDetailTransaction(res.data);
      } catch (err) {
        showToast(
          "Gagal",
          "Gagal mengambil data transaksi. Silahkan coba lagi.",
          "error"
        );
      }
    };

    fetchTransactionDetails();
  }, [id]);

  return <DetailTransaksiSeller data={detailTransaction} />;
}
