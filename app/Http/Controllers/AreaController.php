<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Area;
use Dotenv\Exception\ValidationException;
use Inertia\Inertia;

class AreaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $areas = Area::paginate(10);
        return Inertia::render('area/Index',[
        'areas' => $areas
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('area/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $validated = $request->validate([
                'nombre' => 'required'
            ],[
                'nombre.required' => 'El nombre es requerido'
                
            ]);
            Area::create($validated);
            return redirect()
            ->route('areas.index')
            ->with('success', 'Area creada con exito');
        }catch(ValidationException $e){

        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Area $area)
    {
        return Inertia::render('area/Edit',[
            'area' => $area
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Area $area)
    {
        try{
            $validated= $request->validate([
                'nombre' => 'required'
            ],[
                'nombre.required' => 'El nombre es requerido'
            ]);
            $area->update($validated);
            return redirect()
            ->route('areas.index')
            ->with('success', 'Area actualizada con exito');
        }catch(ValidationException $e){
            return redirect()
            ->route('areas.edit')
            ->with('error', 'Error al actualizar el area');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( Area $area)
    {
        $area->delete();
        return redirect()
        ->route('areas.index')
        ->with('success', 'Area eliminada con exito');
    }
}
