import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {CalendarPlus2, UserRoundSearch, LaptopMinimalCheck, Folder, Calendar, ClipboardPlus, DoorOpen, MessageCircleWarning, Laptop, ShieldPlus,ShieldBan,UserRound, Settings, ChevronDown } from 'lucide-react';
import AppLogo from './app-logo';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
// ===== SECCIÓN PRINCIPAL =====
const principalItems: NavItem[] = [
    {
        title: 'Calendario',
        href: '/dashboard',
        icon: CalendarPlus2,
        // permission: 'dashboard.view'
    },
];

// ===== SECCIÓN GESTIÓN DE RECURSOS =====
const gestionRecursosItems: NavItem[] = [
    {
        title: 'Salas',
        href: '/salas',
        icon: DoorOpen,
        // permission: 'salas.view'
    },
    {
        title: 'Equipos',
        href: '/equipos',
        icon: Laptop,
        // permission: 'equipos.view'
    },
    {
        title: 'Jefes de Área',
        href: '/responsables',
        icon: UserRound,
    },
     {
        title: 'Capacitadores',
        href: '/capacitadores',
        icon: UserRoundSearch,
    },
];

// ===== SECCIÓN RESERVAS Y USO =====
const reservasUsoItems: NavItem[] = [
    {
        title: 'Reservas Usuarios',
        href: '/admin/reservas',
        icon: Calendar,
        // permission: 'reservas.view.all'
    },
    {
        title: 'Uso de Salas',
        href: '/control-uso',
        icon: ClipboardPlus,
        // permission: 'control_uso.view'
    },
    {
        title: 'Historial de Equipos',
        href: '/admin/historial-equipos',
        icon: LaptopMinimalCheck,
        // permission: 'equipos.view'
    },
];

// ===== SECCIÓN REPORTES =====
const reportesItems: NavItem[] = [
    {
        title: 'Reportes de Salas',
        href: '/admin/reportes-uso',
        icon: MessageCircleWarning,
        // permission: 'reportes.view'
    },
    {
        title: 'Reportes de Equipos',
        href: '/admin/reportes-equipos',
        icon: LaptopMinimalCheck,
        // permission: 'reportes.view'
    },
];

// ===== SECCIÓN ADMINISTRACIÓN =====
const administracionItems: NavItem[] = [
    {
        title: 'Usuarios',
        href: '/users',
        icon: UserRoundSearch,
        // permission: 'roles.view'
    },
    {
        title: 'Asignar Roles',
        href: '/users/roles',
        icon: ShieldPlus,
        // permission: 'usuarios.view'
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: ShieldBan,
        // permission: 'configuracion.view'
    },
];

// Grupos de navegación organizados por secciones
const footerNavItems: NavItem[] = [
    {
        title: 'Contacto Soporte',
        href: 'https://api.whatsapp.com/send/?phone=5403885474266&text&type=phone_number&app_absent=0',
        icon: Folder,
    },
   
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
               <NavMain items={principalItems} />

                    <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                <div className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Gestion de Recursos
                                </div>
                                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {gestionRecursosItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.href} className="flex items-center gap-2 px-2 py-1.5">
                                                    {item.icon && <item.icon className="h-4 w-4" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>

                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                <div className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Reportes
                                </div>
                                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {reportesItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.href} className="flex items-center gap-2 px-2 py-1.5">
                                                    {item.icon && <item.icon className="h-4 w-4" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
                {/* Gestión Académica */}
                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                <div className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Reservas Uso
                                </div>
                                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {reservasUsoItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.href} className="flex items-center gap-2 px-2 py-1.5">
                                                    {item.icon && <item.icon className="h-4 w-4" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>

                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                <div className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Administracion
                                </div>
                                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {administracionItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.href} className="flex items-center gap-2 px-2 py-1.5">
                                                    {item.icon && <item.icon className="h-4 w-4" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>























            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
