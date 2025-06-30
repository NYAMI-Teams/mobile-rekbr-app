import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
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
    <View style={styles.detailContainer}>
      {/* Content text */}
      {content ? (
        <>
          <Text style={styles.detailContent}>{content}</Text>
          <View style={styles.detailDivider} />
        </>
      ) : null}

      {/* Image section */}
      {images.length > 0 && (
        <View style={[content ? styles.mt2 : null]}>
          {imgTitle ? (
            <Text style={styles.imgTitle}>
              {imgTitle}
            </Text>
          ) : null}

          <View style={styles.imgRow}>
            {images.map((imgSource, index) => (
              <Image
                key={index}
                source={imgSource}
                style={styles.img}
                resizeMode="cover"
              />
            ))}
          </View>
        </View>
      )}

      {/* Resi & Ekspedisi section */}
      {(resiNumber || expedition) && (
        <View>
          {resiNumber && (
            <View style={styles.resiRow}>
              <Text style={styles.resiLabel}>No Resi : </Text>
              <View style={styles.resiValueRow}>
                <TouchableOpacity onPress={() => handleCopy(resiNumber)}>
                  <Image
                    source={require("../../assets/copy.png")}
                    style={styles.copyIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.resiValue}>{resiNumber}</Text>
              </View>
            </View>
          )}
          {expedition && (
            <View style={styles.resiRow}>
              <Text style={styles.resiLabel}>Ekspedisi:</Text>
              <Text style={styles.resiLabel}>{expedition}</Text>
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
    <View style={styles.container}>
      <Text style={[styles.title, { color: titleColor }]}>
        {title}
      </Text>
      {dateTime ? (
        <Text style={styles.dateTime}>{dateTime}</Text>
      ) : null}

      <View style={styles.detailWrapper}>
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  dateTime: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 4,
  },
  detailWrapper: {
    marginTop: 8,
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    overflow: "hidden",
  },
  detailContainer: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginHorizontal: 4,
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  detailContent: {
    fontSize: 14,
    color: "#000",
    fontWeight: "400",
  },
  detailDivider: {
    height: 2,
    marginTop: 8,
    backgroundColor: "#fff",
  },
  mt2: {
    marginTop: 8,
  },
  imgTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  imgRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  resiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  resiLabel: {
    fontSize: 15,
    color: "#000",
  },
  resiValueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  copyIcon: {
    marginLeft: 4,
    width: 17,
    height: 16,
  },
  resiValue: {
    fontSize: 15,
    color: "#2563EB",
    fontWeight: "500",
    marginLeft: 4,
  },
});
