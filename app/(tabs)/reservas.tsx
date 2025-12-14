import { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/src/lib/supabase";
import { Reserva } from "@/src/types/database.types";
import { ScreenWrapper } from "@/src/components/ScreenWrapper";
import { Colors } from "@/src/constants/Colors";

// Extendemos el tipo Reserva para incluir los objetos anidados (Joins)
interface ReservaConDetalles extends Reserva {
  propiedad: { nombre: string } | null;
  cliente: { nombre: string; apellido: string } | null;
}

export default function ReservasScreen() {
  const router = useRouter();
  const [reservas, setReservas] = useState<ReservaConDetalles[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchReservas();
    }, [])
  );

  const fetchReservas = async () => {
    try {
      setLoading(true);
      // MAGIA DE SUPABASE: Traemos la reserva Y los datos relacionados
      const { data, error } = await supabase
        .from("reserva")
        .select(
          `
          *,
          propiedad (nombre),
          cliente (nombre, apellido)
        `
        )
        .order("check_in", { ascending: false }); // Las más recientes primero

      if (error) throw error;
      if (data) setReservas(data as any); // Cast necesario por el Join
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return Colors.verde;
      case "cancelada":
        return Colors.rojo;
      default:
        return Colors.amarillo;
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={reservas}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListEmptyComponent={
              <Text style={styles.empty}>No hay reservas registradas.</Text>
            }
            renderItem={({ item }) => (
              <View
                style={[
                  styles.card,
                  {
                    borderLeftColor: getStatusColor(item.estado),
                    borderLeftWidth: 5,
                  },
                ]}
              >
                <View style={styles.header}>
                  <Text style={styles.propiedad}>
                    {item.propiedad?.nombre || "Propiedad desconocida"}
                  </Text>
                  <Text
                    style={[
                      styles.status,
                      { color: getStatusColor(item.estado) },
                    ]}
                  >
                    {item.estado.toUpperCase()}
                  </Text>
                </View>

                <Text style={styles.cliente}>
                  👤 {item.cliente?.nombre} {item.cliente?.apellido}
                </Text>

                <View style={styles.fechasRow}>
                  <Text style={styles.fecha}>
                    📅 Entrada: {item.fecha_entrada}
                  </Text>
                  <Text style={styles.fecha}>
                    🌙 {item.cantidad_noches} noches
                  </Text>
                </View>

                <Text style={styles.precio}>Total: ${item.precio_total}</Text>
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/reservas/crearReserva")}
        >
          <Ionicons name="add" size={30} color={Colors.blanco} />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative" },
  empty: { textAlign: "center", marginTop: 50, color: Colors.gris },
  card: {
    backgroundColor: Colors.blanco,
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  propiedad: { fontSize: 16, fontWeight: "bold", color: Colors.negro },
  status: { fontSize: 12, fontWeight: "bold" },
  cliente: { fontSize: 15, color: "#555", marginBottom: 8 },
  fechasRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  fecha: { fontSize: 13, color: Colors.gris },
  precio: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.verde,
    textAlign: "right",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: Colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
