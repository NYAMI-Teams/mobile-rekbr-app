import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { getSellerComplaints } from "../../../utils/api/complaint";
import { showToast } from "../../../utils";
import SellerDisputeListCard from "../../../components/dispute/SellerDisputeListCard";

export default function PenjualanDisputeHome() {
  const router = useRouter();

  const [isEmptyComplaints, setIsEmptyComplaints] = useState(false);
  const [Complaints, setComplaints] = useState([]);

  //   useEffect(() => {
  //     fetchComplaints();
  //   }, []);

  //   const fetchComplaints = async () => {
  //     try {
  //       const res = await getSellerComplaints();
  //       if (res.data.length > 0) {
  //         setIsEmptyComplaints(false);
  //       } else {
  //         setIsEmptyComplaints(true);
  //       }
  //       setComplaints(res.data);
  //     } catch (err) {
  //       showToast(
  //         "Gagal",
  //         "Gagal mengambil data transaksi. Silahkan coba lagi.",
  //         "error"
  //       );
  //     }
  //   };

  //   useEffect(() => {
  //     console.log("Complaints:", JSON.stringify(Complaints, null, 2));
  //   }, [Complaints]);

  useEffect(() => {
    // Dummy data tanpa API
    const dummyData = [
      {
        id: "1",
        status: "completed",
        type: "damaged",
        transaction: {
          itemName: "Monitor LED 24 inch",
          totalAmount: 1200000,
          buyerEmail: "pembeli@gmail.com",
          shipment: {
            trackingNumber: "RESI123456",
            courier: "JNE",
          },
        },
      },
    ];

    setComplaints(dummyData);
  }, []);

  // Function navigate dengan status + optional extra param
  const navigateToKembaliin = (status, extraParams = {}) => {
    router.push({
      pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
      params: { status, ...extraParams },
    });
  };

  const complaintStatusMap = {
    waiting_seller_approval: "waitingSellerApproval",
    return_requested: "returnRequested",
    rejected_by_seller: "sellerRejected",
    return_in_transit: "returnInTransit",
    awaiting_admin_approval: "awaitingAdminApproval",
    approved_by_seller: "approvedBySeller",
    approved_by_admin: "approvedByAdmin",
    under_investigtion: "underInvestigation",
    awaiting_seller_confirmation: "awaitingSellerConfirmation",
    completed: "Completed",
  };

  const hiddenStatuses = ["rejectedByAdmin", "disputeCancel"];

  const disputeTypeLabel = (type) => {
    if (type === "damaged") return "Barang Rusak";
    if (type === "lost") return "Barang Hilang";
    return "-";
  };

  // komplainList mapping by status
  const handleComplaintPress = (item, mappedStatus) => {
    const actions = {
      waitingSellerApproval: () =>
        router.push({
          pathname: "/dispute/SellerDispute/SellerPage",
          params: { complaintId: item?.id },
        }),
      returnRequested: () =>
        router.push({
          pathname: "",
          params: {
            complaintId: item?.id,
            status: "returnRequested",
            sellerRejected: false,
            buyerExpiredDate: false,
          },
        }),
      Completed: () =>
        router.push({
          pathname: "/dispute/SellerDispute/SelesaiPage",
          params: { complaintId: item?.id, sellerRejected: true },
        }),
      sellerRejected: () =>
        router.push({
          pathname: "/dispute/SellerDispute/AdminPage",
          params: { complaintId: item?.id, rejectedAdmin: false },
        }),
      returnInTransit: () =>
        router.push({
          pathname: "",
          params: {
            complaintId: item?.id,
            status: "returnInTransit",
            sellerRejected: false,
            buyerExpiredDate: false,
          },
        }),
      disputeProved: () =>
        router.push({
          pathname: "",
          params: { status: "disputeProved" },
        }),
      awaitingAdminApproval: () =>
        router.push({
          pathname: "",
          params: { status: "awaitingAdminApproval" },
        }),
      rejectedByAdmin: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangAdmin",
          params: { complaintId: item?.id, rejectedAdmin: true },
        }),
      awaitingSellerConfirmation: () =>
        router.push({
          pathname: "/dispute/SellerDispute/KembaliinPage",
          params: { status: "awaitingSellerConfirmation" },
        }),
      approvedBySeller: () =>
        router.push({
          pathname: "",
          params: { status: "approvedBySeller" },
        }),
      approvedByAdmin: () =>
        router.push({
          pathname: "/dispute/SellerDispute/KembaliinPage",
          params: { status: "approvedByAdmin" },
        }),
      underInvestigation: () =>
        router.push({
          pathname: "",
          params: { status: "under_investigation" },
        }),
    };

    // jalankan action jika ada, kalau tidak ya kosong
    if (actions[mappedStatus]) {
      actions[mappedStatus]();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4 pt-6">
        {/* Tab Header */}
        <View className="flex-row justify-between items-center border-b border-gray-200 mb-10">
          <View className="flex-1 items-center pb-2">
            <Text className="text-sm  text-gray-400">Pembelian</Text>
          </View>
          <View className="flex-1 items-center pb-2 border-b-2 border-[#00B7A0]">
            <Text className="text-sm font-semibold text-[#1D1D1D]">
              Penjualan
            </Text>
          </View>
        </View>

        {/* Render Card List */}
        {Complaints.filter((item) => {
          const mappedStatus =
            complaintStatusMap[item.status] || "disputeCancel";
          return !hiddenStatuses.includes(mappedStatus);
        }).map((item) => {
          const mappedStatus =
            complaintStatusMap[item.status] || "disputeCancel";

          return (
            <SellerDisputeListCard
              key={item?.id || ""}
              namaBarang={item?.transaction?.itemName || ""}
              harga={`Rp ${Number(
                item?.transaction?.totalAmount || 0
              ).toLocaleString("id-ID")}`}
              buyer={item?.transaction?.buyerEmail || ""}
              noResi={item?.transaction?.shipment?.trackingNumber
                ?.split("")
                .join(" ")}
              expedisi={item?.transaction?.shipment?.courier}
              typeDespute={disputeTypeLabel(item?.type)}
              status={mappedStatus}
              onPress={() => handleComplaintPress(item, mappedStatus)}
              onPressButton={
                mappedStatus === "returnRequested"
                  ? () =>
                      router.push({
                        pathname: "/dispute/BarangRusak/pengembalianForm",
                        params: { complaintId: item?.id },
                      })
                  : mappedStatus === "returnInTransit"
                  ? () =>
                      router.push({
                        pathname: "/dispute/BarangRusak/konfirmasiSellerForm",
                        params: { complaintId: item?.id },
                      })
                  : null
              }
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
