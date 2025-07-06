import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';

const AuthLink = ({ text, linkText, onPress }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{text}</Text>
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.linkText}>{linkText}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 25,
  },
  text: {
    color: '#666',
    fontSize: 15,
  },
  linkText: {
    color: '#007bff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default AuthLink;