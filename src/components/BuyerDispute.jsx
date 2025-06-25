import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';

export default function BuyerDispute({ visible, onCancel, onComplain, onClose }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.backdrop} />

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalWrapper}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Info size={25} color="#3B82F6" style={styles.icon} />
              <Text style={styles.title}>
                Masalah sama barang? Cek dulu, baru ajukan komplain. Kami siap bantu!
              </Text>
            </View>

            <View style={styles.actions}>
              <Pressable style={[styles.button, styles.cancelBtn]} onPress={onClose}>
                <Text style={styles.cancelText}>Batalin</Text>
              </Pressable>

              <Pressable style={[styles.button, styles.complainBtn]} onPress={onComplain}>
                <Text style={styles.complainText}>Komplain</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  icon: {
    marginTop: 4,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9999, // rounded-full
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F3F4F6', // Tailwind gray-100
    marginRight: 8,
  },
  complainBtn: {
    backgroundColor: '#FEE2E2', // Tailwind red-100
    marginLeft: 8,
  },
  cancelText: {
    color: '#000000',
    fontWeight: '600',
    textAlign: 'center',
  },
  complainText: {
    color: '#B91C1C', // Tailwind red-700
    fontWeight: '600',
    textAlign: 'center',
  },
});
