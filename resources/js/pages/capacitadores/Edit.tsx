import * as React from "react"
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

import { PageProps, type BreadcrumbItem, type Capacitador } from '@/types';
import { router } from '@inertiajs/react';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { useState } from "react";

// Tipos para validación
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
    {
        title: 'Capacitadores',
        href: '/capacitadores',
    },
    {
        title: 'Editar Capacitador',
        href: '',
    },
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

    // Estado para validaciones en tiempo real
    const [validationState, setValidationState] = React.useState<ValidationState>({
        dni: validateDni(capacitador?.dni || ''),
        correo: validateEmail(capacitador?.correo || ''),
    });

    // Funciones de formateo
    const formatDni = React.useCallback((value: string): string => {
        const numbers = value.replace(/\D/g, '');
        const limited = numbers.substring(0, 8);
        
        if (limited.length <= 3) {
            return limited;
        } else if (limited.length <= 6) {
            return `${limited.substring(0, 3)}.${limited.substring(3)}`;
        } else {
            return `${limited.substring(0, 3)}.${limited.substring(3, 6)}.${limited.substring(6)}`;
        }
    }, []);

    const formatPhone = React.useCallback((value: string): string => {
        const numbers = value.replace(/\D/g, '');
        const limited = numbers.substring(0, 10);
        
        if (limited.length <= 3) {
            return limited;
        } else if (limited.length <= 6) {
            return `${limited.substring(0, 3)}-${limited.substring(3)}`;
        } else {
            return `${limited.substring(0, 3)}-${limited.substring(3, 6)}-${limited.substring(6)}`;
        }
    }, []);

    // Validaciones
    function validateDni(dni: string): ValidationResult {
        const cleanDni = dni.replace(/\D/g, '');
        
        if (cleanDni.length === 0) {
            return { isValid: false, message: '', type: 'info' };
        }
        
        if (cleanDni.length < 7) {
            return {
                isValid: false,
                message: 'DNI debe tener entre 7 y 8 dígitos',
                type: 'warning'
            };
        }
        
        if (cleanDni.length >= 7 && cleanDni.length <= 8) {
            return {
                isValid: true,
                message: 'DNI válido',
                type: 'success'
            };
        }
        
        return { isValid: false, message: 'DNI inválido', type: 'error' };
    }

    function validateEmail(email: string): ValidationResult {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email.length === 0) {
            return { isValid: false, message: '', type: 'info' };
        }
        
        const isValid = emailRegex.test(email);
        return {
            isValid,
            message: isValid ? 'Email válido' : 'Formato de email inválido',
            type: isValid ? 'success' : 'error'
        };
    }

    // Manejadores
    const handleDniChange = React.useCallback((value: string) => {
        const formatted = formatDni(value);
        const validation = validateDni(formatted);
        
        setData('dni', formatted);
        setValidationState(prev => ({ ...prev, dni: validation }));
    }, [formatDni, setData]);

    const handlePhoneChange = React.useCallback((value: string) => {
        const formatted = formatPhone(value);
        setData('telefono', formatted);
    }, [formatPhone, setData]);

    const handleEmailChange = React.useCallback((value: string) => {
        const validation = validateEmail(value);
        setData('correo', value);
        setValidationState(prev => ({ ...prev, correo: validation }));
    }, [setData]);

    // Funciones auxiliares de UI
    const getValidationIcon = (validation: ValidationResult | null) => {
        if (!validation || !validation.message) return null;
        
        const iconClass = "h-4 w-4";
        
        switch (validation.type) {
            case 'success':
                return <CheckCircle className={`${iconClass} text-green-500`} />;
            case 'error':
                return <XCircle className={`${iconClass} text-red-500`} />;
            case 'warning':
                return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
            case 'info':
                return <Clock className={`${iconClass} text-blue-500`} />;
            default:
                return null;
        }
    };

    const getInputClassName = (validation: ValidationResult | null) => {
        if (!validation || !validation.message) return '';
        
        switch (validation.type) {
            case 'success':
                return 'border-green-500 focus:border-green-500';
            case 'error':
                return 'border-red-500 focus:border-red-500';
            case 'warning':
                return 'border-yellow-500 focus:border-yellow-500';
            default:
                return '';
        }
    };

    const getMessageClassName = (validation: ValidationResult | null) => {
        if (!validation || !validation.message) return '';
        
        switch (validation.type) {
            case 'success':
                return 'text-green-600';
            case 'error':
                return 'text-red-600';
            case 'warning':
                return 'text-yellow-600';
            case 'info':
                return 'text-blue-600';
            default:
                return '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('capacitadores.update', { capacitador: capacitador.id }));
    };
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const handleCancel = () => {
        if (JSON.stringify(data) !== JSON.stringify({
            nombre: capacitador?.nombre || '',
            apellido: capacitador?.apellido || '',
            dni: capacitador?.dni || '',
            telefono: capacitador?.telefono || '',
            correo: capacitador?.correo || '',
        })) {
           setShowCancelDialog(true);
        } else {
            router.visit(route('capacitadores.index'));
        }
    };
 const confirmCancel = () => {
            router.visit(route('capacitadores.index'));
        };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Capacitador" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Editar Capacitador</h1>
                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>Información del Capacitador</CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Nombre */}
                            <div className="flex flex-col gap-1">
                                <Label>Nombre</Label>
                                <Input
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="Nombre del Capacitador"
                                    autoFocus
                                />
                                {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
                            </div>

                            {/* Apellido */}
                            <div className="flex flex-col gap-1">
                                <Label>Apellido</Label>
                                <Input
                                    value={data.apellido}
                                    onChange={(e) => setData('apellido', e.target.value)}
                                    placeholder="Apellido del Capacitador"
                                   
                                />
                                {errors.apellido && <p className="text-sm text-red-500">{errors.apellido}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* DNI con formateo automático */}
                            <div className="flex flex-col gap-1">
                                <Label>D.N.I</Label>
                                <div className="relative">
                                    <Input
                                        value={data.dni}
                                        onChange={(e) => handleDniChange(e.target.value)}
                                        placeholder="Ejemplo: 43.698.145"
                                        maxLength={10}
                                        className={`pr-10 ${getInputClassName(validationState.dni)}`}
                                       
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        {getValidationIcon(validationState.dni)}
                                    </div>
                                </div>
                                {validationState.dni?.message && (
                                    <div className="flex items-center gap-2 text-sm">
                                        {getValidationIcon(validationState.dni)}
                                        <span className={getMessageClassName(validationState.dni)}>
                                            {validationState.dni.message}
                                        </span>
                                    </div>
                                )}
                                {errors.dni && <p className="text-sm text-red-500">{errors.dni}</p>}
                            </div>

                            {/* Teléfono con formateo */}
                            <div className="flex flex-col gap-1">
                                <Label>Teléfono</Label>
                                <Input
                                    value={data.telefono}
                                    onChange={(e) => handlePhoneChange(e.target.value)}
                                    placeholder="Ejemplo: 388-123-4567"
                                    maxLength={12}
                                   
                                />
                                {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
                                <p className="text-xs text-muted-foreground">Formato: XXX-XXX-XXXX</p>
                            </div>
                        </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Email con validación */}
                        <div className="flex flex-col gap-1">
                            <Label>Correo</Label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    value={data.correo}
                                    onChange={(e) => handleEmailChange(e.target.value)}
                                    className={`pr-10 ${getInputClassName(validationState.correo)}`}
                                    placeholder="correo@ejemplo.com"
                                    
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    {getValidationIcon(validationState.correo)}
                                </div>
                            </div>
                            {validationState.correo?.message && (
                                <div className="flex items-center gap-2 text-sm">
                                    {getValidationIcon(validationState.correo)}
                                    <span className={getMessageClassName(validationState.correo)}>
                                        {validationState.correo.message}
                                    </span>
                                </div>
                            )}
                            {errors.correo && <p className="text-sm text-red-500">{errors.correo}</p>}
                        </div>
                    </div>

                    </CardContent>
                                    <CardFooter className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={processing}
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
                                                    Actualizando...
                                                </div>
                                            ) : (
                                                'Actualizar'
                                            )}
                                        </Button>
                                    </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}