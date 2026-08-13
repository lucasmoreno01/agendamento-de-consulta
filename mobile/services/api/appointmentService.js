import apiClient from './client';

export async function listAppointments({ patientId, status } = {}) {
  const { data } = await apiClient.get('/appointments', {
    params: {
      patient_id: patientId,
      ...(status ? { status } : {}),
    },
  });
  return data;
}

export async function createAppointment(payload) {
  const { data } = await apiClient.post('/appointments', payload);
  return data;
}

export async function getAppointment(appointmentId) {
  const { data } = await apiClient.get(`/appointments/${appointmentId}`);
  return data;
}

export async function cancelAppointment(appointmentId) {
  const { data } = await apiClient.patch(`/appointments/${appointmentId}/cancel`);
  return data;
}
