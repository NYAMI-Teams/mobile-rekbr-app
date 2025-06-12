import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AccountBalance from './src/components/AccountBalance';
import QuickActions from './src/components/QuickActions';
import Onboarding from './src/screens/e-KYC/Onboarding';
import NavigationBar from './src/components/NavigationBar';
import Welcoming from './src/screens/e-KYC/Welcoming';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* <NavigationBar onMenuPress={() => console.log('Menu pressed')} />
      <AccountBalance balance={10000000} />
      <QuickActions /> */}
      <NavigationBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});
