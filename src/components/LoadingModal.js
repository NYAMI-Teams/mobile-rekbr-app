import React from "react";
import { Modal, View, ActivityIndicator, Text, StyleSheet } from "react-native";

export default function LoadingModal({ visible, text = "Memproses..." }) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={() => { }}
        >
            <View style={styles.loadingOverlay}>
                <View style={styles.loadingBox}>
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text style={styles.loadingText}>{text}</Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    loadingOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
    },
    loadingBox: {
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 120,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#000",
        fontWeight: "500",
    },
});