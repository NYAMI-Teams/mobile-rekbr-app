import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PilihRekeningScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backButton}>
          <Image
            source={require('../../../assets/icon-back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Pilih Rekening Kamu</Text>
      </View>

      {/* Top Background + Ilustrasi */}
      <View style={styles.topBackground}>
        <Image
          source={require('../../../assets/illustration-transfer.png')}
          style={styles.topImage}
          resizeMode="contain"
        />
      </View>

      {/* Search Bar → tetap separuh di hijau */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Cari nama, bank, atau nomor rekening"
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
        <Image
          source={require('../../../assets/icon-search.png')}
          style={styles.searchIcon}
        />
      </View>

      {/* Empty State */}
      <View style={styles.emptyState}>
        <Image
          source={require('../../../assets/illustration-empty.png')}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={styles.emptyText}>
          Kamu belum pernah transaksi sebelumnya, jadi belum ada tujuan rekening yang bisa dituju.
        </Text>
      </View>

      {/* Button + Rekening */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>＋ Rekening</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    paddingRight: 12,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 24,
  },
  topBackground: {
    backgroundColor: '#EAFBF8',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    minHeight: screenHeight * 0.22, // responsive height → sekitar 22% dari tinggi layar
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16, // supaya gambar tidak nempel bawah
  },
  topImage: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: -screenHeight * 0.035, // responsive → sekitar -3.5% tinggi layar
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#999',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyImage: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
    alignItems: 'flex-end',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
