import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle; // Permitimos pasar estilos extra si hace falta
}

export const ScreenWrapper = ({ children, style }: ScreenWrapperProps) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20, // Márgenes laterales consistentes
    paddingTop: 20,        // Margen superior consistente
    backgroundColor: Colors.background,
    // En web, esto centra el contenido si la pantalla es muy ancha
    maxWidth: 800, 
    width: '100%',
    alignSelf: 'center', 
  },
});