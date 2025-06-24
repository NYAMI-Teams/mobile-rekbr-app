// import React from "react";
// import { View, Text, TouchableOpacity, ScrollView } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { ChevronLeft } from "lucide-react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";

// import PrimaryButton from "../../../components/PrimaryButton";
// import { InfoBanner } from "../../../components/dispute/InfoBanner";
// import StepProgressBar from "../../../components/ProgressBar";
// import { StatusKomplain } from "../../../components/dispute/statusKomplain";
// import { TrackDispute } from "../../../components/dispute/TrackDispute";
// import TextView from "../../../components/dispute/textView";
// import Tagihan from "../../../components/DetailRekber/Tagihan";
// import CopyField from "../../../components/dispute/copyField";

// export default function RusakBarangKembaliinPage() {
//   const router = useRouter();
//   const {
//     sellerRejected: sellerRejectedParam,
//     ditolak: ditolakParam,
//     resi: resiParam,
//     mintaKonfirmasi: mintaKonfirmasiParam,
//     AdminResponse: adminResponseParam,
//   } = useLocalSearchParams();

//   const sellerRejected = sellerRejectedParam === "true";
//   const ditolak = ditolakParam === "true";
//   const resiSudahDiisi = resiParam === "true";
//   const mintaKonfirmasi = mintaKonfirmasiParam === "true";
//   const adminResponse = adminResponseParam === "true";

//   const handlePrimaryButton = () => {
//     if (!resiSudahDiisi) {
//       router.push("/dispute/BarangRusak/pengembalianForm");
//     } else if (!mintaKonfirmasi) {
//       router.push("/dispute/BarangRusak/konfirmasiSellerForm");
//     }
//   };

//   const getButtonTitle = () => {
//     if (!resiSudahDiisi) return "Kirim Barang Refund";
//     if (mintaKonfirmasi) return "Menunggu Seller";
//     return "Minta Konfirmasi Seller";
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <View className="flex-row items-center justify-between p-4">
//         <TouchableOpacity
//           onPress={() => router.replace("../../(tabs)/dispute")}
//         >
//           <ChevronLeft size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="text-base font-semibold">Detail Komplain</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <StepProgressBar
//         currentStep={2}
//         steps={["Seller", "Admin", "Kembaliin", "Refunded"]}
//         rejectedSteps={ditolak ? [2] : sellerRejected ? [0] : []}
//       />

//       <ScrollView className="px-4 pb-40">
//         {/* Seller reject - admin approve */}
//         {sellerRejected && !ditolak && (
//           <>
//             <InfoBanner
//               contentBefore={
//                 resiSudahDiisi
//                   ? "Tunggu konfirmasi dari seller soal barang yang kamu kembalikan, baru deh dana bakal kembali ke kamu."
//                   : "Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali !"
//               }
//               dateTime={
//                 !resiSudahDiisi ? "! Proses maksimal 1 x 24 jam." : undefined
//               }
//             />
//             <StatusKomplain status="Menunggu Pengembalian Barang" />
//             <View className="h-2 bg-[#f5f5f5] mt-3" />
//             {resiSudahDiisi && (
//               <>
//                 <TrackDispute
//                   title="Pengembalian barang oleh buyer"
//                   dateTime="20 Juni 2025, 10:00 WIB"
//                   details={[
//                     {
//                       resiNumber: "J X 3 4 7 4 1 2 4 0 1 3",
//                       expedition: "J&T Express Indonesia",
//                     },
//                   ]}
//                 />
//                 <View className="h-2 bg-[#f5f5f5] mt-3" />
//               </>
//             )}
//             <TrackDispute
//               title="Persetujuan komplain oleh admin"
//               dateTime="16 Juni 2025, 16:00 WIB"
//               details={[
//                 {
//                   content:
//                     "Setelah tinjau bukti, komplain dinyatakan valid. Refund akan diproses meski seller menolak.",
//                 },
//               ]}
//             />
//             <TrackDispute
//               title="Penolakan komplain seller"
//               dateTime="16 Juni 2025, 14:00 WIB"
//               details={[
//                 { content: "Bukti buyer belum cukup kuat." },
//                 {
//                   imgTitle: "Bukti foto & video",
//                   images: [
//                     require("../../../assets/barangrusak.png"),
//                     require("../../../assets/barangrusak.png"),
//                   ],
//                 },
//               ]}
//             />
//           </>
//         )}

//         {/* Seller setuju */}
//         {!sellerRejected && !ditolak && (
//           <>
//             <InfoBanner
//               contentBefore={
//                 resiSudahDiisi && mintaKonfirmasi
//                   ? "Konfirmasi udah dikirim ke seller! Sekarang tinggal tunggu respon mereka dalam 1 x 24 jam."
//                   : "Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali !"
//               }
//               dateTime={
//                 !resiSudahDiisi ? "! Proses maksimal 1 x 24 jam." : undefined
//               }
//             />
//             <StatusKomplain status="Menunggu Pengembalian Barang" />
//             {/* Minta konfirmasi */}
//             {resiSudahDiisi && !ditolak && mintaKonfirmasi && (
//               <>
//                 <InfoBanner contentBefore="Tunggu approval bukti dari admin, ya! Kalau bukti kamu oke, permintaan konfirmasi bakal langsung dikirim ke seller!" />

//                 <TrackDispute
//                   title="Permintaan konfirmasi buyer"
//                   dateTime="Barang harusnya sampai seller"
//                   details={[
//                     {
//                       content:
//                         "Melalui resi harusnya barang sudah sampai di seller",
//                     },
//                     {
//                       imgTitle: "Bukti foto & video",
//                       images: [require("../../../assets/barangrusak.png")],
//                     },
//                   ]}
//                 />

//                 {adminResponse !== null &&
//                   (adminResponse ? (
//                     <TrackDispute
//                       title="Admin meneruskan permintaan konfirmasi"
//                       dateTime="20 Juni 2025, 12:00 WIB"
//                     />
//                   ) : (
//                     <>
//                       <InfoBanner contentBefore="Pengajuan ditolak karena bukti tidak valid. Silakan hubungi kami." />
//                       <StatusKomplain status="Transaksi Selesai" />
//                       <TrackDispute
//                         title="Admin menolak permintaan konfirmasi"
//                         dateTime="20 Juni 2025, 12:00 WIB"
//                       />
//                     </>
//                   ))}
//               </>
//             )}
//             <View className="h-2 bg-[#f5f5f5] mt-3" />
//             {resiSudahDiisi && (
//               <>
//                 <TrackDispute
//                   title="Pengembalian barang oleh buyer"
//                   dateTime="20 Juni 2025, 10:00 WIB"
//                   details={[
//                     {
//                       resiNumber: "J X 3 4 7 4 1 2 4 0 1 3",
//                       expedition: "J&T Express Indonesia",
//                     },
//                   ]}
//                 />
//                 <View className="h-2 bg-[#f5f5f5] mt-3" />
//               </>
//             )}
//             <TrackDispute
//               title="Persetujuan komplain seller"
//               dateTime="19 Juni 2025, 10:00 WIB"
//               details={[
//                 {
//                   content:
//                     "Seller mau nerima barang kembaliin agar dapat ditukar, kirim bukti Refund.",
//                 },
//               ]}
//             />
//           </>
//         )}

//         {/* Ditolak admin */}
//         {ditolak && (
//           <>
//             <InfoBanner
//               contentBefore="Karena pengembalian barang sudah lewat 1 x 24 jam, komplain"
//               dateTime=" dianggap selesai dan tidak bisa diproses lagi"
//             />
//             <StatusKomplain status="Transaksi Selesai" />
//             <TouchableOpacity
//               onPress={() => console.log("Hubungi kami di klik!")}
//             >
//               <View className="items-end px-4 mt-4">
//                 <Text className="text-[#3267E3] font-bold">
//                   Silahkan Hubungi Kami
//                 </Text>
//               </View>
//             </TouchableOpacity>
//             <TrackDispute
//               title="Status Pengembalian Barang - Lewat 1 x 24 Jam"
//               dateTime="20 Juni 2025, 10:00 WIB"
//               titleColor="#CB3A31"
//             />
//             <TrackDispute
//               title="Persetujuan komplain seller"
//               dateTime="19 Juni 2025, 10:00 WIB"
//               details={[
//                 {
//                   content:
//                     "Seller mau nerima barang kembaliin agar dapat ditukar, kirim bukti Refund.",
//                 },
//               ]}
//             />
//           </>
//         )}

//         {/* Admin response */}
//         {resiSudahDiisi &&
//           !ditolak &&
//           mintaKonfirmasi &&
//           adminResponse &&
//           (adminResponse ? (
//             <TrackDispute
//               title="Admin meneruskan permintaan konfirmasi"
//               dateTime="20 Juni 2025, 12:00 WIB"
//             />
//           ) : (
//             <>
//               <InfoBanner contentBefore="Pengajuan ditolak karena bukti tidak valid. Silakan hubungi kami." />
//               <StatusKomplain status="Transaksi Selesai" />
//               <TrackDispute
//                 title="Admin menolak permintaan konfirmasi"
//                 dateTime="20 Juni 2025, 12:00 WIB"
//               />
//             </>
//           ))}

//         {/* Pengajuan awal */}
//         <TrackDispute
//           title="Pengajuan komplain buyer"
//           dateTime="16 Juni 2025, 10:00 WIB"
//           details={[
//             {
//               content:
//                 "Buyer ingin mengembalikan barang. Dana rekber akan dikembalikan setelah komplain disetujui.",
//             },
//             { content: "Layar barang pecah di tengah, goresan di sisi kiri." },
//             {
//               imgTitle: "Bukti foto & video",
//               images: [
//                 require("../../../assets/barangrusak.png"),
//                 require("../../../assets/barangrusak.png"),
//               ],
//             },
//           ]}
//         />

//         {/* Data Transaksi */}
//         <TextView title="Seller" content="irgi168@gmail.com" />
//         <TextView title="Nama Barang" content="IPhone 13 Pro Max" />
//         <View className="p-3">
//           <Tagihan
//             caption="Tagihan Rekber"
//             price="Rp 1.000.000"
//             details={[
//               { status: "Kembaliin", price: "Rp 1.000.000" },
//               { status: "Refund", price: "Rp 1.000.000" },
//             ]}
//           />
//         </View>
//         <CopyField title="Nomor Resi" content="123456789" />
//         <TextView title="Ekspedisi" content="J&T Express Indonesia" />
//         <CopyField title="ID Transaksi" content="123456789" />
//         <CopyField title="Virtual Account" content="8080123456789" />

//         {/* Button */}
//         {!ditolak && (
//           <PrimaryButton
//             title={getButtonTitle()}
//             disabled={mintaKonfirmasi}
//             onPress={handlePrimaryButton}
//           />
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import PrimaryButton from "../../../components/PrimaryButton";
import { InfoBanner } from "../../../components/dispute/InfoBanner";
import StepProgressBar from "../../../components/ProgressBar";
import { StatusKomplain } from "../../../components/dispute/statusKomplain";
import { TrackDispute } from "../../../components/dispute/TrackDispute";
import TextView from "../../../components/dispute/textView";
import Tagihan from "../../../components/DetailRekber/Tagihan";
import CopyField from "../../../components/dispute/copyField";
import { getDetailBuyerComplaint } from "../../../utils/api/complaint";

export default function RusakBarangKembaliinPage() {
  const router = useRouter();
  const {
    status,
    sellerRejected: sellerRejectedParam,
    buyerExpiredDate,
    resi: resiParam,
  } = useLocalSearchParams();

  const sellerRejected = sellerRejectedParam === "true";
  const [ditolak, setDitolak] = useState(buyerExpiredDate === "true");

  const [detailComplaint, setDetailComplaint] = useState({});
  const { complaintId } = useLocalSearchParams();

  useEffect(() => {
    if (complaintId) {
      fetchComplaintDetails();
    }
  }, [complaintId]);

  const fetchComplaintDetails = async () => {
    try {
      const res = await getDetailBuyerComplaint(complaintId);
      setDetailComplaint(res.data);
    } catch (err) {
      showToast(
        "Gagal",
        "Gagal mengambil data transaksi. Silahkan coba lagi.",
        "error"
      );
    }
  };

  useEffect(() => {
    console.log("Complaints:", JSON.stringify(detailComplaint, null, 2));
  }, [detailComplaint]);

  const handlePrimaryButton = () => {
    if (status === "returnRequested") {
      router.push({
        pathname: "/dispute/BarangRusak/pengembalianForm",
        params: { complaintId: complaintId },
      });
    } else if (status === "returnInTransit") {
      router.push({
        pathname: "/dispute/BarangRusak/konfirmasiSellerForm",
        params: { complaintId: complaintId },
      });
    }
  };

  const getButtonTitle = () => {
    if (status === "returnRequested") return "Kirim Barang Refund";
    if (status === "returnInTransit") return "Minta Konfirmasi Seller";
    if (status === "disputeProved") return "Kirim Bukti Pengembalian";
    return null;
  };

  const renderStatusSection = () => {
    switch (status) {
      case "adminApprove":
        return (
          <>
            <InfoBanner contentBefore="Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali ! Proses maksimal 1 x 24 jam." />
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
            {sellerRejected ? (
              <>
                <TrackDispute
                  title="Persetujuan komplain oleh admin"
                  dateTime="16 Juni 2025, 16:00 WIB"
                  details={[
                    {
                      content:
                        "Setelah tinjau bukti yang kamu kirim, komplain dinyatakan valid. Refund akan diproses meski seller menolak.",
                    },
                  ]}
                />
                <View className="h-2 bg-[#f5f5f5] mt-3" />
                <TrackDispute
                  title="Penolakan komplain seller"
                  dateTime="16 Juni 2025, 14:00 WIB"
                  details={[
                    { content: "Bukti buyer belum cukup kuat." },
                    {
                      imgTitle: "Bukti foto & video",
                      images: [
                        require("../../../assets/barangrusak.png"),
                        require("../../../assets/barangrusak.png"),
                      ],
                    },
                  ]}
                />
                <View className="h-2 bg-[#f5f5f5] mt-3" />
              </>
            ) : (
              <TrackDispute
                title="Persetujuan komplain oleh admin"
                dateTime="16 Juni 2025, 16:00 WIB"
                details={[
                  {
                    content:
                      "Setelah tinjau bukti, komplain dinyatakan valid. Refund akan diproses meski seller menolak.",
                  },
                ]}
              />
            )}
          </>
        );

      case "disputeProved":
        return (
          <>
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <InfoBanner contentBefore="Seller nggak kasih kabar, jadi sekarang giliran kamu buat lanjut prosesnya. Ayo upload bukti pengembalian barang!" />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
            <TrackDispute
              title="Seller nggak respon dalam 2x24 jam."
              dateTime="18 Juni 2025, 10:00 WIB"
              details={[
                {
                  content:
                    "Sekarang giliran kamu kirim balik barangnya. Jangan lupa upload bukti pengiriman supaya proses refund lanjut!",
                },
              ]}
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />
          </>
        );

      case "buyerResi":
        return (
          <>
            <InfoBanner contentBefore="Barang harus segera kamu kirim. Pastikan aman dan lampirkan bukti resi." />
            <StatusKomplain status="Menunggu Pengembalian Barang" />
          </>
        );

      case "requestSeller":
        return (
          <>
            <InfoBanner contentBefore="Konfirmasi resi udah dikirim ke seller, tunggu approval mereka ya!" />
            <StatusKomplain status="Menunggu Seller" />
          </>
        );

      case "waitSeller":
        return (
          <>
            <InfoBanner contentBefore="Admin meneruskan permintaan konfirmasi ke seller." />
            <StatusKomplain status="Menunggu Seller Konfirmasi" />
          </>
        );

      case "requestRejected":
        return (
          <>
            <InfoBanner contentBefore="Komplain ditolak karena bukti tidak valid. Silakan hubungi kami." />
            <StatusKomplain status="Transaksi Selesai" />
          </>
        );

      case "disputeCancel":
        return (
          <>
            <InfoBanner contentBefore="Komplain dibatalkan. Transaksi dinyatakan selesai." />
            <StatusKomplain status="Transaksi Selesai" />
          </>
        );

      case "returnRequested":
        return (
          <>
            <InfoBanner contentBefore="Tunggu konfirmasi dari seller soal barang yang kamu kembalikan, baru deh dana bakal kembali ke kamu." />
            <StatusKomplain status="Menunggu Pengembalian Barang" />
            <View className="h-2 bg-[#f5f5f5] mt-3" />

            {sellerRejected === false ? (
              <TrackDispute
                title="Persetujuan komplain seller"
                dateTime="19 Juni 2025, 10:00 WIB"
                details={[
                  {
                    content:
                      "Seller mau nerima barang kembaliin agar dapat ditukar, kirim bukti Refund.",
                  },
                ]}
              />
            ) : (
              <>
                <TrackDispute
                  title="Persetujuan komplain oleh admin"
                  dateTime="16 Juni 2025, 16:00 WIB"
                  details={[
                    {
                      content:
                        "Setelah tinjau bukti, komplain dinyatakan valid. Refund akan diproses meski seller menolak.",
                    },
                  ]}
                />
                <View className="h-2 bg-[#f5f5f5] mt-3" />
                <TrackDispute
                  title="Penolakan komplain seller"
                  dateTime="16 Juni 2025, 14:00 WIB"
                  details={[
                    { content: "Bukti buyer belum cukup kuat." },
                    {
                      imgTitle: "Bukti foto & video",
                      images: [
                        require("../../../assets/barangrusak.png"),
                        require("../../../assets/barangrusak.png"),
                      ],
                    },
                  ]}
                />
                <View className="h-2 bg-[#f5f5f5] mt-3" />
              </>
            )}
          </>
        );

      case "returnInTransit":
        return (
          <>
            {ditolak === true ? (
              <InfoBanner
                contentBefore="Karena pengembalian barang sudah lewat 1 x 24 jam, komplain"
                dateTime=" dianggap selesai dan tidak bisa diproses lagi"
              />
            ) : (
              <InfoBanner contentBefore="Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali ! Proses maksimal 1 x 24 jam." />
            )}

            <StatusKomplain
              status={
                ditolak === true
                  ? "Transaksi Selesai"
                  : "Menunggu Pengembalian Barang"
              }
            />
            <View className="h-2 bg-[#f5f5f5] mt-3" />

            {ditolak === true ? (
              <>
                <TouchableOpacity
                  onPress={() => console.log("Hubungi kami di klik!")}
                >
                  <View className="items-end px-4 mt-4">
                    <Text className="text-[#3267E3] font-bold">
                      Silahkan Hubungi Kami
                    </Text>
                  </View>
                </TouchableOpacity>
                <TrackDispute
                  title="Status Pengembalian Barang - Lewat 1 x 24 Jam"
                  dateTime="20 Juni 2025, 10:00 WIB"
                  titleColor="#CB3A31"
                />
              </>
            ) : (
              <TrackDispute
                title="Pengembalian barang oleh buyer"
                dateTime="20 Juni 2025, 10:00 WIB"
                details={[
                  {
                    resiNumber: "J X 3 4 7 4 1 2 4 0 1 3",
                    expedition: "J&T Express Indonesia",
                  },
                ]}
              />
            )}

            <View className="h-2 bg-[#f5f5f5] mt-3" />

            {sellerRejected === false ? (
              <TrackDispute
                title="Persetujuan komplain seller"
                dateTime="19 Juni 2025, 10:00 WIB"
                details={[
                  {
                    content:
                      "Seller mau nerima barang kembaliin agar dapat ditukar, kirim bukti Refund.",
                  },
                ]}
              />
            ) : (
              <>
                <TrackDispute
                  title="Persetujuan komplain oleh admin"
                  dateTime="16 Juni 2025, 16:00 WIB"
                  details={[
                    {
                      content:
                        "Setelah tinjau bukti, komplain dinyatakan valid. Refund akan diproses meski seller menolak.",
                    },
                  ]}
                />
                <View className="h-2 bg-[#f5f5f5] mt-3" />
                <TrackDispute
                  title="Penolakan komplain seller"
                  dateTime="16 Juni 2025, 14:00 WIB"
                  details={[
                    { content: "Bukti buyer belum cukup kuat." },
                    {
                      imgTitle: "Bukti foto & video",
                      images: [
                        require("../../../assets/barangrusak.png"),
                        require("../../../assets/barangrusak.png"),
                      ],
                    },
                  ]}
                />
                <View className="h-2 bg-[#f5f5f5] mt-3" />
              </>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const renderPrimaryButton = () => {
    const title = getButtonTitle();
    if (!title) return null;
    return <PrimaryButton title={title} onPress={handlePrimaryButton} />;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity
          onPress={() => router.replace("../../(tabs)/dispute")}
        >
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-base font-semibold">Detail Komplain</Text>
        <View style={{ width: 24 }} />
      </View>

      <StepProgressBar
        currentStep={2}
        steps={["Seller", "Admin", "Kembaliin", "Refunded"]}
        rejectedSteps={ditolak ? [2] : sellerRejected ? [0] : []}
      />

      <ScrollView className="px-4 pb-40">
        {renderStatusSection()}

        {/* Timeline Komplain */}
        <TrackDispute
          title="Pengajuan komplain buyer"
          dateTime="16 Juni 2025, 10:00 WIB"
          details={[
            {
              content:
                "Buyer ingin mengembalikan barang. Dana rekber akan dikembalikan setelah komplain disetujui.",
            },
            { content: "Layar barang pecah di tengah, goresan di sisi kiri." },
            {
              imgTitle: "Bukti foto & video",
              images: [
                require("../../../assets/barangrusak.png"),
                require("../../../assets/barangrusak.png"),
              ],
            },
          ]}
        />
        <View className="h-2 bg-[#f5f5f5] mt-3" />

        {/* Data Transaksi */}
        <TextView
          title="Seller"
          content={detailComplaint?.transaction?.sellerEmail}
        />
        <TextView
          title="Nama Barang"
          content={detailComplaint?.transaction?.itemName}
        />
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
        <CopyField
          title="No Resi"
          content={
            detailComplaint?.transaction?.trackingNumber?.split("").join(" ") ||
            "-"
          }
        />
        <TextView
          title="Ekspedisi"
          content={detailComplaint?.transaction?.courier?.name || "-"}
        />
        <CopyField
          title="ID Transaksi"
          content={detailComplaint?.transaction?.transactionCode
            ?.split("")
            .join(" ")}
        />
        <CopyField
          title="Virtual Account"
          content={detailComplaint?.transaction?.virtualAccount
            ?.split("")
            .join(" ")}
        />

        {renderPrimaryButton()}
      </ScrollView>
    </SafeAreaView>
  );
}
