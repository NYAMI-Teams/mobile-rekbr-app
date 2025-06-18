import { useLocalSearchParams } from "expo-router";
import DetailTransaksiSeller from "../../components/DetailRekber/DetailTransaksiSeller";
import { getDetailSellerTransaction } from "../../utils/api/seller";
import { useEffect, useState } from "react";


export default function SellerDetail() {
  const [detailTransaction, setDetailTransaction] = useState({});
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const res = await getDetailSellerTransaction(id);
        setDetailTransaction(res.data);
        console.log(res.data);
        console.log("Berhasil get detail transaction seller");
      } catch (err) {
        console.error("Error fetching transaction details:", err);
      } finally {
        console.log("finally");
      }
    };

    fetchTransactionDetails();
  }, [id]);

  return <DetailTransaksiSeller data={detailTransaction} />;
}
