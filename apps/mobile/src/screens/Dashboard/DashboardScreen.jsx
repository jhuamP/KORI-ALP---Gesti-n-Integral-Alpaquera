import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// TODO: Implementar pantalla Dashboard
export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{module.exports.EMOJI}</Text>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Módulo en construcción — próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F0E0C' },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#E8B84B', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#8A857A', textAlign: 'center', maxWidth: 240 },
});
