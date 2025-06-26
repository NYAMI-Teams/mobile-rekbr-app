import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Info } from 'lucide-react-native';

export default function InsurancePopup({ onClose }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.popupContainer}>
        <View style={styles.contentRow}>
          <Info size={20} color="#3B82F6" style={styles.infoIcon} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Asuransi BNI Life</Text>
            <Text style={styles.description}>
              Perlindungan kehilangan/kerusakan barang saat pengiriman. Biaya 0.2% dari nominal transaksi.
            </Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  popupContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginTop: 4,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: '#2563EB', // blue-600
    fontWeight: '500',
    marginBottom: 4,
  },
  description: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151', // gray-700
  },
  closeText: {
    fontSize: 20,
    color: '#9CA3AF', // gray-400
    marginLeft: 8,
  },
});
