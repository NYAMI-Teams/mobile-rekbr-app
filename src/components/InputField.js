import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function InputField({
  title,
  placeholder,
  value,
  onChangeText,
  editable = true,
  keyboardType = 'default',
  errorText = '',
  autoCapitalize = 'none',
  inputMode = 'text',
  renderValue,
  isPassword = false,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={renderValue ? renderValue(value) : value}
          onChangeText={onChangeText}
          editable={editable}
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          inputMode={inputMode}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.passwordIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <MaterialIcons
              name={isPasswordVisible ? "visibility" : "visibility-off"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
      {errorText ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    color: '#000',
    fontWeight: '400',
    marginBottom: 8,
  },
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