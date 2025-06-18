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
  editable = true,
  keyboardType = 'default',
  className = '',
  errorText = '',
  autoCapitalize = 'none',
  inputMode = 'text',
  renderValue,
}) {
  return (
    <View className={clsx("flex-col", className)}>
      <Text className="text-[15px] text-black font-normal mb-2">{title}</Text>
      <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={renderValue ? renderValue(value) : value}
            onChangeText={onChangeText}
            editable={editable}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            inputMode={inputMode}
          />
      </View>
      {errorText ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : null}
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
  errorText: { 
    fontSize: 12,
    color: 'red',
    marginTop: 4,
    marginLeft: 5,
  },
});