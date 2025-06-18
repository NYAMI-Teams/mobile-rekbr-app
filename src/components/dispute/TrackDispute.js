import { View, Text, Image } from "react-native";

const TrackDetail = ({ content, images = [], imgTitle }) => {
  return (
    <View className=" px-2 py-2.5 mx-1 mb-1 rounded-md">
      {/* Content text */}
      {content ? (
        <>
          <Text className="text-[14px] font-normal text-black">{content}</Text>
          <View className="h-1 mt-2 bg-white" />
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
                className="w-[100px] h-[100px] rounded-lg"
                resizeMode="cover"
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

// Komponen utama trackDispute
export const TrackDispute = ({ title, dateTime, details = [] }) => {
  return (
    <View className="px-4 mt-6">
      <Text className="text-[15px] font-semibold text-black">{title}</Text>
      <Text className="text-[10px] text-gray-500 mt-1">{dateTime}</Text>

      <View className="mt-2 bg-[#F9F9F9]">
        {details.map((item, index) => (
          <TrackDetail
            key={index}
            content={item.content}
            images={item.images}
            imgTitle={item.imgTitle}
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
