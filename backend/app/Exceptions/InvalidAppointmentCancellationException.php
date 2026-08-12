<?php

namespace App\Exceptions;

use DomainException;

class InvalidAppointmentCancellationException extends DomainException
{
    public function __construct()
    {
        parent::__construct('Apenas consultas agendadas ou confirmadas podem ser canceladas.');
    }
}
