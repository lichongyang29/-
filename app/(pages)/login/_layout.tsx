import { Stack } from 'expo-router';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
  return (
    <Stack initialRouteName="Login">
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="Register" options={{ headerShown: true, title: '' }} />
      <Stack.Screen name="Authentication" options={{ headerShown: true, title: '' }} />
      <Stack.Screen
        name="ForgetPassword"
        options={{ headerShown: true, title: '忘记密码', headerTitleAlign: 'center' }}
      />
      <Stack.Screen name="SetPassword" options={{ headerShown: true, title: '' }} />
      <Stack.Screen name="OtherLogin" options={{ headerShown: true }} />
    </Stack>
  );
}
