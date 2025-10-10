import * as React from "react"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import {  BreadcrumbItem, PageProps } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useState } from "react";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Salas',
        href: '/salas',
    },
    {
        title: 'Alta de la Sala',
        href: '',
    },
];
export default function Create() {
    const [submitAction, setSubmitAction] = React.useState<'save' | 'saveAndNew'>('save');
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        capacidad: '',
        ubicacion: '',
    });
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('salas.store'));
    };

    const handleCancel = () => {
        if (data.nombre || data.capacidad || data.ubicacion) {
            setShowCancelDialog(true);
        } else {
            router.visit(route('salas.index'));
        }
    };
    const confirmCancel = () => {
            router.visit(route('salas.index'));
        };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Alta de Sala" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Alta de Sala</h1>
                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>Información de la Sala</CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            
                            {/* Nombre */}
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="nombre">Nombre de la Sala</Label>
                                <Input
                                    id="nombre"
                                    placeholder="Ej: Sala de Conferencias"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    disabled={processing}
                                />
                                {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
                            </div>

                            {/* Resolución */}
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="resolucion">Capacidad</Label>
                                <Input
                                    id="resolucion"
                                    placeholder="Ej: 20"
                                    value={data.capacidad}
                                    onChange={(e) => setData('capacidad', e.target.value)}
                                    disabled={processing}
                                />
                                {errors.capacidad && <p className="text-sm text-red-500">{errors.capacidad}</p>}
                            </div>
                            {/* Ubicación */}
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="nombre">Ubicacion de la Sala</Label>
                                <Input
                                    id="ubicacion"
                                    placeholder="Ej: Piso 1, Edificio A"
                                    value={data.ubicacion}
                                    onChange={(e) => setData('ubicacion', e.target.value)}
                                    disabled={processing}
                                />
                                {errors.ubicacion && <p className="text-sm text-red-500">{errors.ubicacion}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                Cancelar
                            </Button>
                            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tienes datos sin guardar. ¿Estás seguro que deseas salir sin guardar los cambios?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Continuar cargando</AlertDialogCancel>
                                        <AlertDialogAction onClick={confirmCancel}>
                                            Descartar cambios
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Guardando...
                                    </div>
                                ) : (
                                    'Guardar'
                                )}
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Guardando...
                                    </div>
                                ) : (
                                    'Guardar y Crear Otro'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}