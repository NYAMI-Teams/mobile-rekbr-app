import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const InputField = ({ placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default' }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});

export default InputField;
