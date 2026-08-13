export const DEMO_PATIENT_ID = Number(process.env.EXPO_PUBLIC_PATIENT_ID ?? 1);

export const APPOINTMENT_STATUSES = [
  { value: '', label: 'Todos' },
  { value: 'agendado', label: 'Agendado' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'realizado', label: 'Realizado' },
  { value: 'cancelado', label: 'Cancelado' },
];
