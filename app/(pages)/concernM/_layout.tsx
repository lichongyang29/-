import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="CollectHouse" options={{ headerShown: true }} />
      <Stack.Screen name="CollectMe" options={{ headerShown: true }} />
      <Stack.Screen name="CollectPost" options={{ headerShown: true }} />
      <Stack.Screen name="LookedMe" options={{ headerShown: true }} />
    </Stack>
  );
}
