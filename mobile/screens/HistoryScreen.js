import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import AppointmentCard from '../components/AppointmentCard';
import FeedbackState from '../components/FeedbackState';
import LoadingState from '../components/LoadingState';
import ScreenContainer from '../components/ScreenContainer';
import { APPOINTMENT_STATUSES, DEMO_PATIENT_ID } from '../constants/config';
import { listAppointments } from '../services/api/appointmentService';
import getApiErrorMessage from '../services/api/getApiErrorMessage';

export default function HistoryScreen() {
  const [status, setStatus] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAppointments = useCallback(async (selectedStatus = status) => {
    setLoading(true);
    setError('');

    try {
      setAppointments(await listAppointments({ patientId: DEMO_PATIENT_ID, status: selectedStatus }));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useFocusEffect(
    useCallback(() => {
      loadAppointments(status);
    }, [loadAppointments, status]),
  );

  function changeStatus(nextStatus) {
    setStatus(nextStatus);
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Minhas consultas</Text>
          <Text style={styles.subtitle}>Acompanhe e atualize seus atendimentos.</Text>
        </View>
        <Pressable onPress={() => loadAppointments(status)} style={styles.refreshButton}>
          <Text style={styles.refreshText}>Atualizar</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {APPOINTMENT_STATUSES.map((item) => (
          <Pressable
            key={item.value || 'all'}
            onPress={() => changeStatus(item.value)}
            style={[styles.filter, status === item.value && styles.filterActive]}>
            <Text style={[styles.filterText, status === item.value && styles.filterTextActive]}>{item.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading ? <LoadingState message="Atualizando consultas..." /> : null}
      {!loading && error ? <FeedbackState title="Nao foi possivel carregar" description={error} actionTitle="Tentar novamente" onAction={() => loadAppointments(status)} /> : null}
      {!loading && !error && appointments.length === 0 ? <FeedbackState title="Nenhuma consulta encontrada" description="Nao ha consultas para este filtro." /> : null}
      {!loading && !error && appointments.length > 0 ? (
        <View style={styles.list}>
          {appointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)}
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'flex-start', flexDirection: 'row', gap: 12, justifyContent: 'space-between', marginBottom: 20 },
  title: { color: '#12345b', fontSize: 26, fontWeight: '700' },
  subtitle: { color: '#5b6472', fontSize: 14, lineHeight: 20, marginTop: 4 },
  refreshButton: { borderColor: '#257b78', borderRadius: 9, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9 },
  refreshText: { color: '#257b78', fontSize: 13, fontWeight: '700' },
  filters: { gap: 8, paddingBottom: 20 },
  filter: { backgroundColor: '#ffffff', borderColor: '#d9e0e8', borderRadius: 18, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8 },
  filterActive: { backgroundColor: '#257b78', borderColor: '#257b78' },
  filterText: { color: '#43546b', fontSize: 13, fontWeight: '700' },
  filterTextActive: { color: '#ffffff' },
  list: { gap: 12 },
});
