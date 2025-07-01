import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StyleSheet, // Import StyleSheet
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

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
  const { type } = useLocalSearchParams();

  useEffect(() => {
    fetchBuyerComplaints();
    fetchSellerComplaints();
  }, []);

  useEffect(() => {
    console.log("Type:", type);
    if (type === "seller") {
      setSelectedTab("penjualan");
    } else {
      setSelectedTab("pembelian");
    }
  }, [type]);

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
      setBuyerComplaints(res.data);
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
      setSellerComplaints(res.data);
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
          <View style={styles.emptyIllustrationContainer}>
            <EmptyIllustration
              text={
                "Pembelian belum ada komplain. Semua transaksi rekber kamu aman, mulus, dan lancar jaya!"
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
                item?.status === "approved_by_admin" ||
                item?.status === "completed" ||
                item?.status === "awaiting_seller_confirmation" ||
                item?.status === "awaiting_admin_confirmation"
                ? item?.returnShipment?.trackingNumber || "-"
                : "-"
            }
            expedisi={
              item?.status === "return_in_transit" ||
                item?.status === "approved_by_admin" ||
                item?.status === "completed" ||
                item?.status === "awaiting_seller_confirmation" ||
                item?.status === "awaiting_admin_confirmation"
                ? item?.returnShipment?.courierName || "-"
                : "-"
            }
            typeDespute={disputeTypeLabel(item?.type)}
            time={dateShow(mappedStatus, item)}
            status={mappedStatus}
            onPress={() => handleBuyerComplaintPress(item, mappedStatus)}
            onPressButton={
              mappedStatus === "returnRequested"
                ? () => {
                  router.push({
                    pathname: "/dispute/BarangRusak/pengembalianForm",
                    params: { complaintId: item?.id },
                  });
                }
                : mappedStatus === "returnInTransit"
                  ? () =>
                    router.push({
                      pathname: "/dispute/BarangRusak/konfirmasiSellerForm",
                      params: { complaintId: item?.id },
                    })
                  : () => { }
            }
          />
        );
      });
    } else {
      if (isEmptySellerComplaints) {
        return (
          <View style={styles.emptyIllustrationContainer}>
            <EmptyIllustration
              text={
                "Penjualan belum ada komplain. Semua transaksi rekber kamu aman, mulus, dan lancar jaya!"
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
                item?.status === "approved_by_admin" ||
                item?.status === "completed" ||
                item?.status === "awaiting_seller_confirmation" ||
                item?.status === "awaiting_admin_confirmation"
                ? item?.returnShipment?.trackingNumber || "-"
                : "-"
            }
            expedisi={
              item?.status === "return_in_transit" ||
                item?.status === "approved_by_admin" ||
                item?.status === "completed" ||
                item?.status === "awaiting_seller_confirmation" ||
                item?.status === "awaiting_admin_confirmation"
                ? item?.returnShipment?.courierName || "-"
                : "-"
            }
            typeDespute={disputeTypeLabel(item?.type)}
            time={dateShow(mappedStatus, item)}
            status={mappedStatus}
            onPress={() => handleSellerComplaintPress(item, mappedStatus)}
            onPressButton={() => { }}
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
    awaiting_admin_confirmation: "awaitingAdminConfirmation",
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
    under_investigation: "underInvestigation",
    awaiting_seller_confirmation: "awaitingSellerConfirmation",
    completed: "Completed",
    rejected_by_admin: "rejectedByAdmin",
    canceled_by_buyer: "canceledByBuyer",
    awaiting_admin_confirmation: "awaitingAdminConfirmation",
  };

  const dateShow = (status, data) => {
    switch (status) {
      case "waitingSellerApproval":
        return formatDateWIB(data?.sellerResponseDeadline) || "Invalid date";
      case "returnRequested":
        return ` Proses maksimal 1 x 24 jam atau ${formatDateWIB(
          data?.buyerDeadlineInputShipment
        )}`;
      case "sellerRejected":
      case "returnInTransit":
      case "awaitingAdminApproval":
      case "approvedBySeller":
      case "approvedByAdmin":
      case "underInvestigation":
      case "awaitingSellerConfirmation":
      case "Completed":
      case "rejectedByAdmin":
      case "canceledByBuyer":
      case "awaitingAdminConfirmation":
        return "";
      default:
        return "Invalid status";
    }
  };

  const disputeTypeLabel = (type) => {
    if (type === "damaged") return "Barang Rusak";
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
      Completed: () => {
        if (item?.type == "damaged") {
          router.push({
            pathname: "/dispute/BarangRusak/rusakBarangSelesai",
            params: { complaintId: item?.id },
          });
        } else {
          router.push({
            pathname: "/Complaint/Detail",
            params: { id: item?.id, role: "buyer" },
          });
        }
      },
      sellerRejected: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangAdmin",
          params: {
            complaintId: item?.id,
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
      rejectedByAdmin: () => {
        if (item?.type == "damaged") {
          router.push({
            pathname: "/dispute/BarangRusak/rusakBarangAdmin",
            params: { complaintId: item?.id, rejectedAdmin: true },
          });
        } else {
          router.push({
            pathname: "/Complaint/Detail",
            params: { id: item?.id, role: "buyer" },
          });
        }
      },
      awaitingSellerConfirmation: () =>
        //marking
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
          params: {
            complaintId: item?.id,
            status: "awaitingSellerConfirmation",
          },
        }),
      awaitingAdminConfirmation: () =>
        router.push({
          pathname: "/dispute/BarangRusak/rusakBarangKembaliin",
          params: {
            complaintId: item?.id,
            status: "awaitingAdminConfirmation",
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
      canceledByBuyer: () => {
        if (item?.type === "damaged") {
          router.push({
            pathname: "/dispute/BarangRusak/pilihKomplain",
            params: {
              id: item?.transaction?.id,
            },
          });
        } else {
          router.push({
            pathname: "/Complaint/Create",
            params: {
              id: item?.transaction?.id,
            },
          });
        }
      },
      underInvestigation: () =>
        //marking
        router.push({
          pathname: "/Complaint/Detail",
          params: { id: item?.id, role: "buyer" },
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
          },
        }),
      returnRequested: () => {
        router.push({
          pathname: "/dispute/SellerDispute/KembaliinPage",
          params: {
            id: item?.id,
            status: "returnRequested",
          },
        });
      },
      Completed: () => {
        if (item?.type == "damaged") {
          router.push({
            pathname: "/dispute/SellerDispute/SelesaiPage",
            params: { complaintId: item?.id },
          });
        } else {
          router.push({
            pathname: "/Complaint/Detail",
            params: { id: item?.id, role: "seller" },
          });
        }
      },
      sellerRejected: () => { },
      returnInTransit: () =>
        router.push({
          pathname: "/dispute/SellerDispute/KembaliinPage",
          params: {
            id: item?.id,
            status: "returnInTransit",
          },
        }),
      disputeProved: () =>
        router.push({
          pathname: "/dispute/SellerDispute/KembaliinPage",
          params: {
            id: item?.id,
            status: "disputeProved",
          },
        }),
      rejectedByAdmin: () => {
        if (item?.type == "damaged") {
          router.push({
            pathname: "/dispute/SellerDispute/AdminPage",
            params: { id: item?.id },
          });
        } else {
          router.push({
            pathname: "/Complaint/Detail",
            params: { id: item?.id, role: "seller" },
          });
        }
      },

      awaitingSellerConfirmation: () =>
        //marking
        router.push({
          pathname: "/dispute/SellerDispute/KembaliinPage",
          params: {
            id: item?.id,
            status: "awaitingSellerConfirmation",
          },
        }),
      awaitingAdminConfirmation: () =>
        router.push({
          pathname: "/dispute/SellerDispute/KembaliinPage",
          params: {
            id: item?.id,
            status: "awaitingAdminConfirmation",
          },
        }),
      approvedBySeller: () =>
        //marking
        router.push({
          pathname: "/dispute/SellerDispute/KembaliinPage",
          params: { id: item?.id, status: "approvedBySeller" },
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
          params: { id: item?.id, role: "seller" },
        }),
    };

    // jalankan action jika ada, kalau tidak ya kosong
    if (actions[mappedStatus]) {
      actions[mappedStatus]();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => handleTabPress("pembelian")}
          style={[
            styles.tabButton,
            selectedTab === "pembelian"
              ? styles.tabButtonActive
              : styles.tabButtonInactive,
          ]}>
          <Text
            style={[
              styles.tabText,
              selectedTab === "pembelian"
                ? styles.tabTextActive
                : styles.tabTextInactive,
            ]}>
            Pembelian
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabPress("penjualan")}
          style={[
            styles.tabButton,
            selectedTab === "penjualan"
              ? styles.tabButtonActive
              : styles.tabButtonInactive,
          ]}>
          <Text
            style={[
              styles.tabText,
              selectedTab === "penjualan"
                ? styles.tabTextActive
                : styles.tabTextInactive,
            ]}>
            Penjualan
          </Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 16, // px-4
    height: 40, // h-10
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#49DBC8",
  },
  tabButtonInactive: {
    borderBottomWidth: 2,
    borderBottomColor: "#D1D5DB", // gray-300
  },
  tabText: {
    fontSize: 12, // text-xs
    fontWeight: "600", // font-semibold
  },
  tabTextActive: {
    color: "#000", // text-black
  },
  tabTextInactive: {
    color: "#9CA3AF", // gray-400
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 20, // mt-5
  },
  contentContainer: {
    backgroundColor: "#fff",
  },
  scrollView: {
    paddingHorizontal: 16, // px-4
    marginVertical: 12, // my-3
  },
  emptyIllustrationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
