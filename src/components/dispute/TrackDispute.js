import { View, Text, Image, TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";

// Fungsi salin teks ke clipboard
const handleCopy = async (text) => {
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

const TrackDetail = ({
  content,
  images = [],
  imgTitle,
  resiNumber,
  expedition,
}) => {
  return (
    <View className="px-2 py-2.5 mx-1 mb-1 rounded-md bg-white">
      {/* Content text */}
      {content ? (
        <>
          <Text className="text-[14px] font-normal text-black">{content}</Text>
          <View className="h-0.5 mt-2 bg-white" />
        </>
      ) : null}

      {/* Image section */}
      {images.length > 0 && (
        <View className={content ? "mt-2" : ""}>
          {imgTitle ? (
            <Text className="text-[12px] font-medium text-gray-800 mb-1">
              {imgTitle}
            </Text>
          ) : null}

          <View className="flex flex-wrap flex-row gap-2">
            {images.map((imgSource, index) => (
              <Image
                key={index}
                source={imgSource}
                className="w-[100px] h-[100px] rounded-lg mx-3"
                resizeMode="cover"
              />
            ))}
          </View>
        </View>
      )}

      {/* Resi & Ekspedisi section */}
      {(resiNumber || expedition) && (
        <View className="">
          {resiNumber && (
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-[15px] text-black">No Resi : </Text>
              <View className="flex-row items-center space-x-1">
                <TouchableOpacity onPress={() => handleCopy(content)}>
                  <Image
                    source={require("../../assets/copy.png")}
                    style={{ marginLeft: 4, width: 17, height: 16 }}
                  />
                </TouchableOpacity>
                <Text className="text-[15px] text-blue-600 font-medium">
                  {resiNumber}
                </Text>
              </View>
            </View>
          )}
          {expedition && (
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-[15px] text-black">Ekspedisi:</Text>
              <Text className="text-[15px] text-black">{expedition}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// Komponen utama TrackDispute
export const TrackDispute = ({
  title,
  dateTime,
  details = [],
  titleColor = "black",
}) => {
  return (
    <View className="px-4 mt-6">
      <Text className="text-[15px] font-semibold" style={{ color: titleColor }}>
        {title}
      </Text>
      {dateTime ? (
        <Text className="text-[10px] text-gray-500 mt-1">{dateTime}</Text>
      ) : null}

      <View className="mt-2 bg-[#F9F9F9] rounded-xl ">
        {details.map((item, index) => (
          <TrackDetail
            key={index}
            content={item.content}
            images={item.images}
            imgTitle={item.imgTitle}
            resiNumber={item.resiNumber}
            expedition={item.expedition}
          />
        ))}
      </View>
    </View>
  );
};

// cara panggil
// <TrackDispute
//    title="Riwayat Dispute"
//    dateTime="18 Juni 2025, 10:00 WIB"
//    details={[
//       { content: "Seller sudah kirim bukti." },
//       { content: "Buyer setuju refund." },
//       {
//       imgTitle: "Bukti Barang & Transfer",
//       images: [
//       require("../../assets/barangrusak.png"),
//       require("../../assets/barangrusak.png"),
//        ],
//        },
//    ]}
///>
