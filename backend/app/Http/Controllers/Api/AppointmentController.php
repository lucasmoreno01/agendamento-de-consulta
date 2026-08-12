<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\AppointmentScheduleConflictException;
use App\Exceptions\InvalidAppointmentCancellationException;
use App\Exceptions\InvalidAppointmentScheduleException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Models\Appointment;
use App\Models\Patient;
use App\Services\AppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'patient_id' => ['required', 'integer', 'exists:patients,id'],
            'status' => ['nullable', 'string', 'in:'.implode(',', Appointment::ALLOWED_STATUSES)],
        ]);

        $appointments = Appointment::query()
            ->with(['patient', 'professional.specialty'])
            ->where('patient_id', $filters['patient_id'])
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->orderByDesc('scheduled_at')
            ->get();

        return response()->json($appointments);
    }

    public function store(StoreAppointmentRequest $request, AppointmentService $appointmentService): JsonResponse
    {
        $data = $request->validated();

        try {
            $appointment = $appointmentService->schedule(
                $data['patient_id'],
                $data['professional_id'],
                $data['scheduled_at'],
                $data['notes'] ?? null,
            );
        } catch (InvalidAppointmentScheduleException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        } catch (AppointmentScheduleConflictException $exception) {
            return response()->json(['message' => $exception->getMessage()], 409);
        }

        return response()->json($this->withRelations($appointment), 201);
    }

    public function show(Appointment $appointment): JsonResponse
    {
        return response()->json($this->withRelations($appointment));
    }

    public function cancel(Appointment $appointment, AppointmentService $appointmentService): JsonResponse
    {
        try {
            $appointment = $appointmentService->cancel($appointment);
        } catch (InvalidAppointmentCancellationException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json($this->withRelations($appointment));
    }

    private function withRelations(Appointment $appointment): Appointment
    {
        return $appointment->load(['patient', 'professional.specialty']);
    }
}
