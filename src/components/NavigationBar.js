// src/components/NavigationBar.js
import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import Modal from "react-native-modal";
import { useState } from "react";
import { Pressable } from "react-native";

export default function NavigationBar({
  name,
  onNotificationPress,
  onLogoutPress,
}) {
  const [showPopup, setShowPopup] = useState(false);

  const handleEdit = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left → Logo + Hi + Name */}
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

      {/* Modal */}
      {showPopup && (
        <Modal
          visible={showPopup}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPopup(false)}
          style={{ margin: 0, padding: 0 }}>
          {/* <SafeAreaView className="flex-1"> */}
          <Pressable
            className="flex-1 bg-black/40 justify-end"
            onPress={() => setShowPopup(false)}>
            <Pressable
              className="bg-white rounded-t-2xl px-5"
              style={{
                height: "30%",
                width: "100%",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
              }}
              onPress={() => {}}>
              <View className="flex-col justify-center p-4">
                <Text className="text-lg font-semibold mb-8">Atur Profile</Text>
                <TouchableOpacity onPress={handleEdit} className="mb-4">
                  <Text className="text-black text-base font-medium mb-6">
                    Ubah Password
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEdit} className="mb-4">
                  <Text className="text-black text-base font-medium mb-6">
                    Ubah Email
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onLogoutPress} className="mb-10">
                  <Text className="text-red-500 text-base font-medium">
                    Keluar
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
          {/* </SafeAreaView> */}
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
    marginVertical: 12,
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-start", // supaya "Hi, nama" bisa agak turun
    justifyContent: "space-between",
    backgroundColor: "#fff",
    width: "100%",
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
    fontWeight: 500,
  },
});
