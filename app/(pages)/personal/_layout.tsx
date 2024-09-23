import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useWindowDimensions } from 'react-native';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
  const { width, height } = useWindowDimensions();
  return (
    <Stack>
      <Stack.Screen
        name="ChangeUser"
        options={{ headerShown: true, title: '编辑资料', headerTitleAlign: 'center' }}
      />
      <Stack.Screen name="CreateFile" options={{ headerShown: true }} />
      <Stack.Screen name="MyCollect" options={{ headerShown: true }} />
      <Stack.Screen
        name="MyHousing"
        options={{
          title: '我的房源',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: height * 0.028,
          },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen name="MyRent" options={{ headerShown: true }} />
      <Stack.Screen name="OpenVip" options={{ headerShown: true }} />
      <Stack.Screen name="SetAccount" options={{ headerShown: true }} />
    </Stack>
  );
}
