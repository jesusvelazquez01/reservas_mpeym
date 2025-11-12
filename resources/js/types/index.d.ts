import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
//Interfaces de las entidades del sistema


export interface Sala {
    id: number;
    nombre: string;
    capacidad: number;
    ubicacion: string;
    created_at?: string;
    updated_at?: string;
}
export type Entidad = 
    | "Ministra de Planificacion Estrategica y Modernización"
    | "Dirección de Planeamiento Estratégico"
    | "Dirección de Gobernanza Publica"
    | "Jefatura de Área de Políticas Públicas"
    | "Dirección de Gobierno Digital"
    | "Dirección de Modernización de Gestión"
    | "Dirección de Ciberseguridad"
    | "Dirección de Infraestructura de Conectividad y Comunicación"
    | "Dirección de Servicios Informáticos"
    | "Jefatura de Área de Firma Digital y Documentación Electrónica"
    | "Direccion Provincial de Hospitales"
    | "Coordinación Territorial Estratégico"
    | "Jefatura del Área de Recursos Humanos"
    | "Jefatura del Área de Gestión Presupuestaria"
    | "Jefatura de Despacho"
    | "Coordinación de la Unidad Ejecutora Provincial de Transformación"
    | "Coordinación de Infraestructura de Datos Espaciales"
    | "Jefatura de Área de Gestión y Control"
    | "Jefatura de Área de Comunicaciones"
    | "Jefatura de Área de Auditoria"
    | "Consejo de Planificación Estrategica de la Provincia de Jujuy";
export interface Reserva {
    id: number;
    sala_id: number;
    entidad: string;
    responsable: string;
    responsable_id?: string;
    motivo?: string;
    cantidad_equipos?: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    user_id?: number;
    sala?: Sala;
    capacitadores?: Capacitador[];
    created_at?: string;
    updated_at?: string;
}
export interface Equipo {
    id: number;
    marca: string;
    modelo: string;
    sistema_operativo: string;
    estado_inicial: string;
    fecha_adquisicion: string;
    fecha_baja?: string;
    sala_id: number;
    sala?: Sala;
    created_at?: string;
    updated_at?: string;
}
export interface Responsable {
    id: number;
    nombre: string;
    apellido: string;
    dni?: string;
    telefono?: string;
    correo?: string;
    area: string;
    created_at?: string;
    updated_at?: string;
}

export interface Capacitador {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
    correo: string;
    reserva_id?: number;
    reserva?: Reserva;
    created_at?: string;
    updated_at?: string;
}
export interface ControlUso {
    id: number;
    reserva_id: number;
    fue_utilizada: string;
    observaciones: string;
    equipos?: ControlUsoEquipo[];
    reserva?: Reserva;
    created_at?: string;
    updated_at?: string;
}

export interface ControlUsoEquipo {
    id: number;
    control_uso_id: number;
    equipo_id: number;
    estado_pantalla?: string;
    estado?: string;
    se_encendio?: boolean;
    se_apago?: boolean;
    se_conecto_a_cargar?: boolean;
    nivel_bateria?: number;
    observaciones?: string;
    equipo?: Equipo;
    created_at?: string;
    updated_at?: string;
}
export interface Area_Responsable{
    id:number;
    nombre:string;
    created_at?: string;
    updated_at?: string;
}
export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export interface PageProps{
    reserva: PaginationData<Reserva>;
    [key:string]: unknown;
    //ROLES Y PERMISOS
    auth?:{
        user: User;
        roles: string[];
        permissions: string[];
    }
    roles: PaginatedData<Role> | {id: number; name: string}[];
    users: PaginatedData<UserWithRoles> [];
    salas: PaginatedData<Sala>;
    responsables: PaginatedData<Responsable>;
    equipos: PaginatedData<Equipo>;
    control_uso: PaginatedData<ControlUso>;
    capacitadores: PaginatedData<Capacitador>;
    area_responsables: PaginatedData<Area_Responsable>;
}



 export   interface Role{
        id:number;
        name:string;
        permission_count?:number;
    }

export interface Permission {
    id: number;
    name: string;
    guard_name?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UserWithRoles{
    id:number;
    name:string;
    email:string;
    roles:{id:number, name: string}[];
}
export interface PageProps{
    flash:{
        success?:string;
         error?:string;
         warning?:string;
         info?:string;
    }
}

export type PageProps<T = Record<string, unknown>> = SharedData & T;
