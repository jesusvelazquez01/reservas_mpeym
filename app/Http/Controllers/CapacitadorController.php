<?php

namespace App\Http\Controllers;

use App\Models\Capacitador;
use App\Models\Reserva;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
class CapacitadorController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:ver Capacitador')->only(['index']);
        $this->middleware('permission:crear Capacitador')->only(['store']);
        $this->middleware('permission:editar Capacitador')->only(['update']);
        $this->middleware('permission:eliminar Capacitador')->only(['destroy']);
    }
   
    public function index(Request $request)
    {
        $query = Capacitador::query();
        
        // Filtro por DNI
        if ($request->filled('dni')) {
            $query->where('dni', 'like', '%' . $request->dni . '%');
        }
        
        $capacitadores = $query->paginate(10)->withQueryString();
        
        return Inertia::render('capacitadores/Index', [
            'capacitadores' => $capacitadores,
            'filters' => $request->only('dni')
        ]);
    }
    
    public function create()
    {
        return Inertia::render('capacitadores/Create');
    }



    public function store(Request $request)
    {
        try{
             $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'dni' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:255',
            'correo' => 'nullable|email|max:255',
        ],[
            'nombre.required' => 'El nombre es requerido.',
            'apellido.required' => 'El apellido es requerido.',
        ]);




         // Duplicados
        $errores = [];
        if ($request->dni && Capacitador::where('dni', $request->dni)->exists()) {
            $errores['dni'] = 'Ya existe un responsable con este DNI.';
        }
        if ($request->correo && Capacitador::where('correo', $request->correo)->exists()) {
            $errores['correo'] = 'Ya existe un responsable con este correo.';
        }

        if (!empty($errores)) {
            return redirect()
                ->back()
                ->withErrors($errores)
                ->withInput()
                ->with('warning', 'Se encontraron datos duplicados.');
        }

        Capacitador::create($request->all());

        return redirect()
        ->route('capacitadores.index')
        ->with('success', 'Capacitador creado exitosamente.');

        }catch(ValidationException $e){
            return redirect()
            ->back()
            ->withErrors($e->errors())
            ->withInput()
            ->with('error', 'Corrige los errores del formulario. ');
        }
       
    }
    public function edit(Capacitador $capacitador)
    {
        
        return Inertia::render('capacitadores/Edit', [
            'capacitador' => $capacitador
        ]);
    }
    public function update(Request $request, Capacitador $capacitador)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'dni' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:255',
            'correo' => 'nullable|email|max:255',
        ]);

        // Verificar duplicados (excluyendo el registro actual)
        $errores = [];
        if ($request->dni && Capacitador::where('dni', $request->dni)->where('id', '!=', $capacitador->id)->exists()) {
            $errores['dni'] = 'Ya existe un capacitador con este DNI.';
        }
        if ($request->correo && Capacitador::where('correo', $request->correo)->where('id', '!=', $capacitador->id)->exists()) {
            $errores['correo'] = 'Ya existe un capacitador con este correo.';
        }

        if (!empty($errores)) {
            return redirect()
                ->back()
                ->withErrors($errores)
                ->withInput()
                ->with('warning', 'Se encontraron datos duplicados.');
        }

        $capacitador->update($request->all());

        return redirect()
        ->route('capacitadores.index')
        ->with('success', 'Capacitador actualizado exitosamente.');
    }

    public function destroy(Capacitador $capacitador)
    {
        try {
            // Las relaciones se eliminan automáticamente por el cascade en la migración
            $capacitador->delete();
            
            return redirect()->back()->with('success', 'Capacitador eliminado correctamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'No se puede eliminar el capacitador: ' . $e->getMessage());
        }
    }

}