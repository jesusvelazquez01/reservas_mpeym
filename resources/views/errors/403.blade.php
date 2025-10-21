@extends('errors::minimal')

@section('title', __('Acceso Denegado'))
@section('code', '403')
@section('message')
    <div class="max-w-xl mx-auto text-center">
        <p class="text-lg mb-4">
            {{ __($exception->getMessage() ?: 'No tienes los permisos necesarios.') }}
        </p>
        <p style="margin-top: 16px; font-size: 13px; opacity: 0.8;">
                         Si crees que deberías tener acceso, contacta con el administrador.
            </p>
       
    </div>
@endsection
