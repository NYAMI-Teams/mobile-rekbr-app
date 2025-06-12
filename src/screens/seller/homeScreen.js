// SellerEmptyContent.js

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';

export default function SellerEmptyContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isKycCompleted, setIsKycCompleted] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Ganti dengan token asli kamu (misalnya ambil dari storage / context / redux)
        const token = 'YOUR_ACCESS_TOKEN_HERE';

        const response = await fetch('https://api.rekbr.com/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log('User profile:', data);

        // Mapping kycStatus → isKycCompleted
        setIsKycCompleted(data.kycStatus === 'COMPLETED');
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Warning Banner → tampil jika BELUM KYC */}
      {!isKycCompleted && (
        <View style={styles.warningWrapper}>
          <View style={styles.warningBanner}>
            <View style={styles.warningRow}>
              <Image
                source={require('../../../assets/icon-warning.png')}
                style={styles.warningIcon}
                resizeMode="contain"
              />
              <Text style={styles.warningText}>
                Biar bisa lanjut bikin Rekber, kamu perlu selesain KYC dulu, ya!
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Content Empty */}
      <View style={styles.emptyContent}>
        <Image
          source={require('../../../assets/illustration-empty.png')}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={styles.emptyTitle}>Kosong banget di sini...</Text>
        <Text style={styles.emptySubtitle}>Bikin Rekber pertama kamu, kuy!</Text>
      </View>

      {/* CTA Button */}
      <View style={styles.ctaWrapper}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => {
            if (!isKycCompleted) {
              console.log('Navigasi ke halaman KYC');
            } else {
              console.log('Navigasi ke buat Rekber baru');
            }
          }}
        >
          <Text style={styles.ctaButtonText}>
            {isKycCompleted ? 'Bikin Rekber Baru' : 'Lengkapi KYC & Bikin Rekber'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
    justifyContent: 'center',
  },
  warningWrapper: {
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  warningBanner: {
    backgroundColor: '#FFF4D9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
    lineHeight: 20,
  },
  emptyContent: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emptyImage: {
    width: 300, // Perbesar ukuran gambar
    height: 300,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  ctaWrapper: {
    paddingHorizontal: 32,
  },
  ctaButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
