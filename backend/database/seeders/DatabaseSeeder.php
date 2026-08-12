<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Professional;
use App\Models\Specialty;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $cardiology = Specialty::create(['name' => 'Cardiologia']);
        $dermatology = Specialty::create(['name' => 'Dermatologia']);
        $generalPractice = Specialty::create(['name' => 'Clínica Geral']);

        $professionals = [
            Professional::create(['specialty_id' => $cardiology->id, 'name' => 'Dra. Ana Martins']),
            Professional::create(['specialty_id' => $cardiology->id, 'name' => 'Dr. Bruno Costa']),
            Professional::create(['specialty_id' => $dermatology->id, 'name' => 'Dra. Carla Souza']),
            Professional::create(['specialty_id' => $dermatology->id, 'name' => 'Dr. Diego Lima']),
            Professional::create(['specialty_id' => $generalPractice->id, 'name' => 'Dra. Elisa Rocha']),
            Professional::create(['specialty_id' => $generalPractice->id, 'name' => 'Dr. Felipe Alves']),
        ];

        $patient = Patient::create(['name' => 'Paciente Demonstração']);

        Appointment::create([
            'patient_id' => $patient->id,
            'professional_id' => $professionals[0]->id,
            'scheduled_at' => Carbon::now()->subDays(14)->setTime(9, 0),
            'status' => Appointment::STATUS_COMPLETED,
            'notes' => 'Consulta de acompanhamento cardiológico.',
        ]);

        Appointment::create([
            'patient_id' => $patient->id,
            'professional_id' => $professionals[2]->id,
            'scheduled_at' => Carbon::now()->subDays(7)->setTime(14, 30),
            'status' => Appointment::STATUS_CANCELLED,
            'notes' => 'Consulta cancelada pelo paciente.',
        ]);

        Appointment::create([
            'patient_id' => $patient->id,
            'professional_id' => $professionals[4]->id,
            'scheduled_at' => Carbon::now()->addDays(3)->setTime(10, 0),
            'status' => Appointment::STATUS_SCHEDULED,
            'notes' => 'Consulta de rotina.',
        ]);

        Appointment::create([
            'patient_id' => $patient->id,
            'professional_id' => $professionals[1]->id,
            'scheduled_at' => Carbon::now()->addDays(7)->setTime(16, 0),
            'status' => Appointment::STATUS_CONFIRMED,
            'notes' => 'Levar exames recentes.',
        ]);
    }
}
