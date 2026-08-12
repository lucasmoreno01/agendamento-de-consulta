<?php

namespace App\Exceptions;

use DomainException;

class AppointmentScheduleConflictException extends DomainException
{
    public function __construct()
    {
        parent::__construct('O profissional já possui uma consulta neste horário.');
    }
}
