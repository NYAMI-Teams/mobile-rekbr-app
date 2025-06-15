import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from '../screens/Onboarding';
import ChooseRekening from '../screens/seller/chooseRekening';
import Welcoming from '../screens/e-KYC/Welcoming';
import KYC_DataDiri from '../screens/e-KYC/KYC_DataDiri';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="ChooseRekening" component={ChooseRekening} />
      <Stack.Screen name="Welcoming" component={Welcoming} />
      <Stack.Screen name="KYC_DataDiri" component={KYC_DataDiri} />
    </Stack.Navigator>
  );
};
