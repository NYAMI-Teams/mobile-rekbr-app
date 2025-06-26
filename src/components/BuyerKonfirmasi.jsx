import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
} from 'react-native';
import { Info } from 'lucide-react-native';

export default function BuyerKonfirmasi({
    visible,
    onBtn2,
    onBtn1,
    title,
    btn1,
    btn2,
    isBatalkan = false,
}) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onBtn1}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.titleRow}>
                        <Info size={20} color="#3B82F6" style={styles.icon} />
                        <Text style={styles.titleText}>{title}</Text>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            onPress={onBtn1}
                            style={[styles.button, styles.cancelButton]}
                        >
                            <Text style={styles.buttonText}>{btn1}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onBtn2}
                            style={[
                                styles.button,
                                isBatalkan
                                    ? styles.redButton
                                    : styles.blueButton,
                            ]}
                        >
                            <Text style={styles.buttonText}>{btn2}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 24,
        width: '90%',
        maxWidth: 400,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        gap: 8, // You can use marginRight/marginLeft if `gap` doesn't apply
    },
    icon: {
        marginTop: 4,
        marginRight: 8,
    },
    titleText: {
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
        color: '#000',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
    },
    cancelButton: {
        backgroundColor: '#F3F4F6', // gray-100
        marginRight: 8,
    },
    redButton: {
        backgroundColor: '#FECACA', // red-100
        marginLeft: 8,
    },
    blueButton: {
        backgroundColor: '#DBEAFE', // blue-100
        marginLeft: 8,
    },
    buttonText: {
        textAlign: 'center',
        color: '#000000',
        fontWeight: '500',
    },
});
