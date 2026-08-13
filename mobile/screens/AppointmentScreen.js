import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import AppButton from '../components/AppButton';
import FeedbackState from '../components/FeedbackState';
import FormField from '../components/FormField';
import LoadingState from '../components/LoadingState';
import ScreenContainer from '../components/ScreenContainer';
import SelectableOption from '../components/SelectableOption';
import { DEMO_PATIENT_ID } from '../constants/config';
import { createAppointment } from '../services/api/appointmentService';
import getApiErrorMessage from '../services/api/getApiErrorMessage';
import { listProfessionals } from '../services/api/professionalService';
import { listSpecialties } from '../services/api/specialtyService';

function createInitialForm() {
  return { specialty: null, professional: null, date: '', time: '', notes: '' };
}

function onlyDigits(value) {
  return value.replace(/\D/g, '');
}

function formatDate(value) {
  const digits = onlyDigits(value).slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function formatTime(value) {
  const digits = onlyDigits(value).slice(0, 4);

  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function validateForm(form) {
  const errors = {};

  if (!form.specialty) errors.specialty = 'Selecione uma especialidade.';
  if (!form.professional) errors.professional = 'Selecione um profissional.';
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.date)) errors.date = 'Informe a data no formato DD/MM/AAAA.';
  if (!/^\d{2}:\d{2}$/.test(form.time)) errors.time = 'Informe o horario no formato HH:MM.';

  if (!errors.date && !errors.time) {
    const [day, month, year] = form.date.split('/').map(Number);
    const [hours, minutes] = form.time.split(':').map(Number);
    const scheduledAt = new Date(year, month - 1, day, hours, minutes);
    const isSameDate = scheduledAt.getFullYear() === year && scheduledAt.getMonth() + 1 === month && scheduledAt.getDate() === day;

    if (Number.isNaN(scheduledAt.getTime()) || !isSameDate || scheduledAt <= new Date()) {
      errors.date = 'Escolha uma data e horario futuros.';
    }
  }

  return errors;
}

function toApiDateTime(date, time) {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}T${time}:00`;
}

export default function AppointmentScreen() {
  const [form, setForm] = useState(createInitialForm);
  const [specialties, setSpecialties] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [loadingProfessionals, setLoadingProfessionals] = useState(false);
  const [loadingError, setLoadingError] = useState('');
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState('form');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSpecialties();
  }, []);

  async function loadSpecialties() {
    setLoadingSpecialties(true);
    setLoadingError('');

    try {
      setSpecialties(await listSpecialties());
    } catch (error) {
      setLoadingError(getApiErrorMessage(error));
    } finally {
      setLoadingSpecialties(false);
    }
  }

  async function chooseSpecialty(specialty) {
    setForm((current) => ({ ...current, specialty, professional: null }));
    setProfessionals([]);
    setErrors((current) => ({ ...current, specialty: undefined, professional: undefined }));
    setLoadingProfessionals(true);
    setLoadingError('');

    try {
      setProfessionals(await listProfessionals(specialty.id));
    } catch (error) {
      setLoadingError(getApiErrorMessage(error));
    } finally {
      setLoadingProfessionals(false);
    }
  }

  function reviewAppointment() {
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setStep('review');
    }
  }

  async function confirmAppointment() {
    setSubmitting(true);

    try {
      const appointment = await createAppointment({
        patient_id: DEMO_PATIENT_ID,
        professional_id: form.professional.id,
        scheduled_at: toApiDateTime(form.date, form.time),
        notes: form.notes.trim() || null,
      });

      Alert.alert('Consulta agendada', 'Seu agendamento foi criado com sucesso.', [
        { text: 'Ver detalhes', onPress: () => router.replace(`/appointments/detail/${appointment.id}`) },
      ]);
    } catch (error) {
      Alert.alert('Nao foi possivel agendar', getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  const selectedSummary = useMemo(
    () => `${form.date || 'Data nao informada'} as ${form.time || '--:--'}`,
    [form.date, form.time],
  );

  if (loadingSpecialties) {
    return <LoadingState message="Carregando especialidades..." />;
  }

  if (loadingError && specialties.length === 0) {
    return <FeedbackState title="Nao foi possivel carregar" description={loadingError} actionTitle="Tentar novamente" onAction={loadSpecialties} />;
  }

  if (step === 'review') {
    return (
      <ScreenContainer>
        <View style={styles.section}>
          <Text style={styles.title}>Revise seu agendamento</Text>
          <View style={styles.summaryCard}>
            <SummaryLine label="Especialidade" value={form.specialty.name} />
            <SummaryLine label="Profissional" value={form.professional.name} />
            <SummaryLine label="Data e horario" value={selectedSummary} />
            {form.notes.trim() ? <SummaryLine label="Observacoes" value={form.notes.trim()} /> : null}
          </View>
          <AppButton title="Confirmar agendamento" onPress={confirmAppointment} loading={submitting} />
          <AppButton title="Voltar e editar" onPress={() => setStep('form')} variant="secondary" disabled={submitting} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.section}>
        <Text style={styles.title}>Nova consulta</Text>
        <Text style={styles.description}>Preencha os dados para revisar e confirmar seu agendamento.</Text>

        <Text style={styles.label}>Especialidade</Text>
        <View style={styles.options}>
          {specialties.map((specialty) => (
            <SelectableOption
              key={specialty.id}
              title={specialty.name}
              selected={form.specialty?.id === specialty.id}
              onPress={() => chooseSpecialty(specialty)}
            />
          ))}
        </View>
        {errors.specialty ? <Text style={styles.fieldError}>{errors.specialty}</Text> : null}

        {form.specialty ? (
          <>
            <Text style={styles.label}>Profissional</Text>
            {loadingProfessionals ? (
              <LoadingState message="Carregando profissionais..." />
            ) : (
              <View style={styles.options}>
                {professionals.map((professional) => (
                  <SelectableOption
                    key={professional.id}
                    title={professional.name}
                    subtitle={professional.specialty?.name}
                    selected={form.professional?.id === professional.id}
                    onPress={() => {
                      setForm((current) => ({ ...current, professional }));
                      setErrors((current) => ({ ...current, professional: undefined }));
                    }}
                  />
                ))}
              </View>
            )}
            {loadingError && professionals.length === 0 ? <Text style={styles.fieldError}>{loadingError}</Text> : null}
            {errors.professional ? <Text style={styles.fieldError}>{errors.professional}</Text> : null}
          </>
        ) : null}

        <View style={styles.dateRow}>
          <View style={styles.dateField}>
            <FormField
              label="Data"
              placeholder="DD/MM/AAAA"
              value={form.date}
              onChangeText={(date) => setForm((current) => ({ ...current, date: formatDate(date) }))}
              error={errors.date}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          <View style={styles.timeField}>
            <FormField
              label="Horario"
              placeholder="HH:MM"
              value={form.time}
              onChangeText={(time) => setForm((current) => ({ ...current, time: formatTime(time) }))}
              error={errors.time}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
        </View>
        <FormField
          label="Observacoes (opcional)"
          placeholder="Ex.: levar exames recentes"
          value={form.notes}
          onChangeText={(notes) => setForm((current) => ({ ...current, notes }))}
          maxLength={2000}
          multiline
          style={styles.notes}
        />
        <AppButton title="Revisar agendamento" onPress={reviewAppointment} />
      </View>
    </ScreenContainer>
  );
}

function SummaryLine({ label, value }) {
  return (
    <View style={styles.summaryLine}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 16 },
  title: { color: '#12345b', fontSize: 26, fontWeight: '700' },
  description: { color: '#5b6472', fontSize: 16, lineHeight: 23, marginBottom: 8 },
  label: { color: '#2c3d54', fontSize: 15, fontWeight: '700', marginTop: 6 },
  options: { gap: 8 },
  fieldError: { color: '#be3d3d', fontSize: 13, marginTop: -8 },
  dateRow: { flexDirection: 'row', gap: 12 },
  dateField: { flex: 1.25 },
  timeField: { flex: 0.75 },
  notes: { minHeight: 88, paddingTop: 14, textAlignVertical: 'top' },
  summaryCard: { backgroundColor: '#ffffff', borderColor: '#e0e6ee', borderRadius: 14, borderWidth: 1, gap: 16, padding: 18 },
  summaryLine: { gap: 4 },
  summaryLabel: { color: '#5b6472', fontSize: 13, fontWeight: '700' },
  summaryValue: { color: '#12345b', fontSize: 16 },
});
