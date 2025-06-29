import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { ChevronLeft, ClipboardPaste, ChevronDown } from "lucide-react-native";
import Tagihan from "../DetailRekber/Tagihan";

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
};

const ProductCard = ({
  productName,
  idx,
  sellerMail,
  noResi,
  expedisi,
  itemPrice = 0,
  insuranceFee = 0,
  platformFee = 0,
  totalAmount = 0,
}) => {
  return (
    <View>
      <Text style={styles.title}>
        Barang yang belum diterima
      </Text>
      <View style={styles.cardBox}>
        <Text style={styles.productName}>
          {productName}
        </Text>
        <Text style={styles.idx}>{idx}</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Seller</Text>
          <Text style={styles.label}>{sellerMail}</Text>
        </View>
        <View style={styles.rowBetweenCenter}>
          <Text style={styles.label}>No Resi</Text>
          <View style={styles.rowIcon}>
            <ClipboardPaste size={14} color="#999" />
            <Text style={styles.resiText}>
              {noResi}
            </Text>
          </View>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Ekspedisi</Text>
          <Text style={styles.label}>{expedisi}</Text>
        </View>
        <Tagihan
          caption="Nominal Rekber"
          price={formatPrice(totalAmount)}
          details={[
            {
              status: "Nominal Barang",
              price: formatPrice(itemPrice),
            },
            {
              status: "Asuransi Pengiriman BNI Life (0.2%)",
              price: formatPrice(insuranceFee),
            },
            {
              status: `Biaya Jasa Aplikasi (8%)`,
              price: formatPrice(platformFee),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  cardBox: {
    backgroundColor: "#EAFBF8",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 0,
  },
  productName: {
    fontWeight: "600",
    fontSize: 15,
    color: "#000",
  },
  idx: {
    fontSize: 10,
    color: "#4B5563",
    marginTop: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 0,
  },
  rowBetweenCenter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 0,
  },
  label: {
    fontSize: 15,
    color: "#000",
  },
  rowIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  resiText: {
    fontSize: 15,
    color: "#2563EB",
    fontWeight: "500",
    marginLeft: 4,
  },
});

export default ProductCard;
