import React from 'react';
import { View, TextInput, Text } from 'react-native';
import clsx from 'clsx';
import { StyleSheet } from 'react-native';

export default function InputField({
  title,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  className = '',
}) {
  return (
    <View className={clsx("flex-col mx-5", className)}>
      <Text className="text-[14px] text-black font-normal mb-2">{title}</Text>
      <View style={styles.card}>
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
      </View>
    </View>
  );
}


const styles = StyleSheet.create({

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 12,
    color: '#333',

  },
});