import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tantml:react-table';
import { DataTable } from '@/components/ui/data-table';
import {
    type BreadcrumbItem,
    type Reserva,
    type Sala,
    type PaginatedData,
} from '@/types';
import {
    CalendarCheck,
    HelpCircle,
    DoorOpen,
    Building2,
    Users,
    Clock,
    FileText,
    Laptop2,
    GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Props {
    salas: Sala[];
    reservas: PaginatedData<Reserva>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Reservas',
        href: '/admin/reservas',
    },
];

export default function ReservasAdmin({ reservas }: Props) {
    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, undefined, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    const columns: ColumnDef<Reserva>[] = [
        {
            accessorKey: 'sala.nombre',
            header: 'Sala',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <DoorOpen className="h-4 w-4 text-orange-400" />
                    <span className="font-medium">{row.original.sala?.nombre}</span>
                </div>
            ),
        },
        {
            accessorKey: 'entidad',
            header: 'Área',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-orange-400" />
                    <span className="text-sm">{row.original.entidad}</span>
                </div>
            ),
        },
        {
            accessorKey: 'responsable',
            header: 'Jefe de Área',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-400" />
                    <span className="text-sm font-medium">
                        {row.original.responsable}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'capacitadores',
            header: 'Capacitadores',
            cell: ({ row }) => {
                const capacitadores =
                    row.original.capacitadores
                        ?.map((c) => `${c.nombre} ${c.apellido}`)
                        .join(', ') || 'Sin capacitadores';
                return (
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-blue-600 dark:text-blue-400">
                            {capacitadores}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'fecha',
            header: 'Fecha',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-orange-400" />
                    <span className="text-sm">{row.original.fecha}</span>
                </div>
            ),
        },
        {
            accessorKey: 'hora_inicio',
            header: 'Hora Inicio',
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-green-500" />
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {row.original.hora_inicio}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'hora_fin',
            header: 'Hora Fin',
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-red-500" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                        {row.original.hora_fin}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'cantidad_equipos',
            header: 'Equipos',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Laptop2 className="h-4 w-4 text-purple-400" />
                    <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
                    >
                        {row.original.cantidad_equipos || 0}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: 'motivo',
            header: 'Motivo',
            cell: ({ row }) => (
                <div className="max-w-xs">
                    {row.original.motivo ? (
                        <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3 text-gray-400" />
                            <p
                                className="text-sm text-gray-600 dark:text-gray-400 truncate"
                                title={row.original.motivo}
                            >
                                {row.original.motivo}
                            </p>
                        </div>
                    ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">
                            Sin motivo
                        </span>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Reservas" />

            <div className="min-h-screen bg-gradient-to-br p-3">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header principal */}
                    <div className="text-align-left">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                                    <CalendarCheck className="h-6 w-6 text-orange-400" />
                                    Gestión de Reservas
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Consulta todas las reservas realizadas por los usuarios del
                                    sistema.
                                </p>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full"
                                    >
                                        <HelpCircle className="h-5 w-5" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>
                                        ¿Qué es la Gestión de Reservas?
                                    </DialogTitle>
                                    <DialogDescription className="space-y-2">
                                        <p>
                                            Este módulo permite a los administradores consultar
                                            todas las reservas de salas y equipos realizadas en el
                                            sistema.
                                        </p>
                                        <p className="font-semibold">Información visible:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Sala reservada y área solicitante</li>
                                            <li>Responsable y capacitadores asignados</li>
                                            <li>Fecha, horario y duración</li>
                                            <li>Cantidad de equipos solicitados</li>
                                            <li>Motivo de la reserva</li>
                                        </ul>
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Card principal */}
                    <Card className="shadow-lg border-2 border-orange-100 dark:border-orange-900">
                        <CardHeader className="bg-gradient-to-r">
                            <CardTitle className="flex items-center gap-2 text-orange-400">
                                <CalendarCheck className="h-5 w-5 text-orange-400" />
                                Listado de Reservas
                            </CardTitle>
                            <CardDescription>
                                Visualiza todas las reservas activas y su información detallada
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-6">
                            {/* Tabla con paginación */}
                            <DataTable
                                columns={columns}
                                data={reservas.data}
                                pagination={{
                                    from:
                                        reservas.data.length > 0
                                            ? (reservas.current_page - 1) * reservas.per_page + 1
                                            : 0,
                                    to: Math.min(
                                        reservas.current_page * reservas.per_page,
                                        reservas.total
                                    ),
                                    total: reservas.total,
                                    links: reservas.links,
                                    OnPageChange: handlePageChange,
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}