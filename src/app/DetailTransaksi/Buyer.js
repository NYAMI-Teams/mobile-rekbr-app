import { useLocalSearchParams } from "expo-router";
import DetailTransaksiBuyer from "../../components/DetailRekber/DetailTransaksiBuyer";
import { getDetailBuyerTransaction } from "../../utils/api/buyer";
import { useEffect, useState } from "react";

export default function BuyerDetail() {
  const [detailTransaction, setDetailTransaction] = useState({});
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const res = await getDetailBuyerTransaction(id);
        // console.log(res);
        setDetailTransaction(res.data);
        // console.log("Berhasil get detail transaction buyer");
      } catch (err) {
        console.error("Error fetching buyer transaction details:", err);
      } finally {
        console.log("finally");
      }
    };

    fetchTransactionDetails();
  }, [id]);

  return <DetailTransaksiBuyer data={detailTransaction} />;
}
