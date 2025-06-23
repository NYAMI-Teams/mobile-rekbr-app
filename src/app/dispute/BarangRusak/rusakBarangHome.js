import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import RusakBarangCard from "../../../components/dispute/RusakBarangCard";
import { getBuyerComplaints } from "../../../utils/api/complaint";
import { showToast } from "../../../utils";

export default function RusakBarangHome() {
  const router = useRouter();

  const [isEmptyComplaints, setIsEmptyComplaints] = useState(false);
  const [Complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getBuyerComplaints();
      if (res.data.length > 0) {
        setIsEmptyComplaints(false);
      } else {
        setIsEmptyComplaints(true);
      }
      setComplaints(res.data);
    } catch (err) {
      showToast(
        "Gagal",
        "Gagal mengambil data transaksi. Silahkan coba lagi.",
        "error"
      );
    }
  };

  // useEffect(() => {
  //   console.log("Complaints:", JSON.stringify(Complaints, null, 2));
  // }, [Complaints]);

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
  };

  const hiddenStatuses = [
    "Completed",
    "rejectedByAdmin",
    "disputeCancel",
    "awaitingSellerConfirmation",
  ];

  // komplainList mapping by status
  const handleComplaintPress = (item, mappedStatus) => {
    const actions = {
      waitingSellerApproval: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangMenunggu",
          params: { complaintId: item?.id },
        }),
      returnRequested: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
          params: {
            complaintId: item?.id,
            status: "returnRequested",
            sellerRejected: false,
            buyerExpiredDate: false,
          },
        }),
      Completed: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangSelesai",
          params: { complaintId: item?.id },
        }),
      sellerRejected: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangAdmin",
          params: { complaintId: item?.id, rejectedAdmin: false },
        }),
      returnInTransit: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
          params: {
            complaintId: item?.id,
            status: "returnInTransit",
            sellerRejected: false,
            buyerExpiredDate: false,
          },
        }),
      disputeProved: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
          params: { status: "disputeProved" },
        }),
      awaitingAdminApproval: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
          params: { status: "awaitingAdminApproval" },
        }),
      rejectedByAdmin: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangAdmin",
          params: { complaintId: item?.id, rejectedAdmin: true },
        }),
      awaitingSellerConfirmation: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
          params: { status: "awaitingSellerConfirmation" },
        }),
      approvedBySeller: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
          params: { status: "approvedBySeller" },
        }),
      approvedByAdmin: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
          params: { status: "approvedByAdmin" },
        }),
      underInvestigation: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
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
          <View className="flex-1 items-center pb-2 border-b-2 border-[#00B7A0]">
            <Text className="text-sm font-semibold text-[#1D1D1D]">
              Pembelian
            </Text>
          </View>
          <View className="flex-1 items-center pb-2">
            <Text className="text-sm text-gray-400">Penjualan</Text>
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
            <RusakBarangCard
              key={item?.id || ""}
              namaBarang={item?.transaction?.itemName || ""}
              harga={`Rp ${Number(
                item?.transaction?.totalAmount || 0
              ).toLocaleString("id-ID")}`}
              seller={item?.transaction?.sellerEmail}
              noResi={item?.transaction?.shipment?.trackingNumber
                ?.split("")
                .join(" ")}
              expedisi={item?.transaction?.shipment?.courier}
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
