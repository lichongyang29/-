import { Stack } from 'expo-router';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="AllHouse" options={{ headerShown: true }} />
      <Stack.Screen name="HouseDetail" options={{ headerShown: true }} />
      <Stack.Screen name="RendDetail" options={{ headerShown: true }} />
      <Stack.Screen name="RendSquare" options={{ headerShown: true }} />
      <Stack.Screen name="AddRend" options={{ headerShown: true }} />
      <Stack.Screen name="Search" options={{ headerShown: true }} />
      <Stack.Screen name="SearchResult" options={{ headerShown: true }} />
    </Stack>
  );
}
