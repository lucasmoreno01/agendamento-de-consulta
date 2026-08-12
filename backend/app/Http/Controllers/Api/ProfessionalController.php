<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfessionalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'specialty_id' => ['nullable', 'integer', 'exists:specialties,id'],
        ]);

        $professionals = Professional::query()
            ->with('specialty')
            ->when($filters['specialty_id'] ?? null, fn ($query, $specialtyId) => $query->where('specialty_id', $specialtyId))
            ->orderBy('name')
            ->get();

        return response()->json($professionals);
    }
}
