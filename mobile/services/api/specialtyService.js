import apiClient from './client';

export async function listSpecialties() {
  const { data } = await apiClient.get('/specialties');
  return data;
}
