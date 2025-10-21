<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sala;
use Inertia\Inertia; 
use Illuminate\Validation\ValidationException;
class SalaController extends Controller 
{
    public function __construct()
    {
        $this->middleware('permission:ver Sala')->only(['index']);
        $this->middleware('permission:crear Sala')->only(['store']);
        $this->middleware('permission:editar Sala')->only(['update']);
        $this->middleware('permission:eliminar Sala')->only(['destroy']);
    }
    
    public function index()
    {
        
        return Inertia::render('salas/Index', [
            'salas' => Sala::all(),
        ]);
    }
    public function create(){
        return Inertia::render('salas/Create');
    }

    public function store(Request $request)
    {
        try{
             $request->validate([
            'nombre' => 'required|string|max:255',
            'capacidad' => 'required|integer|min:1',
            'ubicacion' => 'required|string|max:255',
        ],[
            'nombre.required' => 'El nombre es requerido',
            'capacidad.required' => 'La capacidad es requerida',
            'ubicacion.required' => 'La ubicación es requerida',
            'capacidad.integer' => 'La capacidad debe ser un número entero',
            'capacidad.min' => 'La capacidad debe ser al menos 1',
        ]);

        Sala::create($request->all());

        return redirect()
        ->route('salas.index')
        ->with('success', 'Sala creado exitosamente.');

        }catch(ValidationException $e){
            return redirect()
            ->back()
            ->withErrors($e->errors())
            ->withInput()
            ->with('error', 'Corrige los errores del formulario.');
        }
       
    }

    public function edit(Sala $sala)
    {
        return Inertia::render('salas/Edit', [
            'salas' => $sala,
        ]);
    }



    public function update(Request $request, Sala $sala)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'capacidad' => 'required|integer|min:1',
            'ubicacion' => 'required|string|max:255',
        ],[
             'nombre.required' => 'El nombre es requerido',
            'capacidad.required' => 'La capacidad es requerida',
            'ubicacion.required' => 'La ubicación es requerida',
            'capacidad.integer' => 'La capacidad debe ser un número entero',
            'capacidad.min' => 'La capacidad debe ser al menos 1',
        ]);

        $sala->update($request->all());

        return redirect()
        ->route('salas.index')
        ->with('success', 'Sala editada exitosamente.');;
    }

    public function destroy(Sala $sala)
    {
        $sala->delete();

        return redirect()->route('salas.index')
        ->with('success', 'Sala eliminado exitosamente.');;
    }
}