import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export const UploadProve = ({
  media,
  pickMedia,
  setShowTipsModal,
}) => {
  return (
    <View>
      <Text style={styles.title}>
        Bukti foto & video
      </Text>
      <Text style={styles.desc}>
        Unggah maksimal <Text style={styles.bold}>5 foto</Text> atau{" "}
        <Text style={styles.bold}>4 foto + 1 video</Text>. Format: .jpg,
        .png, .mp4, .mov. Maks. 10 MB (foto), 50 MB (video).
      </Text>
      <TouchableOpacity onPress={() => setShowTipsModal(true)}>
        <Text style={styles.learn}>Pelajari</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={pickMedia}
        style={styles.uploadBtn}
      >
        <Text style={styles.plus}>＋</Text>
      </TouchableOpacity>
      <View style={styles.mediaWrap}>
        {media.map((item, idx) => (
          <View
            key={idx}
            style={styles.mediaBox}
          >
            {item.type === "image" ? (
              <Image source={{ uri: item.uri }} style={styles.mediaImg} />
            ) : (
              <View style={styles.videoBox}>
                <Text style={styles.videoText}>🎥 Video</Text>
              </View>
            )}
          </View>
        ))}
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
  desc: {
    fontSize: 12,
    color: "#4B5563",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "600",
    color: "#000",
  },
  learn: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
    marginBottom: 12,
  },
  uploadBtn: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  plus: {
    fontSize: 24,
    color: "#6B7280",
  },
  mediaWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  mediaBox: {
    width: 80,
    height: 80,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
    marginBottom: 12,
  },
  mediaImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  videoBox: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  videoText: {
    fontSize: 12,
    color: "#fff",
  },
});
