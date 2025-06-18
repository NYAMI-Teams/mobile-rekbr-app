import { useLocalSearchParams } from "expo-router";
import DetailTransaksiSeller from "../../components/DetailRekber/DetailTransaksiSeller";
import { getDetailSellerTransaction } from "../../utils/api/seller";
import { useEffect, useState } from "react";

// const data = {
//   id: "6ee685c4-55d4-4629-a6cd-744dd8d2751e",
//   transactionCode: "TRX-181126-8978",
//   status: "pending_payment",
//   itemName: "Babi Ngepetss",
//   itemPrice: 75000000,
//   insuranceFee: 150000,
//   platformFee: 600000,
//   totalAmount: 75750000,
//   virtualAccount: "8888918877866",
//   sellerEmail: "seller@gmail.com",
//   createdAt: "2025-06-16T03:23:01.128Z",
//   paidAt: null,
//   paymentDeadline: "2025-06-16T05:23:01.100Z",
//   shipmentDeadline: null,
//   shipment: {
//     trackingNumber: null,
//     courier: null,
//     shipmentDate: null,
//     photoUrl: null,
//   },
//   fundReleaseRequest: {
//     requested: false,
//     status: null,
//     requestedAt: null,
//     resolvedAt: null,
//   },
//   buyerConfirmDeadline: null,
//   buyerConfirmedAt: null,
//   currentTimestamp: "2025-06-16T06:43:39.337Z",
// };

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
