import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

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
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    subItems?: NavItem[];
}

export interface Module {
    is_active: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    modules: Record<string, Module>;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    role_ids?: number[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface Review {
    id: number;
    author_name: string;
    content: string;
    rating: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface ReviewFormData {
    author_name: string;
    content: string;
    rating: number;
}

export interface Service {
    id: number;
    parentId: number;
    title: string;
    slug: string;
    images: string[];
    description: string;
    content: string;
    created_at: string;
    updated_at: string;
    excerpt: string;
}

export interface ServicesAdminPageProps {
    services: Service[];
    links: Array<{
        url: string | null;
        label: string | null;
        active: boolean | null;
    }>;
    current_page: number;
    total_pages: number;
    per_page: number;
    total: number;
}

export interface Component {
    id: number;
    component_id: number;
    data: string | string[];
    component_type: string;
}

export interface ComponentAdmin {
    id: string;
    name: string;
    description: string;
    type: string;
    content?: string;
    component_id: string;
}

export interface Persona {
    id: number;
    title: string;
    content: string;
    slug: string;
    created_at: string;
    updated_at: string;
    excerpt: string;
    images: string[];
}

export interface PersonaAdminPageProps {
    persons: Persona[];
    links: Array<{
        url: string | null;
        label: string | null;
        active: boolean | null;
    }>;
    current_page: number;
    total_pages: number;
    per_page: number;
    total: number;
}

export interface Section {
    id: number;
    name: string;
    slug: string;
    description: string;
    created_at: string;
    title: string;
}

export interface Section_component {
    id: number;
    page_id?: number;
    component_id?: number;
    data: string | string[];
    component_type: string;
}

export interface Page {
    id: number;
    name: string;
    slug: string;
    description: string;
    created_at: string;
    title: string;
}

export interface Page_component {
    id: number;
    page_id?: number;
    component_id?: number;
    data: string | string[];
    component_type: string;
}

export interface ModulesSetting {
    id: number;
    module_name: string;
    module_description: string;
    is_active: boolean;
}

export interface TaxonomyItemProps {
    id: number;
    title: string;
    content: string;
    slug: string;
    created_at: string;
    updated_at: string;
    excerpt: string;
    images: string[];
}