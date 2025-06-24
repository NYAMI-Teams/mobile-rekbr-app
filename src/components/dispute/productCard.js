import { View, Text, TouchableOpacity, Image } from "react-native";
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
      <Text className="text-sm font-semibold text-black mb-2">
        Barang yang belum diterima
      </Text>
      <View className="bg-[#EAFBF8] p-4 rounded-xl mb-6 space-y-2">
        <Text className="font-semibold text-[15px] text-black">
          {productName}
        </Text>
        <Text className="text-[10px] text-gray-600 mt-2">{idx}</Text>
        <View className="flex-row justify-between mt-2">
          <Text className="text-[15px] text-black">Seller</Text>
          <Text className="text-[15px] text-black">{sellerMail}</Text>
        </View>
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-[15px] text-black">No Resi</Text>
          <View className="flex-row items-center space-x-1">
            <ClipboardPaste size={14} color="#999" />
            <Text className="text-[15px] text-blue-600 font-medium">
              {noResi}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between mt-2 mb-2">
          <Text className="text-[15px] text-black">Ekspedisi</Text>
          <Text className="text-[15px] text-black">{expedisi}</Text>
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

export default ProductCard;
