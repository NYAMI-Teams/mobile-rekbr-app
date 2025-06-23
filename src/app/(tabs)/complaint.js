import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import ComplaintCard from "@/components/ComplaintCard";
import NavigationBar from "@/components/NavigationBar";
import EmptyIllustration from "@/components/Ilustration";

import { getBuyerComplaints } from "@/utils/api/complaint";
import { showToast } from "@/utils";
import { getAccessToken, removeAccessToken } from "@/store";
import { getProfile } from "@/utils/api/auth";

export default function ComplaintListScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("pembelian");
  const [complaints, setComplaints] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getBuyerComplaints();
      setComplaints(res.data);
    } catch (err) {
      showToast("Gagal", "Gagal mengambil data komplain", "error");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchComplaints();
    setRefreshing(false);
  };

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) return handleLogout();
      const res = await getProfile();
      setProfile(res.data);
    } catch (err) {
      showToast("Sesi Berakhir", err?.message, "error");
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await removeAccessToken();
    router.replace("Onboarding");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style='dark' />
      <View style={{ flex: 1, padding: 16 }}>
        <NavigationBar
          name={profile?.email}
          onNotificationPress={() =>
            showToast("Notification", "Notification pressed", "success")
          }
          onLogoutPress={handleLogout}
        />

        {/* Tabs */}
        <View className='flex-row border-b border-gray-200'>
          {["pembelian", "penjualan"].map((tab) => (
            <TouchableOpacity
              key={tab}
              className='flex-1 items-center pb-2'
              onPress={() => setActiveTab(tab)}
            >
              <Text
                className={`text-lg font-semibold ${
                  activeTab === tab ? "text-black" : "text-gray-400"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
              {activeTab === tab && (
                <View className='h-1 w-full bg-[#3ED9D0] rounded-full mt-1' />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {isLoading ? (
          <View className='flex-1 justify-center items-center'>
            <ActivityIndicator size='large' color='#000' />
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {complaints.length === 0 ? (
              <View className='items-center mt-8'>
                <EmptyIllustration text='Belum ada komplain yang kamu ajukan.' />
              </View>
            ) : (
              complaints.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    router.push({
                      pathname: "/Complaint/Detail",
                      params: { id: item.id },
                    })
                  }
                >
                  <ComplaintCard
                    productName={item.itemName}
                    sellerEmail={item.sellerEmail}
                    price={item.totalAmount}
                    resi={item.shipment?.trackingNumber || "-"}
                    ekspedisi={item.shipment?.courier || "-"}
                    complaint={item.complaint}
                  />
                </Pressable>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
