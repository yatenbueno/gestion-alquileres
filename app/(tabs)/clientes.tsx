import { ScreenWrapper } from '@/src/components/ScreenWrapper';
import { Colors } from '@/src/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { Cliente } from '@/src/types/database.types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ClientesScreen() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  // useFocusEffect sirve para recargar la lista cuando vuelves de "Crear Cliente"
  useFocusEffect(
    useCallback(() => {
      fetchClientes();
    }, [])
  );

  const fetchClientes = async () => {
    try {
      setLoading(true);
      // Ordenamos por apellido para que sea más fácil buscar visualmente
      const { data, error } = await supabase
        .from('cliente')
        .select('*')
        .order('created_at', { ascending: false }); // del más reciente creado al más viejo
        
      if (data) setClientes(data);
      if (error) console.error("Error cargando clientes:", error);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {loading ? (
           <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={clientes}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListEmptyComponent={
                <Text style={styles.emptyText}>No hay clientes registrados.</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {item.nombre.charAt(0)}{item.apellido.charAt(0)}
                    </Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{item.nombre} {item.apellido}</Text>
                    <Text style={styles.detail}>
                        {item.lugar_origen ? `📍 ${item.lugar_origen}` : 'Sin ubicación'}
                    </Text>
                    <Text style={styles.detail}>
                        {item.telefono ? `📞 ${item.telefono}` : 'Sin teléfono'}
                    </Text>
                </View>
              </View>
            )}
          />
        )}

        {/* FAB: Botón Flotante para Crear */}
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => router.push('/clientes/crearCliente')}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  emptyText: { textAlign: 'center', marginTop: 50, color: Colors.gris, fontSize: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.blanco,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + '20', // Un azul muy clarito (transparencia hex)
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: '700', color: Colors.negro, marginBottom: 4 },
  detail: { fontSize: 14, color: '#666', marginBottom: 2 },
  
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.negro,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});