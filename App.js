import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import NavigationBar from './src/components/NavigationBar';
import AccountBalance from './src/components/AccountBalance';
import QuickActions from './src/components/QuickActions';
import StepProgressBar from './src/components/ProgressBar';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <NavigationBar onMenuPress={() => console.log('Menu pressed')} />
      <AccountBalance balance={10000000} />
      <QuickActions />
      <StepProgressBar currentStep={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});
