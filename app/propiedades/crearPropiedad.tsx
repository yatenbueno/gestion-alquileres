import { useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { Colors } from '@/src/constants/Colors';
import { ScreenWrapper } from '@/src/components/ScreenWrapper';

export default function CreateScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleCreate = async () => {
    // 1. Validaciones básicas
    if (!nombre || !precio) {
      Alert.alert('Error', 'El nombre y el precio son obligatorios');
      return;
    }

    try {
      setLoading(true);

      // 2. Insertar en Supabase
      // Nota: No enviamos ID ni created_at, la base de datos los genera sola.
      const { error } = await supabase.from('propiedad').insert({
        nombre: nombre,
        precio_por_noche: parseFloat(precio), // Convertimos texto a número
        descripcion: descripcion,
      });

      if (error) {
        throw error;
      }

      // 3. Éxito
      Alert.alert('¡Listo!', 'Propiedad publicada correctamente', [
        { 
          text: 'OK', 
          onPress: () => {
            // Limpiar formulario y volver al inicio
            setNombre('');
            setPrecio('');
            setDescripcion('');
            router.push('/');
          } 
        }
      ]);

    } catch (e: any) {
      Alert.alert('Error al guardar', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      {/* KeyboardAvoidingView ayuda a que el teclado no tape los inputs */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.label}>Nombre de la Propiedad *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Cabaña frente al lago"
            value={nombre}
            onChangeText={setNombre}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Precio por noche (ARS) *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={precio}
            onChangeText={setPrecio}
            keyboardType="numeric" // Teclado numérico
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detalles de la propiedad..."
            value={descripcion}
            onChangeText={setDescripcion}
            multiline // Permite varias líneas
            numberOfLines={4}
            textAlignVertical="top" // Para Android, empieza a escribir arriba
            placeholderTextColor="#999"
          />

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Publicar Propiedad</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.text,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});