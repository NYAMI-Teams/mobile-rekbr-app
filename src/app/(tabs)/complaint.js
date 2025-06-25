import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

import RusakBarangCard from "@/components/dispute/RusakBarangCard";
import { getBuyerComplaints, getSellerComplaints } from "@/utils/api/complaint";
import { showToast } from "@/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyIllustration from "@/components/Ilustration";
import SellerDisputeListCard from "@/components/dispute/SellerDisputeListCard";
import moment from "moment";

const formatDateWIB = (dateTime) => {
  if (!dateTime) return "Invalid date";
  return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
};

export default function DisputeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("pembelian");
  const [BuyerComplaints, setBuyerComplaints] = useState([]);
  const [SellerComplaints, setSellerComplaints] = useState([]);
  const [isEmptyBuyerComplaints, setIsEmptyBuyerComplaints] = useState(false);
  const [isEmptySellerComplaints, setIsEmptySellerComplaints] = useState(false);

  useEffect(() => {
    fetchBuyerComplaints();
    fetchSellerComplaints();
  }, []);

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
  };

  const fetchBuyerComplaints = async () => {
    setIsLoading(true);
    try {
      const res = await getBuyerComplaints();
      if (res.data.length > 0) {
        setIsEmptyBuyerComplaints(false);
      } else {
        setIsEmptyBuyerComplaints(true);
      }
      // console.log("ini complaints", res.data);r

      setBuyerComplaints(res.data);
      console.log("Complaints as Buyer:", JSON.stringify(res.data, null, 2));
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

  const fetchSellerComplaints = async () => {
    setIsLoading(true);
    try {
      const res = await getSellerComplaints();
      if (res.data.length > 0) {
        setIsEmptySellerComplaints(false);
      } else {
        setIsEmptySellerComplaints(true);
      }
      // console.log("ini complaints", res.data);r

      setSellerComplaints(res.data);
      console.log("Complaints as Seller:", JSON.stringify(res.data, null, 2));
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
    if (selectedTab === "pembelian") {
      await fetchBuyerComplaints();
    } else {
      await fetchSellerComplaints();
    }
    setRefreshing(false);
  };

  const renderContent = () => {
    if (selectedTab === "pembelian") {
      if (isEmptyBuyerComplaints) {
        return (
          <View className="justify-center items-center">
            <EmptyIllustration
              text={
                "Belum ada dispute, semua transaksi rekber kamu aman, mulus, dan lancar jaya!"
              }
            />
          </View>
        );
      }
      return BuyerComplaints.filter((item) => {
        const mappedStatus = complaintStatusMapBuyer[item.status];
        return mappedStatus;
      }).map((item) => {
        const mappedStatus = complaintStatusMapBuyer[item.status];
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
            time={item?.sellerConfirmDeadline} // ini perlu dibuat function base on status, karena timenya beda beda
            status={mappedStatus}
            onPress={() => handleBuyerComplaintPress(item, mappedStatus)}
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
                : () => {}
            }
          />
        );
      });
    } else {
      if (isEmptySellerComplaints) {
        console.log("Masuk seller");

        return (
          <View className="justify-center items-center">
            <EmptyIllustration
              text={
                "Belum ada dispute. Semua transaksi rekber kamu aman, mulus, dan lancar jaya!"
              }
            />
          </View>
        );
      }
      return SellerComplaints.filter((item) => {
        const mappedStatus = complaintStatusMapSeller[item.status];
        return mappedStatus;
      }).map((item) => {
        const mappedStatus = complaintStatusMapSeller[item.status];
        return (
          <SellerDisputeListCard
            key={item?.id || ""}
            namaBarang={item?.transaction?.itemName || ""}
            harga={`Rp ${Number(
              item?.transaction?.totalAmount || 0
            ).toLocaleString("id-ID")}`}
            buyer={item?.transaction?.buyerEmail || ""}
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
            typeDespute={disputeTypeLabel(item?.type)}
            time={formatDateWIB(item?.sellerConfirmDeadline)}
            status={mappedStatus}
            onPress={() => handleSellerComplaintPress(item, mappedStatus)}
            onPressButton={
              mappedStatus === "returnRequested"
                ? () => {
                    console.log("ini status dari seller", mappedStatus);
                    router.push({
                      pathname: "/dispute/BarangRusak/pengembalianForm",
                      params: { complaintId: item?.id },
                    });
                  }
                : mappedStatus === "returnInTransit"
                ? () => {
                    router.push({
                      pathname: "/dispute/BarangRusak/konfirmasiSellerForm",
                      params: { complaintId: item?.id },
                    });
                  }
                : () => {
                    console.log("Null", mappedStatus);
                  } // Default empty function
            }
          />
        );
      });
    }
  };

  // Function navigate dengan status + optional extra param
  const navigateToKembaliin = (status, extraParams = {}) => {
    router.push({
      pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
      params: { status, ...extraParams },
    });
  };

  const complaintStatusMapBuyer = {
    waiting_seller_approval: "waitingSellerApproval", //done
    return_requested: "returnRequested", //done
    rejected_by_seller: "sellerRejected", //return requested kalau udah di seller rejected gausah di test
    return_in_transit: "returnInTransit", //done
    awaiting_admin_approval: "awaitingAdminApproval", //done
    approved_by_seller: "approvedBySeller", //return requested kalau udah di approved by seller gausah di test
    approved_by_admin: "approvedByAdmin", //gaada karena langsung ke (return_requested)
    under_investigation: "underInvestigation", //done
    completed: "Completed",
    rejected_by_admin: "rejectedByAdmin",
    canceled_by_buyer: "canceledByBuyer",
    awaiting_seller_confirmation: "awaitingSellerConfirmation",
  };

  const complaintStatusMapSeller = {
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
    rejected_by_admin: "rejectedByAdmin",
    canceled_by_buyer: "canceledByBuyer",
  };

  const hiddenStatusesBuyer = [
    "completed", //kalo seller masuk ke status map
    "rejected_by_admin",
    "canceled_by_buyer",
    "awaiting_seller_confirmation", // kalo seller masuk ke status map
  ];

  const hiddenStatusesSeller = ["rejected_by_admin", "canceled_by_buyer"];

  const disputeTypeLabel = (type) => {
    if (type === "Barang rusak") return "Barang Rusak";
    if (type === "lost") return "Barang Hilang";
    return "-";
  };

  // komplainList mapping by status
  const handleBuyerComplaintPress = (item, mappedStatus) => {
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

  const handleSellerComplaintPress = (item, mappedStatus) => {
    const actions = {
      waitingSellerApproval: () =>
        router.push({
          pathname: "/dispute/SellerDispute/SellerPage",
          params: { id: item?.id },
        }),
      awaitingAdminApproval: () =>
        router.push({
          pathname: "/dispute/SellerDispute/AdminPage",
          params: {
            id: item?.id,
            rejectedAdmin: false,
            status: "awaitingAdminApproval",
          },
        }),
      returnRequested: () => {
        router.push({
          pathname: "/dispute/SellerDispute/KembaliinPage",
          params: {
            complaintId: item?.id,
            status: "returnRequested",
          },
        });
      },
      Completed: () =>
        router.push({
          pathname: "/dispute/SellerDispute/SelesaiPage",
          params: { complaintId: item?.id },
        }),
      sellerRejected: () => {},
      returnInTransit: () =>
        router.push({
          pathname: "/dispute/SellerDispute/KembaliinPage",
          params: {
            complaintId: item?.id,
            status: "returnInTransit",
          },
        }),
      disputeProved: () =>
        router.push({
          pathname: "/dispute/SellerDispute/KembaliinPage",
          params: {
            complaintId: item?.id,
            status: "disputeProved",
          },
        }),
      rejectedByAdmin: () =>
        router.push({
          pathname: "/dispute/SellerDispute/SellerPage",
          params: { complaintId: item?.id, rejectedAdmin: true },
        }),
      awaitingSellerConfirmation: () =>
        //marking
        router.push({
          pathname: "/dispute/SellerDispute/KembaliinPage",
          params: {
            complaintId: item?.id,
            status: "awaitingSellerConfirmation",
          },
        }),
      approvedBySeller: () =>
        //marking
        router.push({
          pathname: "/dispute/SellerDispute/KembaliinPage",
          params: { complaintId: item?.id, status: "approvedBySeller" },
        }),
      approvedByAdmin: () => {
        router.push({
          pathname: "/dispute/SellerDispute/KembaliinPage",
          params: {
            id: item?.id,
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
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* <View className="flex-1 bg-white"> */}
      <View className="flex-row w-full px-4 h-10">
        <TouchableOpacity
          onPress={() => handleTabPress("pembelian")}
          className={`flex-1 items-center justify-center h-full ${
            selectedTab === "pembelian"
              ? "border-b-2 border-[#49DBC8]"
              : "border-b-2 border-gray-300"
          }`}>
          <Text
            className={`text-xs font-semibold ${
              selectedTab === "pembelian" ? "text-black" : "text-gray-400"
            }`}>
            Pembelian
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabPress("penjualan")}
          className={`flex-1 items-center justify-center h-full ${
            selectedTab === "penjualan"
              ? "border-b-2 border-[#49DBC8]"
              : "border-b-2 border-gray-300"
          }`}>
          <Text
            className={`text-xs font-semibold ${
              selectedTab === "penjualan" ? "text-black" : "text-gray-400"
            }`}>
            Penjualan
          </Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <View className="flex-1 items-center mt-5">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <View className="bg-white">
          <ScrollView
            className="px-4 my-3"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {renderContent()}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
