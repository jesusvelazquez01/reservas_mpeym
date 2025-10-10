<?php

namespace App\Http\Controllers;

use App\Models\Equipo;
use App\Models\Sala;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
class EquipoController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:ver Equipo')->only(['index']);
        $this->middleware('permission:crear Equipo')->only(['store']);
        $this->middleware('permission:editar Equipo')->only(['update']);
        $this->middleware('permission:eliminar Equipo')->only(['destroy']);
    }
    
    public function index()
    {
        return Inertia::render('equipos/Index', [
            'equipos' => Equipo::with('sala')->get(),
            'salas' => Sala::all(),
        ]);
    }
    public function create(){
        return Inertia::render('equipos/Create', [
            'equipos' => Equipo::with('sala')->get(),
            'salas' => Sala::all(),
        ]);
    }

    public function store(Request $request)
    {
        try{
             $request->validate([
            'marca' => 'required|string|max:255',
            'modelo' => 'required|string|max:255',
            'estado_inicial' => 'required|in:excelente,bueno,regular,malo',
            'sistema_operativo' => 'required|string|max:255',
            'fecha_adquisicion' => 'required|date',
            'fecha_baja' => 'nullable|date|after:fecha_adquisicion',
            'sala_id' => 'required|exists:salas,id',
        ], [
            'marca.required' => 'La marca es requerida.',
            'modelo.required' => 'El modelo es requerido.',
            'estado_inicial.required' => 'El estado inicial es requerido.',
            'sistema_operativo.required' => 'El S.O. es requerida.',
            'fecha_adquisicion.required' => 'La fecha de adquisición es requerida.',
            'sala_id.required' => 'La sala es requerida.',
        ]);
         Equipo::create($request->all());

        return redirect()
        ->route('equipos.index')
        ->with('success', 'Equipo creado exitosamente.');

        }catch(ValidationException $e){
            return redirect()
            ->back()
            ->withErrors($e->errors())
            ->withInput()
            ->with('error', 'Corrige los errores del formulario.');
        }
       
       
    }

    public function edit(Equipo $equipo)
    {
        return Inertia::render('equipos/Edit', [
            'equipo' => $equipo,
            'salas' => Sala::all(),
        ]);
    }
    public function update(Request $request, Equipo $equipo)
    {
    
        $request->validate([
            'marca' => 'required|string|max:255',
            'modelo' => 'required|string|max:255',
            'estado_inicial' => 'required|in:excelente,bueno,regular,malo',
            'sistema_operativo' => 'required|string|max:255',
            'fecha_adquisicion' => 'required|date',
            'fecha_baja' => 'nullable|date|after:fecha_adquisicion',
            'sala_id' => 'required|exists:salas,id',
        ],
        [
            'marca.required' => 'La marca es requerida.',
            'modelo.required' => 'El modelo es requerido.',
            'estado_inicial.required' => 'El estado inicial es requerido.',
            'sistema_operativo.required' => 'El S.O. es requerida.',
            'fecha_adquisicion.required' => 'La fecha de adquisición es requerida.',
            'sala_id.required' => 'La sala es requerida.',
        ]);

        $equipo->update($request->all());

        return redirect()
        ->route('equipos.index')
        ->with('success', 'Equipo actualizado exitosamente.');
    }

    public function destroy(Equipo $equipo)
    {
        $equipo->delete();

        return redirect()
        ->back()
        ->with('success', 'Equipo eliminado exitosamente.');
    }
}