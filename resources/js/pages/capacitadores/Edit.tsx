import * as React from "react";
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Clock, UserPlus, HelpCircle } from 'lucide-react';
import { PageProps, type BreadcrumbItem, type Capacitador } from '@/types';
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Tipos de validación
interface ValidationResult {
    isValid: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

interface ValidationState {
    [key: string]: ValidationResult | null;
}

interface EditProps extends PageProps {
    capacitador: Capacitador;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Capacitadores', href: '/capacitadores' },
    { title: 'Editar Capacitador', href: '' },
];

export default function Edit() {
    const { capacitador } = usePage<EditProps>().props;
    const { data, setData, put, processing, errors } = useForm({
        nombre: capacitador?.nombre || '',
        apellido: capacitador?.apellido || '',
        dni: capacitador?.dni || '',
        telefono: capacitador?.telefono || '',
        correo: capacitador?.correo || '',
    });

    const [validationState, setValidationState] = useState<ValidationState>({
        dni: validateDni(capacitador?.dni || ''),
        correo: validateEmail(capacitador?.correo || ''),
    });
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    // Formateo
    const formatDni = React.useCallback((value: string) => {
        const numbers = value.replace(/\D/g, '').substring(0,8);
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0,3)}.${numbers.slice(3)}`;
        return `${numbers.slice(0,3)}.${numbers.slice(3,6)}.${numbers.slice(6)}`;
    }, []);

    const formatPhone = React.useCallback((value: string) => {
        const numbers = value.replace(/\D/g, '').substring(0,10);
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0,3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0,3)}-${numbers.slice(3,6)}-${numbers.slice(6)}`;
    }, []);

    // Validaciones
    function validateDni(dni: string): ValidationResult {
        const clean = dni.replace(/\D/g, '');
        if (!clean) return { isValid:false, message:'', type:'info' };
        if (clean.length < 7) return { isValid:false, message:'DNI debe tener entre 7 y 8 dígitos', type:'warning' };
        if (clean.length <= 8) return { isValid:true, message:'DNI válido', type:'success' };
        return { isValid:false, message:'DNI inválido', type:'error' };
    }

    function validateEmail(email: string): ValidationResult {
        if (!email) return { isValid:false, message:'', type:'info' };
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        return { isValid, message: isValid ? 'Email válido' : 'Formato inválido', type: isValid ? 'success':'error' };
    }

    // Handlers
    const handleDniChange = React.useCallback((value: string) => {
        const formatted = formatDni(value);
        setData('dni', formatted);
        setValidationState(prev => ({ ...prev, dni: validateDni(formatted) }));
    }, [formatDni, setData]);

    const handlePhoneChange = React.useCallback((value: string) => {
        setData('telefono', formatPhone(value));
    }, [formatPhone, setData]);

    const handleEmailChange = React.useCallback((value: string) => {
        setData('correo', value);
        setValidationState(prev => ({ ...prev, correo: validateEmail(value) }));
    }, [setData]);

    const getValidationIcon = (v: ValidationResult | null) => {
        if (!v?.message) return null;
        const cls = "h-4 w-4";
        switch(v.type){
            case 'success': return <CheckCircle className={`${cls} text-green-500`} />;
            case 'error': return <XCircle className={`${cls} text-red-500`} />;
            case 'warning': return <AlertTriangle className={`${cls} text-yellow-500`} />;
            case 'info': return <Clock className={`${cls} text-blue-500`} />;
        }
    };

    const getInputClass = (v: ValidationResult | null) => {
        if (!v?.message) return '';
        switch(v.type){
            case 'success': return 'border-green-500 focus:border-green-500';
            case 'error': return 'border-red-500 focus:border-red-500';
            case 'warning': return 'border-yellow-500 focus:border-yellow-500';
            default: return '';
        }
    };

    const getMessageClass = (v: ValidationResult | null) => {
        if (!v?.message) return '';
        switch(v.type){
            case 'success': return 'text-green-600';
            case 'error': return 'text-red-600';
            case 'warning': return 'text-yellow-600';
            case 'info': return 'text-blue-600';
            default: return '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); put(route('capacitadores.update', { capacitador: capacitador.id })); };
    const handleCancel = () => {
    if (JSON.stringify(data) !== JSON.stringify(capacitador)) {
          setShowCancelDialog(true);
        } else {
          router.visit(route("capacitadores.index"));
        }
    };
    const confirmCancel = () => router.visit(route('capacitadores.index'));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Capacitador" />
            <div className="min-h-screen bg-gradient-to-br p-3">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="text-align-left">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                                    <UserPlus className="h-6 w-6 text-orange-400" />
                                    Editar Capacitador
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Modifica los datos del capacitador en el sistema.
                                </p>
                            </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-full">
                                <HelpCircle className="h-5 w-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Módulo de Edición</DialogTitle>
                                <DialogDescription className="space-y-2">
                                <p>
                                    Este módulo te permite editar al capacitador seleccionado del ministerio.
                                </p>
                                <p className="font-semibold">Edición correcta del capacitador:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Nombre: Elio</li>
                                    <li>Apellido: Gonzalez</li>
                                    <li>DNI: 11.111.111</li>
                                    <li>Teléfono: 388-547-4266</li>
                                    <li>Correo: elio.huanca@example.com</li>
                                </ul>
                                <p className="font-semibold">
                                    Una vez completada la edición, presiona el botón "Actualizar" para registrar los nuevos datos en el sistema.
                                </p>
                                <p>
                                    <span className="font-semibold">Nota:</span> Los campos marcados con <span className="text-red-500">*</span> son obligatorios.
                                </p>
                                </DialogDescription>
                            </DialogContent>
                        </Dialog>
                         </div>
                    </div>

                    <Card className="shadow-lg border-2 border-orange-100 dark:border-orange-900">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-400">
                                <CheckCircle className="h-5 w-5 text-orange-400" />
                                Información del Capacitador
                            </CardTitle>
                            <CardDescription>
                                Completa todos los campos obligatorios para actualizar el capacitador.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nombre */}
                                <div className="space-y-2">
                                    <Label>Nombre <span className="text-red-500">*</span></Label>
                                    <Input value={data.nombre} onChange={e => setData('nombre', e.target.value)} placeholder="Nombre del Capacitador" disabled={processing}/>
                                    {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
                                </div>
                                {/* Apellido */}
                                <div className="space-y-2">
                                    <Label>Apellido <span className="text-red-500">*</span></Label>
                                    <Input value={data.apellido} onChange={e => setData('apellido', e.target.value)} placeholder="Apellido del Capacitador" disabled={processing}/>
                                    {errors.apellido && <p className="text-sm text-red-500">{errors.apellido}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* DNI */}
                                <div className="space-y-2">
                                    <Label>D.N.I</Label>
                                    <div className="relative">
                                        <Input value={data.dni} onChange={e => handleDniChange(e.target.value)} placeholder="43.698.145" maxLength={10} className={`pr-10 ${getInputClass(validationState.dni)}`} disabled={processing}/>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">{getValidationIcon(validationState.dni)}</div>
                                    </div>
                                    {validationState.dni?.message && <p className={`flex items-center gap-1 text-sm ${getMessageClass(validationState.dni)}`}>{getValidationIcon(validationState.dni)} {validationState.dni.message}</p>}
                                    {errors.dni && <p className="text-sm text-red-500">{errors.dni}</p>}
                                </div>

                                {/* Teléfono */}
                                <div className="space-y-2">
                                    <Label>Teléfono</Label>
                                    <Input value={data.telefono} onChange={e => handlePhoneChange(e.target.value)} placeholder="388-547-4266" disabled={processing}/>
                                    <p className="text-xs text-muted-foreground">Formato: XXX-XXX-XXXX</p>
                                    {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Correo */}
                                <div className="space-y-2">
                                    <Label>Correo</Label>
                                    <div className="relative">
                                        <Input type="email" value={data.correo} onChange={e => handleEmailChange(e.target.value)} placeholder="correo@ejemplo.com" className={`pr-10 ${getInputClass(validationState.correo)}`} disabled={processing}/>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">{getValidationIcon(validationState.correo)}</div>
                                    </div>
                                    {validationState.correo?.message && <p className={`flex items-center gap-1 text-sm ${getMessageClass(validationState.correo)}`}>{getValidationIcon(validationState.correo)} {validationState.correo.message}</p>}
                                    {errors.correo && <p className="text-sm text-red-500">{errors.correo}</p>}
                                </div>
                            </div>
                        </CardContent>

                    
                    </Card>
                       {/* Botones de acción */}
                              <Card className="shadow-lg border-2 mt-4">
                                <CardContent className="p-6 flex flex-wrap gap-3 justify-end">
                                  <Button type="button" variant="outline" onClick={handleCancel} className="gap-2 bg-white">
                                    Cancelar
                                  </Button>
                    
                                  <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Tienes datos sin guardar. ¿Deseas salir sin guardar los cambios?
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Seguir editando</AlertDialogCancel>
                                        <AlertDialogAction onClick={confirmCancel}>
                                          Descartar
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                    
                                  <Button type="submit" disabled={processing} className="gap-2" onClick={handleSubmit}>
                                    {processing ? (
                                      <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
                                      </div>
                                    ) : (
                                      'Actualizar'
                                    )}
                                  </Button>
                                </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
