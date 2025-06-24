import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const PrimaryButton = ({ title, onPress, disabled = false, height = 50, width = '100%', btnColor = '#000', textColor = '#fff', style = "", fontSize = 16 }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? '#F9F9F9' : btnColor },
        { height: height },
        { width: width },
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, { color: disabled ? '#aaa' : textColor }, { fontSize: fontSize }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default PrimaryButton;
