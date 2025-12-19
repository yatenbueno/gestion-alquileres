import { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { supabase } from "@/src/lib/supabase";
import { Colors } from "@/src/constants/Colors";
import { ScreenWrapper } from "@/src/components/ScreenWrapper";
import { Propiedad, Cliente } from "@/src/types/database.types";

export default function CrearReservaScreen() {
  const router = useRouter();

  // Datos maestros
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  // Selección
  const [selectedPropiedad, setSelectedPropiedad] = useState<Propiedad | null>(
    null
  );
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  // Modales de selección
  const [showPropiedadModal, setShowPropiedadModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);

  // Formulario
  const [checkIn, setCheckIn] = useState(""); // Formato YYYY-MM-DD
  const [noches, setNoches] = useState("");
  const [precioTotal, setPrecioTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 1. Cargar datos al inicio
  useEffect(() => {
    fetchMaestros();
  }, []);

  // 2. Calcular Precio Total automáticamente
  useEffect(() => {
    if (selectedPropiedad && noches) {
      const cantidad = parseInt(noches);
      if (!isNaN(cantidad)) {
        setPrecioTotal(selectedPropiedad.precio_por_noche * cantidad);
      }
    } else {
      setPrecioTotal(0);
    }
  }, [selectedPropiedad, noches]);

  const fetchMaestros = async () => {
    const { data: props } = await supabase.from("propiedad").select("*");
    const { data: clis } = await supabase.from("cliente").select("*");
    if (props) setPropiedades(props);
    if (clis) setClientes(clis);
  };

  const handleCreate = async () => {
    if (!selectedPropiedad || !selectedCliente || !checkIn || !noches) {
      Alert.alert("Error", "Completa todos los campos obligatorios");
      return;
    }

    setLoading(true);

    // Calculamos fecha salida simple (Entrada + Noches) - simplificado para el ejemplo
    // En una app real usaríamos librerías de fecha como 'date-fns'
    const entrada = new Date(checkIn);
    const salida = new Date(entrada);
    salida.setDate(salida.getDate() + parseInt(noches));
    const checkOutStr = salida.toISOString().split("T")[0];

    const { error } = await supabase.from("reserva").insert({
      propiedad_id: selectedPropiedad.id,
      cliente_id: selectedCliente.id,
      check_in: checkIn,
      check_out: checkOutStr,
      cantidad_noches: parseInt(noches),
      precio_total: precioTotal,
      estado: "confirmada",
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Éxito", "Reserva creada", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  };

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: "Nueva Reserva" }} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* SELECTOR DE PROPIEDAD */}
        <Text style={styles.label}>Propiedad *</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowPropiedadModal(true)}
        >
          <Text
            style={selectedPropiedad ? styles.selectorText : styles.placeholder}
          >
            {selectedPropiedad
              ? selectedPropiedad.nombre
              : "Seleccionar Propiedad..."}
          </Text>
          {selectedPropiedad && (
            <Text style={styles.priceTag}>
              ${selectedPropiedad.precio_por_noche}/noche
            </Text>
          )}
        </TouchableOpacity>

        {/* SELECTOR DE CLIENTE */}
        <Text style={styles.label}>Cliente *</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowClienteModal(true)}
        >
          <Text
            style={selectedCliente ? styles.selectorText : styles.placeholder}
          >
            {selectedCliente
              ? `${selectedCliente.nombre} ${selectedCliente.apellido}`
              : "Seleccionar Cliente..."}
          </Text>
        </TouchableOpacity>

        {/* FECHAS */}
        <Text style={styles.label}>Fecha de Entrada (YYYY-MM-DD) *</Text>
        <TextInput
          style={styles.input}
          placeholder="2024-01-01"
          value={checkIn}
          onChangeText={setCheckIn}
        />

        <Text style={styles.label}>Cantidad de Noches *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 3"
          keyboardType="numeric"
          value={noches}
          onChangeText={setNoches}
        />

        {/* TOTAL AUTOMÁTICO */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Estimado:</Text>
          <Text style={styles.totalAmount}>${precioTotal}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Guardando..." : "Crear Reserva"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL SELECCIÓN PROPIEDAD */}
      <Modal visible={showPropiedadModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Elige una Propiedad</Text>
          <FlatList
            data={propiedades}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedPropiedad(item);
                  setShowPropiedadModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{item.nombre}</Text>
                <Text style={{ color: Colors.verde }}>
                  ${item.precio_por_noche}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPropiedadModal(false)}
          >
            <Text style={{ color: Colors.blanco }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* MODAL SELECCIÓN CLIENTE */}
      <Modal visible={showClienteModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Elige un Cliente</Text>
          <FlatList
            data={clientes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedCliente(item);
                  setShowClienteModal(false);
                }}
              >
                <Text style={styles.modalItemText}>
                  {item.nombre} {item.apellido}
                </Text>
                <Text style={{ color: Colors.gris }}>DNI: {item.dni_pasaporte}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowClienteModal(false)}
          >
            <Text style={{ color: "white" }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 10 },
  input: {
    backgroundColor: Colors.blanco,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  selector: {
    backgroundColor: Colors.blanco,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: { fontSize: 16, color: Colors.negro },
  placeholder: { fontSize: 16, color: Colors.gris },
  priceTag: { color: Colors.verde, fontWeight: "bold" },

  totalContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: Colors.background,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalAmount: { fontSize: 24, fontWeight: "bold", color: Colors.primary },

  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: Colors.blanco, fontSize: 18, fontWeight: "bold" },

  // Estilos Modal
  modalContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: Colors.border,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalItem: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalItemText: { fontSize: 18 },
  closeButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
});
