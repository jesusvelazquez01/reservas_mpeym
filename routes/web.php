<?php

use App\Http\Controllers\ReservaController;
use App\Http\Controllers\ReservaAdminController;
use App\Http\Controllers\EquipoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SalaController;
use App\Http\Controllers\ControlUsoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\ResponsableController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReporteEquipoController;
use App\Http\Controllers\HistorialEquipoController;
use App\Http\Controllers\CapacitadorController;
use App\Http\Controllers\AreaController;
// routes/web.php
Route::get('/debug', function () {
    return [
        'is_secure' => request()->isSecure(),
        'url' => url('/'),
        'scheme' => request()->getScheme(),
        'app_url' => config('app.url'),
    ];
});

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/calendario', [DashboardController::class, 'index'])
        ->name('dashboard');
});
Route::middleware(['auth'])->group(function () {
    Route::get('/salas/{sala}/reservas', [ReservaController::class, 'porSala'])->name('reservas.porSala');
//Responsables
Route::resource('responsables', ResponsableController::class);
// RUTAS DE SALAS
   Route::resource('salas', SalaController::class);
// RUTAS DE RESERVAS
 Route::resource('reservas', ReservaController::class);
// Rutas de administración de reservas
    Route::get('/admin/reservas', [ReservaAdminController::class, 'index'])->name('reservas.admin.index');
//RUTAS DE EQUIPOS
Route::resource('equipos', EquipoController::class);
//RUTAS DE CAPACITADORES
Route::resource('capacitadores', CapacitadorController::class)->parameters([
    'capacitadores' => 'capacitador'
]);
//RUTAS DE CONTROL USO
Route::resource('control-uso', ControlUsoController::class)->parameters([
    'control-uso' => 'controlUso'
]);
//RUTAS DE AREAS
Route::resource('areas', AreaController::class);
//REPORTE DE USO DE SALAS Y EQUIPOS
 Route::get('/admin/reportes-uso', [ReporteController::class, 'usoSalas'])->name('reporte.usoSalas');
    Route::get('/admin/reportes-equipos', [ReporteEquipoController::class, 'usoEquipos'])->name('reporte.usoEquipos');
    Route::get('/admin/historial-equipos', [HistorialEquipoController::class, 'index'])->name('historial.equipos');
});
Route::middleware(['auth','verified','role:admin'])->group(function () {
    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');

    //permisos
    Route::get('/users/roles', [UserRoleController::class,'index'])->name('usuarios.roles.index');
    Route::put('/users/{user}/roles', [UserRoleController::class,'update'])->name('usuarios.roles.update');


    //usuarios
    Route::resource('users', UserController::class);

    // Registro habilitado solo para admin
   //Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
  // Route::post('/register', [RegisteredUserController::class, 'store']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
