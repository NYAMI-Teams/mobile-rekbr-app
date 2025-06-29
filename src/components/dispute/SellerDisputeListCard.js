import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { ClipboardPaste } from "lucide-react-native";
import PrimaryButton from "../PrimaryButton";

const statusconfig = {
  waitingSellerApproval: {
    color: "#FBBF24",
    text: "Persetujuan Seller",
    note: "Jika kamu nggak respon sampai ",
    noteafter: " pengajuan ini bakal otomatis disetujui, ya!",
    statusColor: "#FEF2D3",
  },
  returnRequested: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Buyer akan mengembalikan barang dalam 24 jam, konfirmasi bila barang telah sampai dan diterima.",
    notebold: null,
    button: null,
  },
  Completed: {
    color: "#06B217",
    text: "Tranasksi Selesai",
    note: "",
    status: "22 Juni 2025, 10 : 00 WIB",
  },
  sellerRejected: {
    color: "#CB3A31",
    text: "Menunggu Persetujuan Admin",
    note: "",
    button: null,
  },
  returnInTransit: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Konfirmasi bila barang telah sampai dan diterima ya!",
    button: null,
  },
  awaitingAdminApproval: {
    color: "#CB3A31",
    text: "Menunggu Persetujuan Admin",
    note: "",
    button: null,
  },
  rejectedByAdmin: {
    color: "#06B217",
    text: "Transaksi Selesai",
    note: "Setelah ditinjau, bukti belum cukup kuat. Dana diteruskan ke seller dan transaksi dianggap selesai.",
    button: null,
  },
  awaitingSellerConfirmation: {},
  approvedBySeller: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali!",
    notebold: " Proses maksimal 1 x 24 jam.",
    button: "Bukti Pengembalian",
  },
  approvedByAdmin: {
    color: "#FBBF24",
    text: "Pengembalian Barang",
    note: "Halo! Barang sudah sampai. Konfirmasi dalam 24 jam, kalau nggak, dana otomatis dikembalikan ke buyer. ",
    status: "23 : 59 : 59",
    statusColor: "#FEF2D3",
  },

  // Buyer Hilang Barang
  underInvestigation: {
    color: "#FBBF24",
    text: "Investigasi Pengiriman",
    note: "Hey, kami lagi cek pengiriman barang kamu di ekspedisi, nih. Kita bakal nilai kesalahan ini dan cari solusi terbaik!",
    button: null,
  },

  canceledByBuyer: {
    color: "#CB3A31",
    text: "Komplain Dibatalkan",
    note: "Komplain dibatalkan oleh buyer dan riwayat komplain hanya tersedia untuk buyer",
    button: null,
  },

  // Seller
  awaitingSellerConfirmation: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Buyer akan mengembalikan barang dalam 24 jam, konfirmasi bila barang telah sampai dan diterima.",
    button: "Barang Diterima",
  },

  awaitingAdminConfirmation: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Tunggu approval kami, ya! Kalau bukti kamu oke, permintaan konfirmasi bakal langsung dikirim ke seller!",
    button: "Permintaan Ditinjau",
    btnColor: "#FEF2D3",
    btnTextColor: "black",
  },
};

const SellerDisputeListCard = ({
  namaBarang,
  harga,
  buyer,
  noResi,
  expedisi,
  typeDespute,
  status,
  time,
  onPress = () => { },
  onPressButton = () => { },
}) => {
  const config = statusconfig[status];

  return (
    <TouchableOpacity onPress={onPress} >
      <View style={styles.cardWrapper}>
        <View style={styles.cardContent}>
          {/* Nama Barang & Harga */}
          <View style={styles.rowBetweenCenter}>
            <Text style={styles.productName}>{namaBarang}</Text>
            <Text style={styles.productName}>{harga}</Text>
          </View>

          {/* Seller */}
          <View style={styles.rowBetween}>
            <Text style={styles.labelGray}>Buyer</Text>
            <Text style={styles.labelBlack}>{buyer}</Text>
          </View>

          {/* No Resi */}
          <View style={styles.rowBetweenCenter}>
            <Text style={styles.labelGray}>No Resi</Text>
            <View style={styles.rowIcon}>
              <ClipboardPaste size={14} color="#9CA3AF" />
              <Text style={styles.resiText}>{noResi}</Text>
            </View>
          </View>

          {/* Ekspedisi */}
          <View style={styles.rowBetweenMargin}>
            <Text style={styles.labelGray}>Ekspedisi</Text>
            <Text style={styles.labelBlack}>{expedisi}</Text>
          </View>
        </View>


        {/* Status Card */}
        <View style={styles.cardFooter}>
          <View style={styles.statusRow}>
            <Image
              source={require("../../assets/barangrusak.png")}
              style={styles.statusIcon}
              resizeMode="contain"
            />
            <Text style={styles.statusType}>{typeDespute}</Text>
          </View>

          {/* Catatan Admin */}
          {config?.note !== "" && (
            <View style={styles.adminNoteRow}>
              <Image
                source={require("../../assets/admin1.png")}
                style={styles.adminNoteIcon}
              />
              <Text style={styles.adminNoteText}>
                <Text style={styles.adminNoteTextBold}>{config?.note}</Text>
                <Text style={[styles.adminNoteTextBold, { fontWeight: 600 }]}>{time}</Text>
                <Text style={styles.adminNoteTextBold}> {config?.noteafter}</Text>
              </Text>
            </View>
          )}

          <View style={styles.statusBottomRow}>
            <View style={styles.statusDotRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: config?.color },
                ]}
              />
              <Text style={styles.statusText}>{config?.text}</Text>
            </View>

            {/* Optional Button */}
            {config?.button && (
              <PrimaryButton
                title={config?.button}
                height={30}
                width="50%"
                fontSize={10}
                btnColor={config?.btnColor}
                textColor={config?.btnTextColor}
                onPress={onPressButton}
              />
            )}

            {config?.status && (
              <View
                style={[
                  styles.statusTimeBox,
                  { backgroundColor: config?.statusColor },
                ]}
              >
                <Text style={styles.statusTimeText}>{time}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginVertical: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
    width: "100%",
  },
  cardContent: {
    padding: 12,
  },
  rowBetweenCenter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rowBetweenMargin: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D1D1D",
  },
  labelGray: {
    fontSize: 12,
    color: "#6B7280",
  },
  labelBlack: {
    fontSize: 12,
    color: "#1D1D1D",
  },
  rowIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  resiText: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "500",
    marginLeft: 4,
  },
  cardFooter: {
    backgroundColor: "#f3f4f6",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 12,
    gap: 12
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusIcon: {
    width: 16,
    height: 16,
  },
  statusType: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
  },
  adminNoteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  adminNoteIcon: {
    width: 20,
    height: 20,
    marginTop: 2,
  },
  adminNoteText: {
    flex: 1,
    fontSize: 12,
    color: "#374151",
    lineHeight: 18,
  },
  adminNoteTextBold: {
    fontSize: 12,
    color: "#000",
  },
  statusBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusDotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#000",
  },
  statusTimeBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    borderRadius: 8,
  },
  statusTimeText: {
    fontSize: 12,
    color: "#000",
  },
});

export default SellerDisputeListCard;
