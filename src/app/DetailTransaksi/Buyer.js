import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftCircle, Play } from "lucide-react-native";
import Tagihan from "@/components/DetailRekber/Tagihan";
import Timestamp from "@/components/DetailRekber/Timestamp";
import ProgressBar from "@/components/ProgressBar";
import StepSuccesBar from "@/components/SuccesBar";
import CountdownTimer from "@/components/Countdown";
import PrimaryButton from "@/components/PrimaryButton";
import { getDetailBuyerTransaction } from "@/utils/api/buyer";
import moment from "moment";
import {
  updateBuyerTransaction,
  buyerConfirmReceivedTransaction,
} from "@/utils/api/buyer";
import { Alert } from "react-native";
import BuyerKonfirmasi from "@/components/BuyerKonfirmasi";
import { showToast } from "@/utils";
import NavBackHeader from "@/components/NavBackHeader";
import { Modalize } from "react-native-modalize";

export default function DetailTransaksiBuyer() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [data, setData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [paymentDone, setPaymentDone] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const modalizeRef = useRef(null);


  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const res = await getDetailBuyerTransaction(id);
        setData(res.data);
      } catch (err) {
        showToast(
          "Gagal",
          "Gagal mengambil data transaksi. Silahkan coba lagi.",
          "error"
        );
      }
    };

    fetchTransactionDetails();
  }, [id]);

  const updateTransaction = async () => {
    try {
      const res = await updateBuyerTransaction(data?.id);
      setPaymentDone(res.data);
      setIsPaymentDone(res.success);
    } catch (error) {
      showToast("Gagal", "Gagal memperbarui transaksi", "error");
    }
  };

  const handleConfirmReceived = async () => {
    try {
      const res = await buyerConfirmReceivedTransaction(data?.id);
      setShowPopup(false);
      router.replace("/buyer");
    } catch (error) {
      showToast("Gagal", "Gagal memperbarui transaksi", "error");
    }
  };

  const handleSimulatePayment = () => {
    // setModalVisible(true);
    modalizeRef.current?.open();
  };

  const closeModal = () => {
    router.back();
  };

  const formatDateWIB = (dateTime) => {
    if (!dateTime) return "Invalid date";
    return moment(dateTime).utcOffset(7).format("DD MMMM YYYY, HH:mm [WIB]");
  };

  const handleCopy = async (text) => {
    // belum bisa jalan toastnya
    if (!text) return;
    try {
      await Clipboard.setStringAsync(text);
      showToast("Berhasil", "Disalin ke clipboard", "success");
    } catch (error) {
      showToast("Gagal", "Tidak dapat menyalin", "error");
    }
  };

  const setupStatus = () => {
    if (data?.status == "pending_payment") {
      return "Menunggu Pembayaran";
    }
    if (data?.status == "waiting_shipment") {
      return "Menunggu Resi";
    }
    if (data?.status == "shipped") {
      return "Dalam Pengiriman";
    }
    if (data?.status == "completed") {
      return "Barang Diterima";
    }
    if (data?.status == "refunded") {
      return "Dikembalikan";
    }
    if (data?.status == "canceled") {
      return "Dibatalkan";
    }
  };

  const setupDetailTimestamp = () => {
    if (data?.status == "pending_payment") {
      return [
        {
          status: "Waktu bikin Rekbr",
          date: data?.createdAt || "-",
        },
      ];
    }
    if (data?.status == "waiting_shipment") {
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
    if (data?.status == "shipped") {
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
            status: "Waktu pembeli mengirimkan barang",
            date: data?.shipment?.shipmentDate || "-",
          },
          {
            status: "Waktu penjual meminta konfirmasi pembeli",
            date: data?.fundReleaseRequest.requestedAt || "-",
          },
          {
            status: "Waktu admin meneruskan permintaan konfirmasi pembeli",
            date: data?.fundReleaseRequest.resolvedAt || "-",
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
    if (data?.status == "completed") {
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
            status: "Waktu pembeli mengirimkan barang",
            date: data?.shipment?.shipmentDate || "-",
          },
          {
            status: "Waktu penjual meminta konfirmasi pembeli",
            date: data?.fundReleaseRequest.requestedAt || "-",
          },
          {
            status: "Waktu admin meneruskan permintaan konfirmasi pembeli",
            date: data?.fundReleaseRequest.resolvedAt || "-",
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
            status: "Waktu pembeli mengirimkan barang",
            date: data?.shipment?.shipmentDate || "-",
          },
        ];
      }
    }
    if (data?.status == "canceled") {
      if (data?.paidAt == null) {
        return [
          {
            status: "Waktu bikin Rekbr",
            date: data?.createdAt || "-",
          },
        ];
      }
      if (data?.paidAt != null) {
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
  };

  const setupCaptionTimeStamp = () => {
    if (data?.status == "pending_payment") {
      return "Pembeli transfer sebelum";
    }
    if (data?.status == "waiting_shipment") {
      return "Penjual kirim barang sebelum";
    }
    if (data?.status == "shipped") {
      if (data?.fundReleaseRequest?.status == "approved") {
        return "Mohon cek dan konfirmasi sebelum 1 x 24 jam";
      } else {
        return "Penjual sudah mengirimkan barang";
      }
    }
    if (data?.status == "completed") {
      return "Waktu konfirmasi pembeli diterima";
    }
    if (data?.status == "refunded") {
      return "Dikembalikan";
    }
    if (data?.status == "canceled") {
      return "Dibatalkan";
    }
  };

  const setupDateTimestamp = () => {
    if (data?.status == "pending_payment") {
      return data?.paymentDeadline || "-";
    }
    if (data?.status == "waiting_shipment") {
      return data?.shipmentDeadline || "-";
    }
    if (data?.status == "shipped") {
      if (data?.fundReleaseRequest?.status == "approved") {
        return data?.buyerConfirmDeadline || "-";
      } else {
        return data?.shipmentDeadline || "-";
      }
    }
    if (data?.status == "completed") {
      return data?.buyerConfirmedAt || "-";
    }
    if (data?.status == "canceled") {
      if (data?.paidAt == null) {
        return data?.createdAt || "-";
      }
      if (data?.paidAt != null) {
        return data?.paidAt || "-";
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const setupFooter = () => {
    if (data?.status == "pending_payment") {
      return (
        <View className="flex-col gap-4 w-full items-center">
          <PrimaryButton
            title="Cek Status Transaksi"
            onPress={handleSimulatePayment}
          // disabled={!isFormValid}
          />
          <View className="flex-row items-center px-3 gap-3">
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
    if (data?.status == "waiting_shipment") {
      return (
        <View className="flex-row items-center px-3 gap-3">
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
      );
    }
    if (data?.status == "shipped") {
      return (
        <View className="flex flex-row items-center gap-4">
          <PrimaryButton
            title="Komplain"
            onPress={() =>
              router.push({
                pathname: "/Complaint/Index",
                params: { transactionId: data?.id },
              })
            }
            height={50}
            width={"45%"}
            btnColor="#F9F9F9"
            textColor="#000"
          />
          <PrimaryButton
            title="Barang Diterima"
            onPress={() => setShowPopup(true)}
            // disabled={!isFormValid}
            height={50}
            width={"45%"}
          />
        </View>
      );
    }
    if (data?.status == "completed") {
      return (
        <PrimaryButton
          title="Berikan Ulasan"
          onPress={() => Alert.alert("Berikan Ulasan pressed")}
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
      const platformFee = itemPrice * 0.01;
      return `${platformFee} %`;
    } else if (itemPrice >= 5000000 && itemPrice <= 10000000) {
      const platformFee = itemPrice * 0.008;
      return `${platformFee} %`;
    }
    return 0;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <NavBackHeader title={"Detail Rekber Buyer"} />
      {(() => {
        const steps = ["Transfer", "Dikemas", "Dikirim", "Diterima"];
        let currentStep = 0;

        switch (data?.status) {
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
        {data?.status == "pending_payment" ||
          (data?.status == "waiting_shipment" &&
            data?.shipment?.trackingNumber != null) ||
          data?.status == "shipped" ||
          (data?.status == "completed" && (
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
                  {data?.status == "pending_payment"
                    ? "Virtual Account"
                    : "No Resi"}
                </Text>
                <View
                  className={`flex-row items-center ${data?.status == "waiting_shipment" ||
                    data?.status == "shipped" ||
                    data?.status == "completed"
                    ? "mb-3"
                    : ""
                    }`}>
                  <Text style={{ fontSize: 17, fontWeight: "500" }}>
                    {data?.status == "pending_payment"
                      ? data?.virtualAccount
                      : data?.shipment?.trackingNumber}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      handleCopy(
                        data?.status == "pending_payment"
                          ? data?.virtualAccount
                          : data?.shipment?.trackingNumber
                      )
                    }>
                    <Image
                      source={require("../../assets/copy.png")}
                      style={{ marginLeft: 4, width: 17, height: 16 }}
                    />
                  </TouchableOpacity>
                </View>
                {data?.status == "waiting_shipment" ||
                  data?.status == "shipped" ||
                  (data?.status == "completed" && (
                    <Text
                      style={{
                        fontSize: 12,
                        // marginBottom: 12,
                        fontWeight: "400",
                        color: "#616161",
                      }}>
                      {data?.shipment?.courier || "-"}
                    </Text>
                  ))}
              </View>
            </>
          ))}

        {/* Admin Message */}
        {data?.fundReleaseRequest?.status == "approved" ||
          (data?.status == "completed" && (
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
                  {data?.status == "completed"
                    ? "Komplain dianggap tidak ada dan bakal selesai otomatis kalau pembeli nggak respon."
                    : "Halo! Barang udah sampai. Cek dan konfirmasi, biar dana langsung ke penjual via BNI!"}
                </Text>
              </View>
            </>
          ))}

        {/* Warning Message */}
        {data?.status == "shipped" && (
          <View className="my-2">
            <View className="flex-row items-center bg-yellow-200 gap-2 px-4 py-3 w-full">
              <Image
                source={require("../../assets/icon-warning.png")}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-xs text-black font-medium flex-1">
                {data.status === "completed"
                  ? "Komplain dianggap tidak ada dan bakal selesai otomatis kalau pembeli nggak respon."
                  : "Biar aman, pastikan kamu videoin proses buka paket ya! Ini penting banget sebagai bukti kalau mau komplain nanti."}
              </Text>
            </View>
          </View>
        )}

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
          <Text className="text-[15px] font-medium">
            {data?.sellerEmail || "-"}
          </Text>
        </View>

        {/* Items Name Section */}
        <View className="flex-col justify-center gap-2 mx-3 p-3">
          <Text className="text-[15px]">Nama Barang</Text>
          <Text className="text-[15px] font-medium">
            {data?.itemName || "-"}
          </Text>
        </View>

        {/* Items Price Section */}
        <View className="flex-col justify-center gap-2 mx-3 p-3">
          {/* <Text className="text-[15px]">Harga Barang</Text>
          <Text className="text-[15px] font-medium">
            {formatPrice(data?.itemPrice)}
          </Text> */}
          <Tagihan
            caption="Harga Barang"
            price={formatPrice(data?.totalAmount)}
            details={[
              {
                status: "Nominal Barang",
                price: formatPrice(data?.itemPrice),
              },
              {
                status: "Asuransi Pengiriman BNI Life (0.2%)",
                price: formatPrice(data?.insuranceFee),
              },
              {
                status: `Biaya Jasa Aplikasi (${calculatePlatformFee(
                  data?.itemPrice
                )})`,
                price: formatPrice(data?.platformFee),
              },
            ]}
          />
        </View>

        {/* ID Transaction Section */}
        <View className="flex-col justify-center gap-2 mx-3 p-3">
          <Text className="text-[15px]">ID Transaksi</Text>
          <View className="flex-row items-center">
            <Text className="text-[15px] font-medium">
              {data?.transactionCode || "-"}
            </Text>
            <TouchableOpacity onPress={() => handleCopy(data?.transactionCode)}>
              <Image
                source={require("../../assets/copy.png")}
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
              {data?.virtualAccount || "-"}
            </Text>
            <TouchableOpacity onPress={() => handleCopy(data?.virtualAccount)}>
              <Image
                source={require("../../assets/copy.png")}
                style={{ marginLeft: 4, width: 17, height: 16 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Footer */}
      <View className="p-3 border-t-2 rounded-t-3xl border-x-2 border-gray-200 drop-shadow-xl items-center mb-6">
        {setupFooter()}
      </View>
      {/* Modal Simulate Payment*/}
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        handleStyle={{
          backgroundColor: "#ccc",
          width: 60,
          alignSelf: "center",
          top: 32,
        }}
        modalStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 24,
          paddingTop: 32,
          paddingBottom: 32,
          backgroundColor: "#fff",
        }}
      >
        <View
          className="bg-white pb-8">
          <Pressable onPress={closeModal} >
            <View className="flex-row items-center mb-6">
              <ChevronLeftCircle size={24} color="#00C2C2" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                {isPaymentDone ? "Uang Kamu Kami Terima" : "Mengecek..."}
              </Text>
            </View>
          </Pressable>

          <View className="bg-green-100 flex-row items-center justify-between rounded-xl p-3 mb-4">
            <Text className="text-base font-semibold text-gray-500">
              ID Transaksi
            </Text>
            <View className="flex-row items-center">
              <Text className="text-base font-semibold tracking-wider mt-1 ml-5">
                {data?.transactionCode || "-"}
              </Text>
              <TouchableOpacity
                onPress={() => handleCopy(data?.transactionCode)}>
                <Image
                  source={require("../../assets/copy.png")}
                  style={{ marginLeft: 4, width: 17, height: 16 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="items-center px-4">
            <StepSuccesBar
              currentStep={isPaymentDone ? 1 : 0}
              steps={["Mengecek", "Diterima"]}
            />
          </View>

          {!isPaymentDone ? (
            <>
              <Text className="text-center text-gray-600 mt-6 mb-3">
                Kamu sebaiknya transfer sebelum :
              </Text>
              <View className="items-center mb-3">
                <Text className="text-2xl font-bold bg-yellow-100 px-4 py-1 rounded-lg text-yellow-800">
                  <CountdownTimer
                    deadline={data?.paymentDeadline || "-"}
                    fromTime={data?.currentTimestamp || "-"}
                  />
                </Text>
              </View>
              <Text className="text-center text-gray-600 mb-5">
                {formatDateWIB(data?.paymentDeadline || "-")}
              </Text>

              <Pressable
                className="bg-gray-100 py-3 rounded-xl flex-row justify-center items-center mb-5"
                onPress={updateTransaction}>
                <Play size={20} color="#000" />
                <Text className="ml-2 font-semibold text-gray-800">
                  Simulate Payment
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text className="text-xl font-bold text-center mt-6 mb-1">
                Transaksi Berhasil Diproses
              </Text>
              <Text className="text-center text-gray-600 mb-5">
                {formatDateWIB(paymentDone?.paidAt || "-")}
              </Text>
              <View className="flex-row justify-center items-center mb-5">
                <View className="flex-row items-center justify-between w-full">
                  <Text className="text-lg font-medium ml-7">Pembeli</Text>
                  <View className="flex-row items-center gap-3">
                    <Image
                      source={require("../../assets/logo-bni.png")}
                      className="w-20 h-12"
                      style={{ objectFit: "cover" }}
                    />
                    <View className="flex-row items-center">
                      <Text className="text-lg font-medium tracking-wider">
                        0600604502
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleCopy("0600604502")}>
                        <Image
                          source={require("../../assets/copy.png")}
                          style={{ marginLeft: 4, width: 17, height: 16 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}

          <View className="flex-row justify-center items-center gap-5">
            <Text className="text-center text-gray-500">
              Terdapat kendala?
            </Text>
            <Text className="text-blue-500 font-medium">
              Silahkan Hubungi Kami
            </Text>
          </View>
        </View>
      </Modalize>

      <BuyerKonfirmasi
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        onBtn2={handleConfirmReceived}
        onBtn1={() => setShowPopup(false)}
        title="Pastikan semua data di form sudah benar dan lengkap sebelum kamu kirim. Cek lagi, ya!"
        btn1="Kembali"
        btn2="Konfirmasi"
      />

    </View>
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
