import { useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { Colors } from '@/src/constants/Colors';
import { ScreenWrapper } from '@/src/components/ScreenWrapper';

export default function CrearClienteScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [origen, setOrigen] = useState('');

  const handleCreate = async () => {
    if (!nombre || !apellido || !dni) {
      Alert.alert('Faltan datos', 'Nombre, Apellido y DNI son obligatorios.');
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from('cliente').insert({
        nombre: nombre,
        apellido: apellido,
        dni_pasaporte: dni,
        telefono: telefono || null, // Si está vacío, mandamos null
        email: email || null,
        lugar_origen: origen || null,
      });

      if (error) throw error;

      Alert.alert('Éxito', 'Cliente registrado correctamente', [
        { text: 'OK', onPress: () => router.back() } // Volvemos al listado
      ]);

    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      {/* Configuración del Header específica para esta pantalla */}
      <Stack.Screen options={{ title: 'Nuevo Cliente' }} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.sectionTitle}>Datos Personales</Text>
          
          <View style={styles.row}>
            <View style={styles.col}>
                <Text style={styles.label}>Nombre *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Juan"
                    value={nombre}
                    onChangeText={setNombre}
                />
            </View>
            <View style={styles.col}>
                <Text style={styles.label}>Apellido *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Pérez"
                    value={apellido}
                    onChangeText={setApellido}
                />
            </View>
          </View>

          <Text style={styles.label}>DNI o Pasaporte *</Text>
          <TextInput
            style={styles.input}
            placeholder="12345678"
            value={dni}
            onChangeText={setDni}
            keyboardType="numeric"
          />

          <Text style={styles.sectionTitle}>Contacto</Text>

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="+54 9 ..."
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="juanperez@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Lugar de Origen</Text>
          <TextInput
            style={styles.input}
            placeholder="Buenos Aires, Argentina"
            value={origen}
            onChangeText={setOrigen}
          />

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Guardar Cliente</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 10,
    marginBottom: 15,
  },
  row: { flexDirection: 'row', gap: 10 },
  col: { flex: 1 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});