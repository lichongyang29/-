import { Slot, Stack } from 'expo-router';
import { SessionProvider } from '@/ctx';

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  //   const colorScheme = useColorScheme();
  //   const [loaded] = useFonts({
  //     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  //   });
  //   useEffect(() => {
  //     if (loaded) {
  //       SplashScreen.hideAsync();
  //     }
  //   }, [loaded]);

  //   if (!loaded) {
  //     return null;
  //   }
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
