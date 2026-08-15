import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppProvider } from '@/context/AppContext';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { setBaseUrl } from '@workspace/api-client-react';

SplashScreen.preventAutoHideAsync();
if (process.env.EXPO_PUBLIC_DOMAIN) {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  const protocol = (domain.startsWith('localhost') || domain.startsWith('127.0.0.1') || domain.startsWith('192.168.')) ? 'http' : 'https';
  setBaseUrl(`${protocol}://${domain}`);
} else {
  // Fallback to local dev API server (port 5000)
  const localHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  setBaseUrl(`http://${localHost}:5000`);
}
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  useEffect(() => { if (fontsLoaded || fontError) SplashScreen.hideAsync(); }, [fontsLoaded, fontError]);
  if (!fontsLoaded && !fontError) return null;
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <Stack screenOptions={{ headerShown: false, headerBackTitle: 'Back' }}>
                  <Stack.Screen name="login" options={{ presentation: 'card', gestureEnabled: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="mart/[id]" options={{ presentation: 'card' }} />
                  <Stack.Screen name="checkout" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="order/[id]" options={{ presentation: 'card' }} />
                  <Stack.Screen name="register-mart" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="owner" options={{ presentation: 'card' }} />
                  <Stack.Screen name="admin" options={{ presentation: 'card' }} />
                  <Stack.Screen name="add-product" options={{ presentation: 'modal' }} />
                </Stack>
              </KeyboardProvider>
            </GestureHandlerRootView>
          </AppProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
