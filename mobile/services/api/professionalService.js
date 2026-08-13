import apiClient from './client';

export async function listProfessionals(specialtyId) {
  const { data } = await apiClient.get('/professionals', {
    params: specialtyId ? { specialty_id: specialtyId } : undefined,
  });
  return data;
}
