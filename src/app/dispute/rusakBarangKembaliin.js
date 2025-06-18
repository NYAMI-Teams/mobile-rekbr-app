import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation } from "expo-router";
import PrimaryButton from "../../components/PrimaryButton";
import { InfoBanner } from "../../components/dispute/InfoBanner";
import StepProgressBar from "../../components/ProgressBar";
import { StatusKomplain } from "../../components/dispute/statusKomplain";
import { TrackDispute } from "../../components/dispute/TrackDispute";
import TextView from "../../components/dispute/textView";
import Tagihan from "../../components/DetailRekber/Tagihan";
import CopyField from "../../components/dispute/copyField";
import { X } from "lucide-react-native";

export default function RusakBarangKembaliinPage() {
  const navigation = useNavigation();
  const [resiSudahDiisi, setResiSudahDiisi] = useState(false);
  const [mintaKonfirmasi, setMintaKonfirmasi] = useState(false);
  const [ditolak, setDitolak] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="relative items-center justify-center mb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute left-0"
        >
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-center">
          Detail Komplain
        </Text>
      </View>

      <StepProgressBar
        currentStep={1}
        steps={["Menunggu", "Kembaliin", "Refund", "Selesai"]}
        isRejected={ditolak}
      />

      <ScrollView className="px-4 pt-4 pb-40">
        <InfoBanner
          contentBefore={
            ditolak
              ? "Karena pengembalian barang sudah lewat 1 x 24 jam, komplain dianggap selesai dan tidak bisa diproses lagi, status menjadi Komplain Selesai."
              : "Pastikan barang dalam kondisi baik, kemasan terjaga, dan lampirkan bukti pengiriman!"
          }
        />

        {/* Komplain status */}
        <StatusKomplain
          status={ditolak ? "Komplain Selesai" : "Menunggu Pengembalian Barang"}
        />

        {ditolak && (
          <View className="items-end px-4 mt-2">
            <TouchableOpacity
              onPress={() => console.log("Hubungi kami di klik!")}
            >
              <Text className="text-[#FF3B30] font-bold">
                Silakan Hubungi Kami
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="h-2 bg-[#f5f5f5] mt-3" />

        {ditolak && (
          <>
            <TrackDispute
              title="Status Pengembalian Barang - Ditolak"
              dateTime="20 Juni 2025, 10 : 00 WIB"
              titleColor="red"
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
          </>
        )}

        {/* Muncul kalau mintaKonfirmasi true */}
        {mintaKonfirmasi && (
          <>
            <TrackDispute
              title="Permintaan konfirmasi buyer"
              dateTime="21 Juni 2025, 10 : 00 WIB"
              details={[
                {
                  content:
                    "Melalui resi harusnya barang sudah sampai di seller",
                },
                {
                  imgTitle: "Bukti foto & video",
                  images: [require("../../assets/barangrusak.png")],
                },
              ]}
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
          </>
        )}

        {/* Muncul kalau resi sudah diisi */}
        {resiSudahDiisi && (
          <>
            <TrackDispute
              title="Pengembalian barang oleh buyer"
              dateTime="20 Juni 2025, 10 : 00 WIB"
              details={[
                {
                  resiNumber: "J X 3 4 7 4 1 2 4 0 1 3",
                  expedition: "J&T Express Indonesia",
                },
              ]}
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
          </>
        )}

        {/* Track komplain buyer */}
        <TrackDispute
          title="Pengajuan komplain buyer"
          dateTime="16 Juni 2025, 10 : 00 WIB"
          details={[
            {
              content:
                "Buyer mau ngembaliin barang yang bermasalah. Dana rekber bakal dikembalikan setelah komplain disetujui, ya!",
            },
            {
              content:
                "Layar barang pecah di bagian tengah dan ada goresan dalam di sisi kiri.",
            },
            {
              imgTitle: "Bukti foto & video",
              images: [
                require("../../assets/barangrusak.png"),
                require("../../assets/barangrusak.png"),
              ],
            },
          ]}
        />

        <View className="h-2 bg-[#f5f5f5] mt-3" />

        <TextView title="Seller" content="irgi168@gmail.com" />
        <TextView title="Nama Barang" content="IPhone 13 Pro Max" />
        <View className="p-3">
          <Tagihan
            caption="Tagihan Rekber"
            price="Rp 1.000.000"
            details={[
              { status: "Kembaliin", price: "Rp 1.000.000" },
              { status: "Refund", price: "Rp 1.000.000" },
            ]}
          />
        </View>

        {resiSudahDiisi && (
          <>
            <CopyField title="Nomor Resi" content="123456789" />
            <TextView title="Ekspedisi" content="J&T Express Indonesia" />
          </>
        )}

        <CopyField title="ID Transaksi" content="1 2 3 4 5 6 7 8 9" />
        <CopyField
          title="Virtual Account"
          content="8 0 8 0 1 2 3 4 5 6 7 8 9"
        />

        <PrimaryButton
          title={
            !resiSudahDiisi
              ? "Kirim Barang Refund"
              : mintaKonfirmasi
              ? "Menunggu Seller"
              : "Minta Konfirmasi Seller"
          }
          disabled={mintaKonfirmasi || ditolak}
          onPress={() => {
            if (!resiSudahDiisi) {
              setResiSudahDiisi(true);
            } else if (!mintaKonfirmasi) {
              setMintaKonfirmasi(true);
            }
          }}
        />

        {/* Tombol tolak */}
        {!ditolak && (
          <PrimaryButton
            title="Tolak"
            style={{ marginTop: 12, backgroundColor: "#F44336" }}
            onPress={() => setDitolak(true)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
