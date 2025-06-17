import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../ProgressBar";
import Timestamp from "./Timestamp";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import PrimaryButton from "../PrimaryButton";
import Tagihan from "./Tagihan";
import { useRouter } from "expo-router";
import { cancelTransaksiSeller } from "../../utils/api/seller";

export default function DetailTransaksiSeller({ data }) {
  const status = data?.status || "";
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCancelTransaksiSeller = async () => {
    try {
      const res = await cancelTransaksiSeller(data?.id);
      if (res) {
        console.log(res);
        Toast.show({
          type: "success",
          text1: "Berhasil",
          text2: "Transaksi berhasil dibatalkan",
          position: "top",
        });
        router.replace("/");
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: "Transaksi gagal dibatalkan",
        position: "top",
      });
    }
  };

  const handleCopy = async (text) => {
    // belum bisa jalan toastnya
    if (!text) return;
    try {
      await Clipboard.setStringAsync(text);
      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Disalin ke clipboard",
        position: "top",
      });
      console.log("Copied to clipboard:", text);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: "Tidak dapat menyalin",
        position: "top",
      });
      console.log("Failed to copy to clipboard:", error);
    }
  };

  const setupStatus = () => {
    if (status == "pending_payment") {
      return "Menunggu Pembayaran";
    }
    if (status == "waiting_shipment") {
      return "Masukkan Resi";
    }
    if (status == "shipped") {
      return "Dalam Pengiriman";
    }
    if (status == "completed") {
      return "Barang Diterima";
    }
    if (status == "refunded") {
      return "Dikembalikan";
    }
    if (status == "cancelled") {
      return "Dibatalkan";
    }
    if (status == "dispute") {
      return "Barang Terkendala";
    }
  };

  const setupDetailTimestamp = () => {
    if (status == "pending_payment") {
      return [
        {
          status: "Waktu bikin Rekbr",
          date: data?.createdAt || "-",
        },
      ];
    }
    if (status == "waiting_shipment") {
      return [
        {
          status: "Waktu bikin Rekbr",
          date: data?.createdAt || "-",
        },
        {
          status: "Waktu pembeli Bayar",
          date: data?.paidAt || "-",
        },
      ];
    }
    if (status == "shipped") {
      if (data?.fundReleaseRequest?.status == "approved") {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data?.createdAt || "-",
          },
          {
            status: "Waktu pembeli Bayar",
            date: data?.paidAt || "-",
          },
          {
            status: "Waktu penjual mengirimkan barang",
            date: data?.shipment.shipmentDate || "-",
          },
          {
            status: "Waktu penjual meminta konfirmasi pembeli",
            date: data?.fundReleaseRequest?.requestedAt || "-",
          },
          {
            status: "Waktu admin meneruskan permintaan konfirmasi pembeli",
            date: data?.fundReleaseRequest?.resolvedAt || "-",
          },
        ];
      } else {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data?.createdAt || "-",
          },
          {
            status: "Waktu pembeli Bayar",
            date: data?.paidAt || "-",
          },
        ];
      }
    }
    if (status == "completed") {
      if (data?.fundReleaseRequest?.status == "approved") {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data?.createdAt || "-",
          },
          {
            status: "Waktu pembeli Bayar",
            date: data?.paidAt || "-",
          },
          {
            status: "Waktu penjual mengirimkan barang",
            date: data?.shipment.shipmentDate || "-",
          },
          {
            status: "Waktu penjual meminta konfirmasi pembeli",
            date: data?.fundReleaseRequest?.requestedAt || "-",
          },
          {
            status: "Waktu admin meneruskan permintaan konfirmasi pembeli",
            date: data?.fundReleaseRequest?.resolvedAt || "-",
          },
        ];
      } else {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data?.createdAt || "-",
          },
          {
            status: "Waktu pembeli Bayar",
            date: data?.paidAt || "-",
          },
          {
            status: "Waktu penjual mengirimkan barang",
            date: data?.shipment.shipmentDate || "-",
          },
        ];
      }
    }
  };

  const setupCaptionTimeStamp = () => {
    if (status == "pending_payment") {
      return "Pembeli transfer sebelum";
    }
    if (status == "waiting_shipment") {
      return "Penjual masukkan resi dan bukti pengiriman sebelum";
    }
    if (status == "shipped") {
      if (data?.fundReleaseRequest?.status == "pending") {
        return "Penjual mengajukan permintaan konfirmasi penerimaan barang";
      } else if (data?.fundReleaseRequest?.status == "approved") {
        return "Penjual, tunggu respon pembeli 1 x 24 jam";
      } else if (data?.fundReleaseRequest?.status == "rejected") {
        return "Admin menolak permintaan konfirmasi penerimaan barang";
      } else {
        return "Penjual sudah mengirimkan barang";
      }
    }
    if (status == "completed") {
      return "Waktu konfirmasi pembeli diterima";
    }
    if (status == "refunded") {
      return "Dikembalikan";
    }
    if (status == "cancelled") {
      return "Dibatalkan";
    }
    if (status == "dispute") {
      return "Waktu konfirmasi buyer pengembalian";
    }
  };

  const setupDateTimestamp = () => {
    if (status == "pending_payment") {
      return data?.paymentDeadline || "-";
    }
    if (status == "waiting_shipment") {
      return data?.shipmentDeadline || "-";
    }
    if (status == "shipped") {
      if (data?.fundReleaseRequest?.status == "pending") {
        return data?.fundReleaseRequest?.requestedAt || "-";
      } else if (data?.fundReleaseRequest?.status == "approved") {
        return data?.fundReleaseRequest?.resolvedAt || "-";
      } else if (data?.fundReleaseRequest?.status == "rejected") {
        return data?.fundReleaseRequest?.resolvedAt || "-";
      } else {
        return data?.shipment.shipmentDate || "-";
      }
    }
    if (status == "completed") {
      return data?.buyerConfirmedAt || "-";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const setupFooter = () => {
    if (status == "pending_payment") {
      return (
        <View className="flex-col gap-4 w-full items-center">
          <PrimaryButton
            title="Batalkan Rekbr"
            onPress={handleCancelTransaksiSeller}
            // disabled={!isFormValid}
            btnColor="#FEF0E9"
            textColor="#000"
          />
          <View className="flex-row w-9/12 items-center justify-between px-3">
            <Text className="text-sm items-start justify-start text-[#616161]">
              Terdapat kendala?
            </Text>
            <TouchableOpacity
              onPress={() => console.log("Hubungi Kami pressed")}>
              <Text className="text-sm items-end justify-end text-[#3267E3]">
                Silahkan Hubungi Kami
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    if (status == "waiting_shipment") {
      return (
        <View className="flex-col gap-4 w-full items-center">
          <View className="flex flex-row items-center gap-4">
            <PrimaryButton
              title="Batalkan Rekbr"
              onPress={handleCancelTransaksiSeller}
              // disabled={!isFormValid}
              height={50}
              width={"45%"}
              btnColor="#FEF0E9"
              textColor="#000"
            />
            <PrimaryButton
              title="Masukkan Resi"
              onPress={() =>
                router.push({
                  pathname: "/InputResi",
                  params: { id: data?.id },
                })
              }
              height={50}
              width={"45%"}
            />
          </View>
          <View className="flex-row w-9/12 items-center justify-between px-3">
            <Text className="text-sm items-start justify-start text-[#616161]">
              Terdapat kendala?
            </Text>
            <TouchableOpacity
              onPress={() => console.log("Hubungi Kami pressed")}>
              <Text className="text-sm items-end justify-end text-[#3267E3]">
                Silahkan Hubungi Kami
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    if (status == "shipped") {
      return (
        <PrimaryButton
          title="Kirim Permintaan Konfirmasi"
          onPress={() =>
            router.push({
              pathname: "/FundReleaseRequest",
              params: { id: data?.id },
            })
          }
          disabled={
            data?.fundReleaseRequest?.status == "approved" ||
            data?.fundReleaseRequest?.status == "pending"
          }
        />
      );
    }
    if (status == "completed") {
      return (
        <PrimaryButton
          title="Berikan Ulasan"
          onPress={() => console.log("Berikan Ulasan pressed")}
          // disabled={true}
          btnColor="#F9F9F9"
          textColor="#000"
        />
      );
    }
  };

  const calculatePlatformFee = (itemPrice) => {
    if (itemPrice >= 10000 && itemPrice <= 499999.99) {
      return 5000;
    } else if (itemPrice >= 500000 && itemPrice <= 4999999.99) {
      return 100 * 0.01; // 1%
    } else if (itemPrice >= 5000000 && itemPrice <= 10000000) {
      return 100 * 0.008; // 0.8%
    }
    return 0;
  };

  const setupStatusFundReleaseRequest = () => {
    if (data?.fundReleaseRequest?.status == "pending") {
      return "Permintaan Ditinjau";
    }
    if (data?.fundReleaseRequest?.status == "rejected") {
      return "Permintaan Ditolak";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Transaksi</Text>
        <View style={{ width: 24 }} />
      </View>
      {(() => {
        const steps = ["Transfer", "Dikemas", "Dikirim", "Diterima"];
        let currentStep = 0;

        switch (status) {
          case "pending_payment":
            currentStep = 0;
            break;
          case "waiting_shipment":
            currentStep = 1;
            break;
          case "shipped":
            currentStep = 2;
            break;
          case "completed":
            currentStep = 3;
            break;
        }

        return <ProgressBar currentStep={currentStep} steps={steps} />;
      })()}
      <ScrollView>
        {status == "pending_payment" ||
        (status == "waiting_shipment" &&
          data?.shipment?.trackingNumber != null) ||
        status == "shipped" ||
        status == "completed" ? (
          <>
            {/* Copas Field */}
            <View
              style={{
                padding: 12,
                marginHorizontal: 12,
                backgroundColor: "#EDFBFA",
                borderRadius: 12,
              }}>
              <Text
                style={{ fontSize: 15, marginBottom: 12, fontWeight: "500" }}>
                {status == "pending_payment" ? "Virtual Account" : "No Resi"}
              </Text>
              <View
                className={`flex-row items-center ${
                  status == "waiting_shipment" ||
                  status == "shipped" ||
                  status == "completed"
                    ? "mb-3"
                    : ""
                }`}>
                <Text style={{ fontSize: 17, fontWeight: "500" }}>
                  {status == "pending_payment"
                    ? data?.virtualAccount || "-"
                    : data?.shipment?.trackingNumber || "-"}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    handleCopy(
                      status == "pending_payment"
                        ? data?.virtualAccount || "-"
                        : data?.shipment?.trackingNumber || "-"
                    )
                  }>
                  <Image
                    source={require("../../assets/copy.png")}
                    style={{ marginLeft: 4, width: 17, height: 16 }}
                  />
                </TouchableOpacity>
              </View>
              {status == "waiting_shipment" ||
              status == "shipped" ||
              status == "completed" ? (
                <Text
                  style={{
                    fontSize: 12,
                    // marginBottom: 12,
                    fontWeight: "400",
                    color: "#616161",
                  }}>
                  {data?.shipment?.courier || "-"}
                </Text>
              ) : null}
            </View>
          </>
        ) : null}

        {/* Admin Message (done)*/}
        {data?.fundReleaseRequest?.status != null || status == "completed" ? (
          <>
            <View className="flex-row mx-3 p-3 justify-between items-center gap-3">
              <Image
                source={require("../../assets/admin1.png")}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
              <Text className="text-sm flex-1">
                {status == "completed"
                  ? "Komplain dianggap tidak ada dan bakal selesai otomatis kalau pembeli nggak respon."
                  : data?.fundReleaseRequest?.status == "pending"
                  ? "Tunggu approval kami, ya! Kalau bukti kamu oke, permintaan konfirmasi bakal langsung dikirim ke buyer!"
                  : data?.fundReleaseRequest?.status == "approved"
                  ? "Konfirmasi udah dikirim ke buyer! Sekarang tinggal tunggu respon mereka dalam 1 x 24 jam"
                  : "Permintaan konfirmasi ke buyer ditolak. Pastikan data atau bukti yang kamu kirim sudah lengkap dan sesuai"}
              </Text>
            </View>
          </>
        ) : null}

        {/* Status Rekbr (done)*/}
        {data?.fundReleaseRequest?.status == "pending" ||
        data?.fundReleaseRequest?.status == "rejected" ? (
          <View className="flex-col  gap-2 mx-3 p-3">
            <View className="flex-row justify-between">
              <Text className="text-[15px]">Status Rekbr:</Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-[15px] font-medium">{setupStatus()}</Text>
                <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* <View className="flex-col"> */}
            {isExpanded ? (
              <View
                style={{
                  backgroundColor: "#fff",
                  paddingLeft: 8,
                  paddingVertical: 8,
                  borderLeftColor: "#F5F5F5",
                  borderLeftWidth: 4,
                  marginHorizontal: 4,
                }}
                className="flex-row justify-between">
                <Text
                  style={{ fontSize: 14, fontWeight: "400", color: "#616161" }}>
                  Status Pengajuan:
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "500",
                    color:
                      data?.fundReleaseRequest?.status == "pending"
                        ? "#FBBF24"
                        : "#CB3A31",
                  }}>
                  {setupStatusFundReleaseRequest()}
                </Text>
                {/* </View> */}
              </View>
            ) : null}
          </View>
        ) : (
          <>
            <View className="flex-row justify-between gap-2 mx-3 p-3">
              <Text className="text-[15px]">Status Rekbr:</Text>
              <Text className="text-[15px] font-medium">{setupStatus()}</Text>
            </View>
          </>
        )}

        {/* Timestamp (done)*/}
        <View className="mx-3 p-3">
          <Timestamp
            data={data}
            caption={setupCaptionTimeStamp()}
            date={setupDateTimestamp()}
            details={setupDetailTimestamp()}
          />
        </View>

        {/* Buyer Section (done)*/}
        <View className="flex-col justify-center gap-2 mx-3 p-3">
          <Text className="text-[15px]">Pembeli</Text>
          <Text className="text-[15px] font-medium">
            {data?.buyerEmail || "-"}
          </Text>
        </View>

        {/* Virtual Account Section (done)*/}
        <View className="flex-col justify-center gap-2 mx-3 p-3">
          <Text className="text-[15px]">Virtual Account</Text>
          <View className="flex-row items-center">
            <Text className="text-[15px] font-medium">
              {data?.virtualAccount || "-"}
            </Text>
            <TouchableOpacity
              onPress={() => handleCopy(data?.virtualAccount || "-")}>
              <Image
                source={require("../../assets/copy.png")}
                style={{ marginLeft: 4, width: 17, height: 16 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Items Name Section (done)*/}
        <View className="flex-col justify-center gap-2 mx-3 p-3">
          <Text className="text-[15px]">Nama Barang</Text>
          <Text className="text-[15px] font-medium">
            {data?.itemName || "-"}
          </Text>
        </View>

        {/* Items Price Section (done)*/}
        <View className="flex-col justify-center gap-2 mx-3 p-3">
          {/* <Text className="text-[15px]">Harga Barang</Text>
          <Text className="text-[15px] font-medium">
            {formatPrice(data?.itemPrice)}
          </Text> */}
          <Tagihan
            caption="Harga Barang"
            price={formatPrice(data?.itemPrice || "-")}
            details={[
              {
                status: "Nominal Barang",
                price: formatPrice(data?.itemPrice || "-"),
              },
              {
                status: "Asuransi Pengiriman BNI Life (0.2%)",
                price: formatPrice(data?.insuranceFee || "-"),
              },
              {
                status: `Biaya Jasa Aplikasi (${calculatePlatformFee(
                  data?.itemPrice
                )}%)`,
                price: formatPrice(data?.platformFee || "-"),
              },
            ]}
          />
        </View>

        {/* Seller Bank Section (done)*/}
        <View className="flex-col justify-center gap-2 mx-3 p-3">
          <Text className="text-[15px]">Rekening Penjual</Text>
          <View className="flex-row gap-5">
            <Image
              source={{ uri: data?.rekeningSeller?.logoUrl || "-" }}
              style={{ width: 50, height: 50, objectFit: "contain" }}
            />
            <View className="flex-row items-center">
              <Text className="text-[15px] font-medium">
                {data?.rekeningSeller?.accountNumber || "-"}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  handleCopy(data?.rekeningSeller?.accountNumber || "-")
                }>
                <Image
                  source={require("../../assets/copy.png")}
                  style={{ marginLeft: 4, width: 17, height: 16 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Transaction ID Section (done)*/}
        <View className="flex-col justify-center gap-2 mx-3 p-3">
          <Text className="text-[15px]">ID Transaksi</Text>
          <View className="flex-row items-center">
            <Text className="text-[15px] font-medium">
              {data?.transactionCode}
            </Text>
            <TouchableOpacity
              onPress={() => handleCopy(data?.transactionCode || "-")}>
              <Image
                source={require("../../assets/copy.png")}
                style={{ marginLeft: 4, width: 17, height: 16 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Footer (done)*/}
      <View className="p-3 border-t-2 rounded-t-3xl border-x-2 border-gray-200 drop-shadow-xl items-center">
        {setupFooter()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backArrow: {
    fontSize: 24,
    color: "#000",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
