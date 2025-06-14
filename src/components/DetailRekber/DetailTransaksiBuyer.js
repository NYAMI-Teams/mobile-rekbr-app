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

export default function DetailTransaksiBuyer({ data }) {
  const handleCopy = async (text) => {
    // belum bisa jalan toastnya
    if (!text) return;
    try {
      await Clipboard.setStringAsync(text);
      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Disalin ke clipboard",
        position: "bottom",
      });
      console.log("Copied to clipboard:", text);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: "Tidak dapat menyalin",
        position: "bottom",
      });
      console.log("Failed to copy to clipboard:", error);
    }
  };

  const setupStatus = () => {
    if (data.status == "pending_payment") {
      return "Menunggu Pembayaran";
    }
    if (data.status == "waiting_shipment") {
      return "Menunggu Resi";
    }
    if (data.status == "shipped") {
      return "Dalam Pengiriman";
    }
    if (data.status == "completed") {
      return "Barang Diterima";
    }
    if (data.status == "refunded") {
      return "Dikembalikan";
    }
    if (data.status == "cancelled") {
      return "Dibatalkan";
    }
    if (data.status == "dispute") {
      return "Barang Terkendala";
    }
  };

  const setupDetailTimestamp = () => {
    if (data.status == "pending_payment") {
      return [
        {
          status: "Waktu bikin Rekbr",
          date: data.createdAt,
        },
      ];
    }
    if (data.status == "waiting_shipment") {
      return [
        {
          status: "Waktu bikin Rekbr",
          date: data.createdAt,
        },
        {
          status: "Waktu pembeli Bayar",
          date: data.paidAt,
        },
      ];
    }
    if (data.status == "shipped") {
      if (data.fundReleaseRequest.status == "approved") {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data.createdAt,
          },
          {
            status: "Waktu pembeli Bayar",
            date: data.paidAt,
          },
          {
            status: "Waktu pembeli mengirimkan barang",
            date: data.shipmentDate,
          },
          {
            status: "Waktu penjual meminta konfirmasi pembeli",
            date: data.fundReleaseRequest.requestedAt,
          },
          {
            status: "Waktu admin meneruskan permintaan konfirmasi pembeli",
            date: data.fundReleaseRequest.resolvedAt,
          },
        ];
      } else {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data.createdAt,
          },
          {
            status: "Waktu pembeli Bayar",
            date: data.paidAt,
          },
        ];
      }
    }
    if (data.status == "completed") {
      if (data.fundReleaseRequest.status == "approved") {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data.createdAt,
          },
          {
            status: "Waktu pembeli Bayar",
            date: data.paidAt,
          },
          {
            status: "Waktu pembeli mengirimkan barang",
            date: data.shipmentDate,
          },
          {
            status: "Waktu penjual meminta konfirmasi pembeli",
            date: data.fundReleaseRequest.requestedAt,
          },
          {
            status: "Waktu admin meneruskan permintaan konfirmasi pembeli",
            date: data.fundReleaseRequest.resolvedAt,
          },
        ];
      } else {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data.createdAt,
          },
          {
            status: "Waktu pembeli Bayar",
            date: data.paidAt,
          },
          {
            status: "Waktu pembeli mengirimkan barang",
            date: data.shipmentDate,
          },
        ];
      }
    }
  };

  const setupCaptionTimeStamp = () => {
    if (data.status == "pending_payment") {
      return "Pembeli transfer sebelum";
    }
    if (data.status == "waiting_shipment") {
      return "Penjual kirim barang sebelum";
    }
    if (data.status == "shipped") {
      if (data.fundReleaseRequest.status == "approved") {
        return "Mohon cek dan konfirmasi sebelum 1 x 24 jam";
      } else {
        return "Penjual sudah mengirimkan barang";
      }
    }
    if (data.status == "completed") {
      return "Waktu konfirmasi pembeli diterima";
    }
    if (data.status == "refunded") {
      return "Dikembalikan";
    }
    if (data.status == "cancelled") {
      return "Dibatalkan";
    }
    if (data.status == "dispute") {
      return "Waktu konfirmasi buyer pengembalian";
    }
  };

  const setupDateTimestamp = () => {
    if (data.status == "pending_payment") {
      return data.paymentDeadline;
    }
    if (data.status == "waiting_shipment") {
      return data.shipmentDeadline;
    }
    if (data.status == "shipped") {
      if (data.fundReleaseRequest.status == "approved") {
        return data.buyerConfirmDeadline;
      } else {
        return data.shipmentDate;
      }
    }
    if (data.status == "completed") {
      return data.buyerConfirmedAt;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const setupFooter = () => {
    if (data.status == "pending_payment") {
      return (
        <View className="flex-col gap-4 w-full items-center">
          <PrimaryButton
            title="Cek Status Transaksi"
            onPress={() => console.log("Cek Status Transaksi pressed")}
            // disabled={!isFormValid}
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
    if (data.status == "waiting_shipment") {
      return (
        <View className="flex-row w-9/12 items-center justify-between px-3">
          <Text className="text-sm items-start justify-start text-[#616161]">
            Terdapat kendala?
          </Text>
          <TouchableOpacity onPress={() => console.log("Hubungi Kami pressed")}>
            <Text className="text-sm items-end justify-end text-[#3267E3]">
              Silahkan Hubungi Kami
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (data.status == "shipped") {
      return (
        <View className="flex flex-row items-center gap-4">
          <PrimaryButton
            title="Komplain"
            onPress={() => console.log("Komplain pressed")}
            // disabled={!isFormValid}
            height={50}
            width={"45%"}
            btnColor="#F9F9F9"
            textColor="#000"
          />
          <PrimaryButton
            title="Barang Diterima"
            onPress={() => console.log("Barang Diterima pressed")}
            // disabled={!isFormValid}
            height={50}
            width={"45%"}
          />
        </View>
      );
    }
    if (data.status == "completed") {
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log("Back pressed")}>
          <Ionicons name="chevron-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Transaksi</Text>
        <View style={{ width: 24 }} />
      </View>
      {(() => {
        const steps = ["Transfer", "Dikemas", "Dikirim", "Diterima"];
        let currentStep = 0;

        switch (data.status) {
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
        {data.status == "pending_payment" ||
        (data.status == "waiting_shipment" &&
          data.shipment.trackingNumber != null) ||
        data.status == "shipped" ||
        data.status == "completed" ? (
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
                {data.status == "pending_payment"
                  ? "Virtual Account"
                  : "No Resi"}
              </Text>
              <View
                className={`flex-row items-center ${
                  data.status == "waiting_shipment" ||
                  data.status == "shipped" ||
                  data.status == "completed"
                    ? "mb-3"
                    : ""
                }`}>
                <Text style={{ fontSize: 17, fontWeight: "500" }}>
                  {data.status == "pending_payment"
                    ? data.virtualAccount
                    : data.shipment.trackingNumber}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    handleCopy(
                      data.status == "pending_payment"
                        ? data.virtualAccount
                        : data.shipment.trackingNumber
                    )
                  }>
                  <Image
                    source={require("../../../assets/copy.png")}
                    style={{ marginLeft: 4, width: 17, height: 16 }}
                  />
                </TouchableOpacity>
              </View>
              {data.status == "waiting_shipment" ||
              data.status == "shipped" ||
              data.status == "completed" ? (
                <Text
                  style={{
                    fontSize: 12,
                    // marginBottom: 12,
                    fontWeight: "400",
                    color: "#616161",
                  }}>
                  {data.shipment.courier}
                </Text>
              ) : null}
            </View>
          </>
        ) : null}

        {/* Admin Message */}
        {data.fundReleaseRequest.status == "approved" ||
        data.status == "completed" ? (
          <>
            <View className="flex-row mx-3 p-3 justify-between items-center gap-3">
              <Image
                source={require("../../../assets/admin1.png")}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
              <Text className="text-sm flex-1">
                {data.status == "completed"
                  ? "Komplain dianggap tidak ada dan bakal selesai otomatis kalau pembeli nggak respon."
                  : "Halo! Barang udah sampai. Cek dan konfirmasi, biar dana langsung ke penjual via BNI!"}
              </Text>
            </View>
          </>
        ) : null}

        {/* Status Rekbr */}
        <View className="flex-row justify-between gap-2 mx-3 p-3">
          <Text className="text-[15px]">Status Rekbr:</Text>
          <Text className="text-[15px] font-medium">{setupStatus()}</Text>
        </View>

        {/* Timestamp */}
        <View className="mx-3 p-3">
          <Timestamp
            data={data}
            caption={setupCaptionTimeStamp()}
            date={setupDateTimestamp()}
            details={setupDetailTimestamp()}
          />
        </View>

        {/* Seller Section */}
        <View className="flex-col justify-center gap-2 mx-3 p-3">
          <Text className="text-[15px]">Penjual</Text>
          <Text className="text-[15px] font-medium">{data.sellerEmail}</Text>
        </View>

        {/* Items Name Section */}
        <View className="flex-col justify-center gap-2 mx-3 p-3">
          <Text className="text-[15px]">Nama Barang</Text>
          <Text className="text-[15px] font-medium">{data.itemName}</Text>
        </View>

        {/* Items Price Section */}
        <View className="flex-col justify-center gap-2 mx-3 p-3">
          {/* <Text className="text-[15px]">Harga Barang</Text>
          <Text className="text-[15px] font-medium">
            {formatPrice(data.itemPrice)}
          </Text> */}
          <Tagihan
            caption="Harga Barang"
            price={formatPrice(data.itemPrice)}
            details={[
              {
                status: "Nominal Barang",
                price: formatPrice(data.itemPrice),
              },
              {
                status: "Asuransi Pengiriman BNI Life (0.2%)",
                price: formatPrice(data.insuranceFee),
              },
              {
                status: `Biaya Jasa Aplikasi (${calculatePlatformFee(
                  data.itemPrice
                )}%)`,
                price: formatPrice(data.platformFee),
              },
            ]}
          />
        </View>

        {/* ID Transaction Section */}
        <View className="flex-col justify-center gap-2 mx-3 p-3">
          <Text className="text-[15px]">ID Transaksi</Text>
          <View className="flex-row items-center">
            <Text className="text-[15px] font-medium">
              {data.transactionCode}
            </Text>
            <TouchableOpacity onPress={() => handleCopy(data.transactionCode)}>
              <Image
                source={require("../../../assets/copy.png")}
                style={{ marginLeft: 4, width: 17, height: 16 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Virtual Account Section */}
        <View className="flex-col justify-center gap-2 mx-3 p-3">
          <Text className="text-[15px]">Virtual Account</Text>
          <View className="flex-row items-center">
            <Text className="text-[15px] font-medium">
              {data.virtualAccount}
            </Text>
            <TouchableOpacity onPress={() => handleCopy(data.virtualAccount)}>
              <Image
                source={require("../../../assets/copy.png")}
                style={{ marginLeft: 4, width: 17, height: 16 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Footer */}{" "}
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
