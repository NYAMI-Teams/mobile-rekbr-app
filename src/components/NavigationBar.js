// src/components/NavigationBar.js

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, StatusBar, SafeAreaView } from 'react-native';

export default function NavigationBar({ name, onNotificationPress, onProfilePress }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left → Logo + Hi + Name */}
        <View style={styles.leftSection}>
          <Image
            source={require('../../assets/logo-rekbr.png')}
            style={styles.logoRekbr}
            resizeMode="contain"
          />

          {/* Hi + name → turunkan sedikit pakai marginTop */}
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText}>Hi, </Text>
            <Text style={styles.emailText}>{name}</Text>
          </View>
        </View>

        {/* Right → Notification & Profile */}
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.actionButton} onPress={onNotificationPress}>
            <Image
              source={require('../../assets/icon-notification.png')}
              style={styles.actionIcon}
              resizeMode="contain"
            />
            <Text style={styles.actionText}>Notifikasi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onProfilePress}>
            <Image
              source={require('../../assets/icon-profile.png')}
              style={styles.actionIcon}
              resizeMode="contain"
            />
            <Text style={styles.actionText}>Atur Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start', // supaya "Hi, nama" bisa agak turun
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  leftSection: {
    flexDirection: 'column',
  },
  logoRekbr: {
    width: 72,
    height: 24,
    marginBottom: 4,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6, // ← ini yang bikin "Hi, nama" agak turun
  },
  greetingText: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Poppins_400Regular',
  },
  emailText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins_600SemiBold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginLeft: 16,
  },
  actionIcon: {
    width: 40,
    height: 40,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Poppins_500Medium', // ← supaya tidak terlalu tebal
  },
});
