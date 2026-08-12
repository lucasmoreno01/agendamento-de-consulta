<?php

namespace App\Exceptions;

use DomainException;

class InvalidAppointmentScheduleException extends DomainException
{
    public function __construct()
    {
        parent::__construct('A consulta deve ser agendada para uma data e horário futuros.');
    }
}
