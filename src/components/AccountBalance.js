import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

const AccountBalance = ({ balance }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Total Balance</Text>
      <Text style={styles.amount}>
        Rp {(Number(balance) || 0).toLocaleString('id-ID')}
      </Text>
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
  label: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.gray,
    marginBottom: theme.spacing.small,
  },
  amount: {
    fontSize: theme.fontSizes.xlarge,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
});

export default AccountBalance;
