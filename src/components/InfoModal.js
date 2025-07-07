import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Modal,
} from 'react-native';
import { Info, X } from 'lucide-react-native';

export default function InfoModal({ title, desc, modalVisible, setModalVisible=() => {} }) {
  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.popupContainer}>
              {/* header */}
              <View style={styles.headerRow}>
                <Info size={20} fill="#3B82F6" color="#fff" />
                <Text style={styles.titleText}>{title}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <X size={20} color="#C2C2C2" />
                </TouchableOpacity>
              </View>
              {/* content */}
              <View style={{ marginTop: 8 }}>
                <Text style={styles.descText}>{desc}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
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
    borderColor: '#98B3F1',
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  titleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: "#3267E3"
  },
  descText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0A0A0A',
    lineHeight: 21,
  },
});
