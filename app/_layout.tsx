import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/src/constants/Colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" /> {/* Barra de estado blanca (batería, hora) */}
      
      <Stack
        screenOptions={{
          // Configuración Global para todas las pantallas
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: '#fff', // Color del texto del título y flecha de volver
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // Color de fondo base para todas las pantallas (evita pantallazos blancos)
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        {/* Aquí definimos pantallas específicas si queremos configuración especial */}
        <Stack.Screen 
          name="index" 
          options={{ title: 'Gestión Alquileres' }} 
        />
        <Stack.Screen name="(tabs)"/>
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />()
        {/* Las demás pantallas se cargarán automáticamente con el estilo default */}
      </Stack>
    </>
  );
}
