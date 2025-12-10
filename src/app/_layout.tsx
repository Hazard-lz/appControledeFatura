import Colors from '@/constants/Colors';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function RootLayout() {

  const [session, setSession] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  const router = useRouter();
  const segments = useSegments();

  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const colors = Colors[theme];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setInitialized(true);
      }
    );
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inResetScreen = segments[1] === 'reset-password-confirm';

    if (session && inAuthGroup && !inResetScreen) {
      router.replace('/(panel)/profile/dashboard');
    }
    else if (!session && !inAuthGroup) {
      router.replace('/(auth)/signin/page');
    }
  }, [session, initialized, segments]);

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{
      headerShown: true,
      animation: 'slide_from_right',
      title: 'Controle de Fatura',
      headerStyle: {
        backgroundColor: colors.background
      },
      headerTintColor: colors.tint
    }}>
      <Stack.Screen name="(auth)/signin/page" />
      <Stack.Screen name="(auth)/signup/page" />
      <Stack.Screen name="(auth)/forgot-password" />
      <Stack.Screen name="(auth)/reset-password-confirm" />
      <Stack.Screen name="(panel)/profile/dashboard" />
      <Stack.Screen name="(panel)/profile/faturas" />
      <Stack.Screen name="(panel)/profile/gerenciar-fatura" />
      <Stack.Screen name="(panel)/profile/configuracoes" />
      <Stack.Screen name="(panel)/profile/fatura-estimada" />
    </Stack>
  );
}