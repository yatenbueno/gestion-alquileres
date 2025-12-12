import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '@/src/lib/supabase';
import { Propiedad } from '@/src/types/database.types';
import { ScreenWrapper } from '@/src/components/ScreenWrapper'; // Importamos el Wrapper
import { Colors } from '@/src/constants/Colors'; // Importamos Colores

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
      {/* Ya no necesitamos el título aquí, está en el Header del Layout */}
      
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
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: Colors.card,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.text,
    flex: 1,
  },
  price: { 
    fontSize: 16, 
    color: Colors.success, 
    fontWeight: 'bold' 
  },
  description: {
    color: Colors.textLight,
    fontSize: 14,
  }
});