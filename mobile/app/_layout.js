import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#12345b',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#f5f7fb' },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="appointments/index" options={{ title: 'Agendar consulta' }} />
        <Stack.Screen name="history/index" options={{ title: 'Histórico de consultas' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
