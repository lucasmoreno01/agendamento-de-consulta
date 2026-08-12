<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Specialty;
use Illuminate\Http\JsonResponse;

class SpecialtyController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Specialty::query()->orderBy('name')->get());
    }
}
