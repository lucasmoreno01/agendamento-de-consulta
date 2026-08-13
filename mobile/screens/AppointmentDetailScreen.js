import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import AppButton from '../components/AppButton';
import FeedbackState from '../components/FeedbackState';
import LoadingState from '../components/LoadingState';
import ScreenContainer from '../components/ScreenContainer';
import { cancelAppointment, getAppointment } from '../services/api/appointmentService';
import getApiErrorMessage from '../services/api/getApiErrorMessage';
import { formatDateTime, getStatusLabel } from '../utils/appointmentFormat';

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const loadAppointment = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      setAppointment(await getAppointment(id));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAppointment();
  }, [loadAppointment]);

  function requestCancellation() {
    Alert.alert('Cancelar consulta?', 'Esta acao nao pode ser desfeita.', [
      { text: 'Voltar', style: 'cancel' },
      { text: 'Cancelar consulta', style: 'destructive', onPress: confirmCancellation },
    ]);
  }

  async function confirmCancellation() {
    setCancelling(true);

    try {
      setAppointment(await cancelAppointment(id));
      Alert.alert('Consulta cancelada', 'O status da consulta foi atualizado.');
    } catch (requestError) {
      Alert.alert('Nao foi possivel cancelar', getApiErrorMessage(requestError));
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <LoadingState message="Carregando consulta..." />;
  if (error) return <FeedbackState title="Consulta indisponivel" description={error} actionTitle="Tentar novamente" onAction={loadAppointment} />;

  const canCancel = ['agendado', 'confirmado'].includes(appointment.status);

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>STATUS</Text>
          <Text style={styles.status}>{getStatusLabel(appointment.status)}</Text>
        </View>
        <View style={styles.card}>
          <DetailLine label="Especialidade" value={appointment.professional?.specialty?.name} />
          <DetailLine label="Profissional" value={appointment.professional?.name} />
          <DetailLine label="Data e horario" value={formatDateTime(appointment.scheduled_at)} />
          <DetailLine label="Paciente" value={appointment.patient?.name} />
          {appointment.notes ? <DetailLine label="Observacoes" value={appointment.notes} /> : null}
        </View>
        {canCancel ? <AppButton title="Cancelar consulta" onPress={requestCancellation} loading={cancelling} variant="danger" /> : null}
        <AppButton title="Voltar ao historico" onPress={() => router.replace('/history')} variant="secondary" disabled={cancelling} />
      </View>
    </ScreenContainer>
  );
}

function DetailLine({ label, value }) {
  return (
    <View style={styles.line}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: 18 },
  statusBox: { backgroundColor: '#dff3f1', borderRadius: 14, gap: 4, padding: 18 },
  statusLabel: { color: '#257b78', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  status: { color: '#12345b', fontSize: 22, fontWeight: '700' },
  card: { backgroundColor: '#ffffff', borderColor: '#e0e6ee', borderRadius: 14, borderWidth: 1, gap: 18, padding: 18 },
  line: { gap: 4 },
  label: { color: '#5b6472', fontSize: 13, fontWeight: '700' },
  value: { color: '#12345b', fontSize: 16, lineHeight: 23 },
});
