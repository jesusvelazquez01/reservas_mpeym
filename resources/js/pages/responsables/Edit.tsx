import * as React from "react";
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { area } from "@/constants/estados";
import { cn } from "@/lib/utils";
import {
  Loader2, Check, ChevronsUpDown, CheckCircle, XCircle, AlertTriangle, Clock, UserCog,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { type BreadcrumbItem, type Responsable, type PageProps } from "@/types";

// Tipos
interface ValidationResult {
  isValid: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface ValidationState {
  [key: string]: ValidationResult | null;
}

interface EditProps extends PageProps {
  responsable: Responsable;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Responsables", href: "/responsables" },
  { title: "Editar Responsable", href: "" },
];

export default function Edit() {
  const { responsable } = usePage<EditProps>().props;
  const { data, setData, put, processing, errors } = useForm({
    nombre: responsable.nombre || "",
    apellido: responsable.apellido || "",
    dni: responsable.dni || "",
    telefono: responsable.telefono || "",
    correo: responsable.correo || "",
    area: responsable.area || "",
  });

  const [areaOpen, setAreaOpen] = React.useState(false);
  const [validationState, setValidationState] = React.useState<ValidationState>({});
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);

  // ==== Formateo y validaciones ====
  const formatDni = (value: string) => {
    const numbers = value.replace(/\D/g, "").substring(0, 8);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "").substring(0, 10);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  };

  const validateDni = (dni: string): ValidationResult => {
    const clean = dni.replace(/\D/g, "");
    if (!clean) return { isValid: false, message: "", type: "info" };
    if (clean.length < 7)
      return { isValid: false, message: "DNI debe tener entre 7 y 8 dígitos", type: "warning" };
    if (clean.length <= 8) return { isValid: true, message: "DNI válido", type: "success" };
    return { isValid: false, message: "DNI inválido", type: "error" };
  };

  const validateEmail = (email: string): ValidationResult => {
    if (!email) return { isValid: false, message: "", type: "info" };
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return {
      isValid,
      message: isValid ? "Email válido" : "Formato inválido",
      type: isValid ? "success" : "error",
    };
  };

  // ==== Handlers ====
  const handleDniChange = (value: string) => {
    const formatted = formatDni(value);
    setData("dni", formatted);
    setValidationState((p) => ({ ...p, dni: validateDni(formatted) }));
  };

  const handlePhoneChange = (value: string) => setData("telefono", formatPhone(value));

  const handleEmailChange = (value: string) => {
    setData("correo", value);
    setValidationState((p) => ({ ...p, correo: validateEmail(value) }));
  };

  const getValidationIcon = (v: ValidationResult | null) => {
    if (!v?.message) return null;
    const cls = "h-4 w-4";
    switch (v.type) {
      case "success":
        return <CheckCircle className={`${cls} text-green-500`} />;
      case "error":
        return <XCircle className={`${cls} text-red-500`} />;
      case "warning":
        return <AlertTriangle className={`${cls} text-yellow-500`} />;
      case "info":
        return <Clock className={`${cls} text-blue-500`} />;
      default:
        return null;
    }
  };

  const getInputClass = (v: ValidationResult | null) => {
    if (!v?.message) return "";
    switch (v.type) {
      case "success":
        return "border-green-500 focus:border-green-500";
      case "error":
        return "border-red-500 focus:border-red-500";
      case "warning":
        return "border-yellow-500 focus:border-yellow-500";
      default:
        return "";
    }
  };

  const getMessageClass = (v: ValidationResult | null) => {
    if (!v?.message) return "";
    switch (v.type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      case "info":
        return "text-blue-600";
      default:
        return "";
    }
  };

  // ==== Envío y cancelación ====
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("responsables.update", responsable.id));
  };

  const handleCancel = () => {
    if (JSON.stringify(data) !== JSON.stringify(responsable)) {
      setShowCancelDialog(true);
    } else {
      router.visit(route("responsables.index"));
    }
  };

  const confirmCancel = () => router.visit(route("responsables.index"));

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Responsable" />
      <div className="min-h-screen bg-gradient-to-br p-3">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Encabezado */}
          <div className="text-align-left">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
              <UserCog className="h-6 w-6 text-orange-400" />
              Editar Responsable
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Modifica los datos del responsable en el sistema.
            </p>
          </div>

          {/* Card principal */}
          <Card className="shadow-lg border-2 border-orange-100 dark:border-orange-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <CheckCircle className="h-5 w-5 text-orange-400" />
                Información del Responsable
              </CardTitle>
              <CardDescription>
                Completa todos los campos obligatorios para actualizar el responsable.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input
                    value={data.nombre}
                    onChange={(e) => setData("nombre", e.target.value)}
                    placeholder="Nombre del Responsable"
                    disabled={processing}
                  />
                  {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Apellido</Label>
                  <Input
                    value={data.apellido}
                    onChange={(e) => setData("apellido", e.target.value)}
                    placeholder="Apellido del Responsable"
                    disabled={processing}
                  />
                  {errors.apellido && <p className="text-sm text-red-500">{errors.apellido}</p>}
                </div>
              </div>

              {/* DNI y Teléfono */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>D.N.I</Label>
                  <div className="relative">
                    <Input
                      value={data.dni}
                      onChange={(e) => handleDniChange(e.target.value)}
                      placeholder="43.698.145"
                      maxLength={10}
                      className={`pr-10 ${getInputClass(validationState.dni)}`}
                      disabled={processing}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {getValidationIcon(validationState.dni)}
                    </div>
                  </div>
                  {validationState.dni?.message && (
                    <p
                      className={`flex items-center gap-1 text-sm ${getMessageClass(
                        validationState.dni
                      )}`}
                    >
                      {getValidationIcon(validationState.dni)} {validationState.dni.message}
                    </p>
                  )}
                  {errors.dni && <p className="text-sm text-red-500">{errors.dni}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input
                    value={data.telefono}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="388-547-4266"
                    disabled={processing}
                  />
                  <p className="text-xs text-muted-foreground">Formato: XXX-XXX-XXXX</p>
                  {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
                </div>
              </div>

              {/* Correo y Área */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Correo</Label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={data.correo}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className={`pr-10 ${getInputClass(validationState.correo)}`}
                      disabled={processing}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {getValidationIcon(validationState.correo)}
                    </div>
                  </div>
                  {validationState.correo?.message && (
                    <p
                      className={`flex items-center gap-1 text-sm ${getMessageClass(
                        validationState.correo
                      )}`}
                    >
                      {getValidationIcon(validationState.correo)} {validationState.correo.message}
                    </p>
                  )}
                  {errors.correo && <p className="text-sm text-red-500">{errors.correo}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Área</Label>
                  <Popover open={areaOpen} onOpenChange={setAreaOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={areaOpen}
                        className="w-full justify-between"
                      >
                        {data.area
                          ? area.find((a) => a.value === data.area)?.label
                          : "Selecciona un área..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Busca un área..." />
                        <CommandList>
                          <CommandEmpty>No hay áreas encontradas.</CommandEmpty>
                          <CommandGroup>
                            {area.map((a) => (
                              <CommandItem
                                key={a.value}
                                value={a.value}
                                onSelect={(v) => {
                                  setData("area", v);
                                  setAreaOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    data.area === a.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {a.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.area && <p className="text-sm text-red-500">{errors.area}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <Card className="shadow-lg border-2 mt-4">
            <CardContent className="p-6 flex flex-wrap gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="gap-2 bg-white"
              >
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

              <Button
                type="submit"
                disabled={processing}
                className="gap-2"
                onClick={handleSubmit}
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
                  </div>
                ) : (
                  "Actualizar"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}


