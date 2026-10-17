<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AdminDashboardService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function __construct(private readonly AdminDashboardService $adminService)
    {
    }

    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->value();
        $data = $this->adminService->getDashboardData($search ?: null);

        return Inertia::render('admin/dashboard', $data);
    }

    public function updatePlan(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'plan_id' => ['required', 'integer', 'exists:plans,id'],
        ]);

        $this->adminService->alterarPlanoUsuario($user, (int) $validated['plan_id']);

        return back()->with('success', "Plano de {$user->name} atualizado com sucesso!");
    }
}
