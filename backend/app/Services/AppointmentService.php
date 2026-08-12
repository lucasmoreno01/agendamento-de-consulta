<?php

namespace App\Services;

use App\Exceptions\AppointmentScheduleConflictException;
use App\Exceptions\InvalidAppointmentCancellationException;
use App\Exceptions\InvalidAppointmentScheduleException;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Professional;
use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;

class AppointmentService
{
    /**
     * Creates an appointment with the initial scheduled status.
     *
     * @throws AppointmentScheduleConflictException
     * @throws InvalidAppointmentScheduleException
     */
    public function schedule(
        int $patientId,
        int $professionalId,
        string|DateTimeInterface $scheduledAt,
        ?string $notes = null,
    ): Appointment {
        $scheduledAt = $this->normalizeSchedule($scheduledAt);

        if ($scheduledAt->lessThanOrEqualTo(now())) {
            throw new InvalidAppointmentScheduleException;
        }

        try {
            return DB::transaction(function () use ($patientId, $professionalId, $scheduledAt, $notes): Appointment {
                Patient::query()->findOrFail($patientId);
                Professional::query()->findOrFail($professionalId);

                $isUnavailable = Appointment::query()
                    ->where('professional_id', $professionalId)
                    ->where('scheduled_at', $scheduledAt)
                    ->exists();

                if ($isUnavailable) {
                    throw new AppointmentScheduleConflictException;
                }

                return Appointment::create([
                    'patient_id' => $patientId,
                    'professional_id' => $professionalId,
                    'scheduled_at' => $scheduledAt,
                    'status' => Appointment::STATUS_SCHEDULED,
                    'notes' => $notes,
                ]);
            });
        } catch (UniqueConstraintViolationException) {
        
            throw new AppointmentScheduleConflictException;
        }
    }

    /**
     * @throws InvalidAppointmentCancellationException
     */
    public function cancel(Appointment $appointment): Appointment
    {
        if (! in_array($appointment->status, [Appointment::STATUS_SCHEDULED, Appointment::STATUS_CONFIRMED], true)) {
            throw new InvalidAppointmentCancellationException;
        }

        $appointment->update(['status' => Appointment::STATUS_CANCELLED]);

        return $appointment->refresh();
    }

    private function normalizeSchedule(string|DateTimeInterface $scheduledAt): Carbon
    {
        return $scheduledAt instanceof DateTimeInterface
            ? Carbon::instance($scheduledAt)->startOfSecond()
            : Carbon::parse($scheduledAt)->startOfSecond();
    }
}
