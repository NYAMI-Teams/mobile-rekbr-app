import { View, StyleSheet } from "react-native";
import Shimmer from "./Shimmer";

export default function TransactionSkeleton() {
  return (
    <View style={styles.container}>
      {/* Detail Section */}
      <View style={styles.detailSection}>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.detailRow}>
            <Shimmer style={styles.shimmerLeft} />
            <Shimmer style={styles.shimmerRight} />
          </View>
        ))}
      </View>

      {/* Status Section */}
      <View style={styles.statusSection}>
        <View style={styles.statusRow}>
          <View style={styles.statusTextGroup}>
            <Shimmer style={styles.dot} />
            <Shimmer style={styles.statusText} />
          </View>
          <Shimmer style={styles.badge} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 8,
    width: "100%",
    backgroundColor: "white",
  },
  detailSection: {
    padding: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  shimmerLeft: {
    width: "40%",
    height: 16,
    borderRadius: 4,
  },
  shimmerRight: {
    width: "50%",
    height: 16,
    borderRadius: 4,
  },
  statusSection: {
    backgroundColor: "#f3f4f6", // gray-100
    borderTopWidth: 1,
    borderColor: "#e5e7eb", // gray-200
    padding: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusTextGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    width: 96,
    height: 12,
    borderRadius: 4,
  },
  badge: {
    width: 96,
    height: 24,
    borderRadius: 12,
  },
});
