import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";

import RusakBarangCard from "../../components/dispute/RusakBarangCard";
import { getBuyerComplaints } from "../../utils/api/complaint";
import { showToast } from "../../utils";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DisputeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const [isEmptyComplaints, setIsEmptyComplaints] = useState(false);
  const [Complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const res = await getBuyerComplaints();
      if (res.data.length > 0) {
        setIsEmptyComplaints(false);
      } else {
        setIsEmptyComplaints(true);
      }
      // console.log("ini complaints", res.data);r

      setComplaints(res.data);
      console.log("Complaints:", JSON.stringify(res.data, null, 2));
    } catch (err) {
      showToast(
        "Gagal",
        "Gagal mengambil data transaksi. Silahkan coba lagi.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchComplaints();
    setRefreshing(false);
  };

  // Function navigate dengan status + optional extra param
  const navigateToKembaliin = (status, extraParams = {}) => {
    router.push({
      pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
      params: { status, ...extraParams },
    });
  };

  const complaintStatusMap = {
    waiting_seller_approval: "waitingSellerApproval", //done
    return_requested: "returnRequested", //done
    rejected_by_seller: "sellerRejected", //return requested kalau udah di seller rejected gausah di test
    return_in_transit: "returnInTransit", //done
    awaiting_admin_approval: "awaitingAdminApproval", //done
    approved_by_seller: "approvedBySeller", //return requested kalau udah di approved by seller gausah di test
    approved_by_admin: "approvedByAdmin", //gaada karena langsung ke (return_requested)
    under_investigation: "underInvestigation", //done
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
      returnRequested: () => {
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
          params: {
            complaintId: item?.id,
            status: "returnRequested",
          },
        });
      },
      Completed: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangSelesai",
          params: { complaintId: item?.id },
        }),
      sellerRejected: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangAdmin",
          params: {
            complaintId: item?.id,
            status: "sellerRejected",
            rejectedAdmin: false,
          },
        }),
      returnInTransit: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
          params: {
            complaintId: item?.id,
            status: "returnInTransit",
          },
        }),
      disputeProved: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
          params: {
            complaintId: item?.id,
            status: "disputeProved",
          },
        }),
      awaitingAdminApproval: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangAdmin",
          params: {
            complaintId: item?.id,
            rejectedAdmin: false,
            status: "awaitingAdminApproval",
          },
        }),
      rejectedByAdmin: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangAdmin",
          params: { complaintId: item?.id, rejectedAdmin: true },
        }),
      awaitingSellerConfirmation: () =>
        //marking
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
          params: {
            complaintId: item?.id,
            status: "awaitingSellerConfirmation",
          },
        }),
      approvedBySeller: () =>
        //marking
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
          params: { complaintId: item?.id, status: "approvedBySeller" },
        }),
      approvedByAdmin: () => {
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
          params: {
            complaintId: item?.id,
            status: "approvedByAdmin",
          },
        });
      },
      underInvestigation: () =>
        //marking
        router.push({
          pathname: "/Complaint/Detail",
          params: { id: item?.id },
        }),
    };

    // jalankan action jika ada, kalau tidak ya kosong
    if (actions[mappedStatus]) {
      actions[mappedStatus]();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* <NavigationBar /> */}
      {/* <RusakBarangRefund /> */}
      {/* <RusakBarangKembaliinPage /> */}

      <View className="flex-1 bg-white">
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
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <ScrollView
            className="px-4 pt-6"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
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
                  noResi={
                    item?.status === "return_in_transit" ||
                    item?.status === "approved_by_admin"
                      ? item?.returnShipment?.trackingNumber || "-"
                      : "-"
                  }
                  expedisi={
                    item?.status === "return_in_transit" ||
                    item?.status === "approved_by_admin"
                      ? item?.returnShipment?.courierName || "-"
                      : "-"
                  }
                  time={item?.buyerDeadlineInputShipment} //ini sellerConfirmDeadline untuk seller, kalau buyer
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
                            pathname:
                              "/dispute/BarangRusak/konfirmasiSellerForm",
                            params: { complaintId: item?.id },
                          })
                      : null
                  }
                />
              );
            })}
          </ScrollView>
        )}
      </View>
      {/* )} */}
    </SafeAreaView>
  );
}
