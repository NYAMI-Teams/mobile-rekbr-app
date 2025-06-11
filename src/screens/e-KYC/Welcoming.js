// Welcoming.js

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useState } from 'react';

export default function Welcoming() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('Back pressed')}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Know Your Customer</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content scrollable */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../../assets/kyc-image.png')}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>Kenapa Seller Wajib KYC Dulu Sebelumnya?</Text>
          <Text style={styles.paragraph}>
            Dengan KYC, kita pastiin penjual asli, bukan akun palsu atau penipu. Jadi, kamu bisa jualan tanpa takut ribet,
            dan pembeli juga yakin barangnya beneran nyata.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            style={styles.checkbox}
          >
            {isChecked && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            Saya setuju data saya digunakan untuk verifikasi identitas demi keamanan transaksi.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isChecked ? '#000' : '#aaa' }]}
          onPress={() => console.log('Lanjut pressed')}
          disabled={!isChecked}
        >
          <Text style={styles.buttonText}>Lanjut</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Image source={require('../../../assets/bni-logo.png')} style={styles.footerLogo} resizeMode="contain" />
          <Text style={styles.footerText}>
            Proses Registrasi KYC-nya dengan perantara BNI langsung. Gak ribet & pasti aman!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
    marginTop: 16,
  },
  textContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000',
  },
  paragraph: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff', // borderTopWidth dihapus supaya tidak ada garis
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20, // supaya centang benar-benar tengah
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  footerLogo: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  footerText: {
    flex: 1,
    fontSize: 12,
    color: '#444',
    lineHeight: 16,
  },
});
