import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const QuickActions = () => {
  const actions = [
    { icon: 'send', label: 'Transfer' },
    { icon: 'credit-card', label: 'Pay' },
    { icon: 'receipt', label: 'Bill' },
    { icon: 'qr-code-scanner', label: 'Scan' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        {actions.map((action, index) => (
          <TouchableOpacity key={index} style={styles.actionButton}>
            <MaterialIcons name={action.icon} size={24} color={theme.colors.primary} />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.white,
  },
  title: {
    fontSize: theme.fontSizes.medium,
    fontWeight: 'bold',
    marginBottom: theme.spacing.medium,
    color: theme.colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    margin: theme.spacing.small,
  },
  actionLabel: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text,
    marginTop: theme.spacing.small,
  },
});

export default QuickActions;
