import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatDateTime, getStatusLabel } from '../utils/appointmentFormat';

export default function AppointmentCard({ appointment }) {
  return (
    <Link href={`/appointments/detail/${appointment.id}`} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={styles.row}>
          <Text style={styles.specialty}>{appointment.professional?.specialty?.name ?? 'Especialidade'}</Text>
          <View style={[styles.badge, styles[`badge_${appointment.status}`]]}>
            <Text style={styles.badgeText}>{getStatusLabel(appointment.status)}</Text>
          </View>
        </View>
        <Text style={styles.professional}>{appointment.professional?.name ?? 'Profissional'}</Text>
        <Text style={styles.date}>{formatDateTime(appointment.scheduled_at)}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderColor: '#e0e6ee', borderRadius: 14, borderWidth: 1, gap: 8, padding: 16 },
  pressed: { opacity: 0.78 },
  row: { alignItems: 'center', flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  specialty: { color: '#2563eb', flex: 1, fontSize: 13, fontWeight: '700' },
  professional: { color: '#12345b', fontSize: 17, fontWeight: '700' },
  date: { color: '#5b6472', fontSize: 15 },
  badge: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 4 },
  badge_agendado: { backgroundColor: '#e8f0ff' },
  badge_confirmado: { backgroundColor: '#e1ecff' },
  badge_realizado: { backgroundColor: '#e7eee9' },
  badge_cancelado: { backgroundColor: '#f9e3e3' },
  badgeText: { color: '#27445f', fontSize: 12, fontWeight: '700' },
});
