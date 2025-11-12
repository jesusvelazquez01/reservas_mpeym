import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem, type PaginatedData } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';
import {
    History,
    HelpCircle,
    Laptop,
    Calendar,
    Users,
    Battery,
    Eye,
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
import { ResponsablesDataTable } from '@/components/ui/responsables-data-table';

interface HistorialItem {
    id: number;
    marca: string;
    modelo: string;
    sala_nombre: string;
    fecha: string;
    responsable: string;
    entidad: string;
    usuario_creador: string;
    capacitadores: string;
    estado_pantalla: string;
    estado: string;
    se_encendio: boolean;
    se_apago: boolean;
    se_conecto_a_cargar: boolean;
    nivel_bateria: number;
    observaciones: string;
}

interface Props {
    historial: PaginatedData<HistorialItem>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Historial de Equipos',
        href: '/admin/historial-equipos',
    },
];

export default function HistorialEquipos({ historial }: Props) {
    const handlePageChange = useCallback((url: string | null) => {
        if (url) {
            router.get(url, undefined, {
                preserveState: true,
                preserveScroll: true,
                only: ['historial'],
            });
        }
    }, []);

    const getEstadoColor = (estado: string) => {
        switch (estado?.toLowerCase()) {
            case 'excelente':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'bueno':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'regular':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'malo':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    const getBateriaColor = (nivel: number) => {
        if (nivel >= 80) return 'text-green-600 dark:text-green-400';
        if (nivel >= 50) return 'text-blue-600 dark:text-blue-400';
        if (nivel >= 20) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const columns: ColumnDef<HistorialItem>[] = [
        {
            accessorKey: 'marca',
            header: 'Equipo',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-orange-400" />
                    <div>
                        <p className="font-medium">
                            {row.original.marca} {row.original.modelo}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {row.original.sala_nombre}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'fecha',
            header: 'Fecha',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-400" />
                    <span className="text-sm">{row.original.fecha}</span>
                </div>
            ),
        },
        {
            accessorKey: 'entidad',
            header: 'Área',
            cell: ({ row }) => (
                <div className="text-sm">{row.original.entidad}</div>
            ),
        },
        {
            accessorKey: 'responsable',
            header: 'Responsables',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-400" />
                    <div>
                        <p className="font-medium text-sm">{row.original.responsable}</p>
                        {row.original.capacitadores && (
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                Capacitadores: {row.original.capacitadores}
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'estado',
            header: 'Estado Final',
            cell: ({ row }) => (
                <div>
                    {row.original.estado ? (
                        <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(
                                row.original.estado
                            )}`}
                        >
                            {row.original.estado}
                        </span>
                    ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                            No se cargó
                        </span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'estado_pantalla',
            header: 'Estado Pantalla',
            cell: ({ row }) => (
                <div>
                    {row.original.estado_pantalla ? (
                        <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(
                                row.original.estado_pantalla
                            )}`}
                        >
                            {row.original.estado_pantalla}
                        </span>
                    ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                            No se cargó
                        </span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'nivel_bateria',
            header: 'Batería',
            cell: ({ row }) => (
                <div>
                    {row.original.nivel_bateria !== null && row.original.nivel_bateria > 0 ? (
                        <div className="flex items-center gap-1">
                            <Battery
                                className={`h-4 w-4 ${getBateriaColor(
                                    row.original.nivel_bateria
                                )}`}
                            />
                            <span
                                className={`text-sm font-medium ${getBateriaColor(
                                    row.original.nivel_bateria
                                )}`}
                            >
                                {row.original.nivel_bateria}%
                            </span>
                        </div>
                    ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                            No se cargó
                        </span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'acciones',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.se_encendio ? (
                        <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs">
                            Encendido
                        </span>
                    ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                            No se encendió
                        </span>
                    )}
                    {row.original.se_apago ? (
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs">
                            Apagado
                        </span>
                    ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                            No se apagó
                        </span>
                    )}
                    {row.original.se_conecto_a_cargar ? (
                        <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded text-xs">
                            Cargado
                        </span>
                    ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                            No se conectó a cargar
                        </span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'observaciones',
            header: 'Observaciones',
            cell: ({ row }) => (
                <div className="max-w-xs">
                    {row.original.observaciones ? (
                        <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 text-gray-400" />
                            <p
                                className="text-sm text-gray-600 dark:text-gray-400 truncate"
                                title={row.original.observaciones}
                            >
                                {row.original.observaciones}
                            </p>
                        </div>
                    ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                            Sin observaciones
                        </span>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historial de Uso de Equipos" />

            <div className="min-h-screen bg-gradient-to-br p-3">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header principal */}
                    <div className="text-align-left">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                                    <History className="h-6 w-6 text-orange-400" />
                                    Historial de Equipos
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Consulta el historial completo de uso y mantenimiento de
                                    equipos.
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
                                        ¿Qué es el Historial de Equipos?
                                    </DialogTitle>
                                    <DialogDescription className="space-y-2">
                                        <p>
                                            Este módulo muestra un registro completo de todos los
                                            usos de los equipos tecnológicos del ministerio.
                                        </p>
                                        <p className="font-semibold">Información disponible:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>
                                                Estado del equipo y pantalla después de cada uso
                                            </li>
                                            <li>Nivel de batería registrado</li>
                                            <li>
                                                Acciones realizadas (encendido, apagado, carga)
                                            </li>
                                            <li>Responsables y fecha de uso</li>
                                            <li>Observaciones sobre incidencias o novedades</li>
                                        </ul>
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Card principal */}
                    <Card className="shadow-lg border-2 border-orange-100">
                        <CardHeader className="bg-gradient-to-r">
                            <CardTitle className="flex items-center gap-2 text-orange-400">
                                <History className="h-5 w-5 text-orange-400" />
                                Registros de Uso
                            </CardTitle>
                            <CardDescription>
                                Historial completo de uso, mantenimiento y estado de los
                                equipos tecnológicos
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-6">
                            {/* Tabla con paginación */}
                            <DataTable
                                columns={columns}
                                data={historial.data}
                                pagination={{
                                    from: historial.from,
                                    to: historial.to,
                                    total: historial.total,
                                    links: historial.links,
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