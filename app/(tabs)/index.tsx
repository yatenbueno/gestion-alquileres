import { ScreenWrapper } from '@/src/components/ScreenWrapper';
import { Colors } from '@/src/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { Propiedad } from '@/src/types/database.types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropiedades();
  }, []);

  const fetchPropiedades = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('propiedad').select('*');
      if (data) setPropiedades(data);
      if (error) console.error("Error fetching:", error);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
      <FlatList
        data={propiedades}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              <Text style={styles.price}>${item.precio_por_noche}/noche</Text>
            </View>
            <Text style={styles.description} numberOfLines={2}>
              {item.descripcion}
            </Text>
          </View>
        )}
      />
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/propiedades/crearPropiedad')} // <--- Tu lógica deseada
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Importante para que el contenedor ocupe todo
    position: 'relative', // Necesario para posicionar el botón flotante
  },
  center: { justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: Colors.blanco,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: Colors.negro,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0,0,0,0.05)',
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: Colors.negro,
    flex: 1,
  },
  price: { 
    fontSize: 16, 
    color: Colors.verde, 
    fontWeight: 'bold' 
  },
  description: {
    color: Colors.gris,
    fontSize: 14,
  },
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
    elevation: 5, // Sombra en Android
  },
});