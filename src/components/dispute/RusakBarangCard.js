import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { ClipboardPaste } from "lucide-react-native";
import PrimaryButton from "../PrimaryButton";
import moment from "moment";

const statusconfig = {
  waitingSellerApproval: {
    color: "#FBBF24",
    text: "Persetujuan Seller",
    note: "Jika seller nggak respon sampai ",
    notebold: " 18 Juni 2025, 10 : 00 WIB,",
    noteafter: " pengajuanmu bakal otomatis disetujui ya!",
    status: "18 Juni 2025, 10 : 00 WIB",
    statusColor: "#FEF2D3",
  },
  returnRequested: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali!",
    notebold: " Proses maksimal 1 x 24 jam.",
    button: "Bukti Pengembalian",
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
    note: "Cek no resi berkala, kalau seller nggak konfirmasi, minta konfirmasi seller lewat admin.",
    button: "Minta Konfirmasi",
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
  awaitingSellerConfirmation: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Buyer akan mengembalikan barang dalam 24 jam, konfirmasi bila barang telah sampai dan diterima.",
    button: null,
  },
  awaitingAdminConfirmation: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Tunggu approval kami, ya! Kalau bukti kamu oke, permintaan konfirmasi bakal langsung dikirim ke seller!",
    button: "Permintaan Ditinjau",
    btnColor: "#FEF2D3",
    btnTextColor: "black",
  },
  approvedBySeller: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali!",
    notebold: " Proses maksimal 1 x 24 jam.",
    button: "Bukti Pengembalian",
  },
  approvedByAdmin: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Kembalikan dengan baik, kemasan aman, dan berikan bukti pengiriman kembali!",
    notebold: " Proses maksimal 1 x 24 jam.",
    button: "Bukti Pengembalian",
  },
  canceledByBuyer: {
    color: "#CB3A31",
    text: "Komplain Dibatalkan",
    note: "",
    button: null,
  },

  // Buyer Hilang Barang
  underInvestigation: {
    color: "#FBBF24",
    text: "Investigasi Pengiriman",
    note: "Hey, kami lagi cek pengiriman barang kamu di ekspedisi, nih. Kita bakal nilai kesalahan ini dan cari solusi terbaik!",
    button: null,
  },

  disputeCancel: {
    color: "#C2C2C2",
    text: "Komplain Dibatalkan",
    note: "",
  },
  disputeProved: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian Barang",
    note: "Seller nggak kasih kabar, jadi sekarang giliran kamu buat lanjut prosesnya. Ayo upload bukti pengembalian barang!",
  },
  waitingAdmin: {
    color: "#CB3A31",
    text: "Menunggu Persetujuan Admin",
    note: "",
    button: null,
  },
  adminReject: {
    color: "#06B217",
    text: "Transaksi Selesai",
    note: "Setelah ditinjau, bukti belum cukup kuat. Dana diteruskan ke seller dan transaksi dianggap selesai.",
    button: null,
  },

  buyerLate: {
    color: "#06B217",
    text: "Transaksi Selesai",
    note: "Karena pengembalian barang",
    notebold: " sudah lewat 1 x 24 jam",
    noteafter: ", komplain dianggap selesai dan tidak bisa diproses lagi.",
    button: "Silakan Hubungi Kami",
  },
  buyerResi: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Cek no resi berkala, kalau seller nggak konfirmasi, minta konfirmasi seller lewat admin. ",
    button: "Minta Konfirmasi",
  },
  requestSeller: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Tunggu approval kami, ya! Kalau bukti kamu oke, permintaan konfirmasi bakal langsung dikirim ke seller!",
    button: "Permintaan Ditinjau",
    btnColor: "#FEF2D3",
    btnTextColor: "black",
  },
  waitSeller: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Konfirmasi udah dikirim ke seller! Sekarang tinggal tunggu respon mereka dalam 1 x 24 jam.",
    status: "23 : 59 : 59",
    statusColor: "#FEF2D3",
  },
  requestRejected: {
    color: "#FBBF24",
    text: "Menunggu Pengembalian",
    note: "Pengajuan ditolak karena bukti yang diajukan tidak valid. Silakan hubungi kami untuk klarifikasi lebih lanjut.",
    button: "Permintaan Ditolak",
    btnColor: "#F5D8D6",
    btnTextColor: "black",
  },
  requestApprove: {
    color: "#06B217",
    text: "Tranasksi Selesai",
    note: "",
    status: "22 Juni 2025, 10 : 00 WIB",
  },
};

const RusakBarangCard = ({
  namaBarang,
  harga,
  seller,
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
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardWrapper}>
        <View style={styles.cardContent}>
          {/* Nama Barang & Harga */}
          <View style={styles.rowBetweenCenter}>
            <Text style={styles.productName}>{namaBarang}</Text>
            <Text style={styles.productName}>{harga}</Text>
          </View>

          {/* Seller */}
          <View style={styles.rowBetween}>
            <Text style={styles.labelGray}>Seller</Text>
            <Text style={styles.labelBlack}>{seller}</Text>
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
                {status !== "returnInTransit" && (
                  <Text style={styles.adminNoteTextBold}>{time}</Text>
                )}
                <Text style={styles.adminNoteTextBold}>{config?.noteafter}</Text>
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
                <Text style={styles.statusTimeText}> {time}</Text>
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

export default RusakBarangCard;
