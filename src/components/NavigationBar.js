import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const NavigationBar = ({ onMenuPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress}>
        <MaterialIcons name="menu" size={24} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray,
  },
});

export default NavigationBar;
