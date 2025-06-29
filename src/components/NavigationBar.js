import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { useRouter } from "expo-router";

export default function NavigationBar({
  name,
  onNotificationPress,
  onLogoutPress,
}) {
  const router = useRouter();
  const modalizeRef = useRef(null);

  const handleEdit = () => modalizeRef.current?.open();

  const handleChangePassword = () => {
    router.push("/Profile/ChangePassword");
  };

  const handleChangeEmail = () => {
    router.push("/Profile/ChangeEmail");
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <Image
            source={require("../assets/logo-rekbr.png")}
            style={styles.logoRekbr}
            resizeMode="contain"
          />

          {/* Hi + name → turunkan sedikit pakai marginTop */}
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText}>Hi, </Text>
            <Text
              style={styles.emailText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {name}
            </Text>
          </View>
        </View>

        {/* Right → Notification & Profile */}
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onNotificationPress}>
            <Image
              source={require("../assets/icon-notification.png")}
              style={styles.actionIcon}
              resizeMode="contain"
            />
            <Text style={styles.actionText}>Notifikasi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Image
              source={require("../assets/icon-profile.png")}
              style={styles.actionIcon}
              resizeMode="contain"
            />
            <Text style={styles.actionText}>Atur Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modalize Bottom Sheet */}
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
        <View>
          <Text style={styles.modalTitle}>
            Atur Profile
          </Text>
          <TouchableOpacity onPress={handleChangePassword} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>
              Ubah Password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleChangeEmail} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>
              Ubah Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onLogoutPress();
            }}
            style={[styles.modalButton, styles.logoutButton]}
          >
            <Text style={styles.logoutButtonText}>
              Keluar
            </Text>
          </TouchableOpacity>
        </View>
      </Modalize>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start", // supaya "Hi, nama" bisa agak turun
    justifyContent: "space-between",
    backgroundColor: "#fff",
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 0 : 20,
    paddingBottom: 16,
  },
  leftSection: {
    flexDirection: "column",
    width: "50%",
    justifyContent: "center",
  },
  logoRekbr: {
    width: 80,
    height: 30,
    marginBottom: 4,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginTop: 6, // ← ini yang bikin "Hi, nama" agak turun
  },
  greetingText: {
    fontSize: 12,
    color: "#888",
    fontFamily: "Poppins_400Regular",
  },
  emailText: {
    fontSize: 12,
    color: "#000",
    fontFamily: "Poppins_600SemiBold",
    flex: 1,
    width: "100%",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    width: "38%",
    justifyContent: "space-between",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: {
    width: 26,
    height: 26,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#000",
    fontFamily: "Poppins_500Medium", // ← supaya tidak terlalu tebal
    fontWeight: "500",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#111",
  },
  modalButton: {
    marginBottom: 16,
    paddingVertical: 16,
  },
  modalButtonText: {
    fontSize: 16,
    color: "#111",
    fontWeight: "500",
  },
  logoutButton: {
    marginBottom: 32,
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#ef4444",
    fontWeight: "500",
  },
});
