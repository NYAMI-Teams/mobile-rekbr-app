import { useLocalSearchParams } from "expo-router";
import DetailTransaksiBuyer from "../../components/DetailRekber/DetailTransaksiBuyer";
import { getDetailBuyerTransaction } from "../../utils/api/buyer";
import { useEffect, useState } from "react";
import { showToast } from "../../utils";

export default function BuyerDetail() {
  const [detailTransaction, setDetailTransaction] = useState({});
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const res = await getDetailBuyerTransaction(id);
        setDetailTransaction(res.data);
      } catch (err) {
        showToast(
          "Gagal",
          "Gagal mengambil data transaksi. Silahkan coba lagi.",
          "error"
        );
      } finally {
      }
    };

    fetchTransactionDetails();
  }, [id]);

  return <DetailTransaksiBuyer data={detailTransaction} />;
}
