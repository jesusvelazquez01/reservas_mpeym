<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Responsable;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
class ResponsableController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:ver Responsable')->only(['index']);
        $this->middleware('permission:crear Responsable')->only(['store']);
        $this->middleware('permission:editar Responsable')->only(['update']);
        $this->middleware('permission:eliminar Responsable')->only(['destroy']);
    }
  
    public function index(Request $request)
    {
        $query = Responsable::query();
        
        // Filtro por DNI
        if ($request->filled('dni')) {
            $query->where('dni', 'like', '%' . $request->dni . '%');
        }
        
        $responsables = $query->paginate(10)->withQueryString();
        
        return Inertia::render('responsables/Index', [
            'responsables' => $responsables,
            'filters' => $request->only('dni')
        ]);
    }
    public function create()
    {
        return Inertia::render('responsables/Create');

    }




 public function store(Request $request)
{
    try {
        // Validación
        $request->validate([
            'nombre'   => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'dni'      => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:255',
            'correo'   => 'nullable|email|max:255',
            'area'     => 'required|string|max:255',
        ], [
            'nombre.required'   => 'El nombre es requerido.',
            'apellido.required' => 'El apellido es requerido.',
            'area.required'     => 'El área es requerida.',
        ]);

        // Duplicados
        $errores = [];
        if ($request->dni && Responsable::where('dni', $request->dni)->exists()) {
            $errores['dni'] = 'Ya existe un responsable con este DNI.';
        }
        if ($request->correo && Responsable::where('correo', $request->correo)->exists()) {
            $errores['correo'] = 'Ya existe un responsable con este correo.';
        }

        if (!empty($errores)) {
            return redirect()
                ->back()
                ->withErrors($errores)
                ->withInput()
                ->with('warning', 'Se encontraron datos duplicados.');
        }

        // Crear Responsable (sin submitAction)
        Responsable::create($request->except('submitAction'));
        return redirect()
            ->route('responsables.index')
            ->with('success', 'Responsable creado exitosamente.');
            
    } catch (ValidationException $e) {
        return redirect()
            ->back()
            ->withErrors($e->errors())
            ->withInput()
            ->with('error', 'Corrige los errores del formulario.');
    } catch (\Exception $e) {
        return redirect()
            ->back()
            ->withErrors(['error' => 'Error inesperado: ' . $e->getMessage()])
            ->withInput()
            ->with('error', 'Ocurrió un error inesperado.');
    }
}

    public function edit(string $id)
    {
        $responsable = Responsable::findOrFail($id);
        return Inertia::render('responsables/Edit', [
            'responsable' => $responsable
        ]);
    }

    public function update(Request $request, Responsable $responsable)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'dni' => 'nullable|string|max:255',
            'telefono'=>'nullable|string|max:255',
            'correo'=>'nullable|string|max:255',
            'area'=>'required|string|max:255',
        ]);

        $responsable->update($request->all());

        return redirect()->route('responsables.index')
        ->with('success', 'Responsable editado exitosamente.');;
    }

    public function destroy(Responsable $responsable)
    {
        $responsable->delete();
        return redirect()->route('responsables.index')
        ->with('success', 'Responsable eliminado exitosamente.');;
    }
}
