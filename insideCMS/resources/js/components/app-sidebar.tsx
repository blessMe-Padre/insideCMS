import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, newsAdmin, addNewsAdmin, articlesAdmin, addArticleAdmin, modulesAdmin, filesAdmin, pagesAdmin, addPages, siteSettings, menuAdmin, sectionsAdmin, addSection, personaAdmin, addPerson, servicesAdmin, addServices} from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, List, MessageCircle, Newspaper, Plus, User, Settings, Folder, Menu } from 'lucide-react';
import AppLogo from './app-logo';

const settingsNavItems: NavItem[] = [
    {
        title: 'Настройка модулей',
        href: modulesAdmin(),
        icon: Settings,
    },
    {
        title: 'Настройки сайта',
        href: siteSettings(),
        icon: Settings,
    },
    {
        title: 'Меню',
        href: menuAdmin(),
        icon: Menu,
    },
];

export function AppSidebar() {
    const { modules } = usePage<SharedData>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Консоль',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Страницы',
            href: pagesAdmin(),
            icon: Newspaper,

            subItems: [
                {
                    title: 'Все страницы',
                    href: pagesAdmin(),
                    icon: List,
                },
                {
                    title: 'Добавить страницу',
                    href: addPages(),
                    icon: Plus,
                },
            ],
        },
        {
            title: 'Секции',
            href: sectionsAdmin(),
            icon: Newspaper,

            subItems: [
                {
                    title: 'Все секции',
                    href: sectionsAdmin(),
                    icon: List,
                },
                {
                    title: 'Добавить секцию',
                    href: addSection(),
                    icon: Plus,
                },
            ],
        },
        ...(modules?.info?.is_active ? [{
            title: 'Информация о пользователе',
            href: '/info',
            icon: User,
        }] : []),
        ...(modules?.reviews?.is_active ? [{
            title: 'Отзывы',
            href: '/reviews-admin',
            icon: MessageCircle,
        }] : []),

        ...(modules?.news?.is_active ? [{
            title: 'Новости',
            href: newsAdmin(),
            icon: Newspaper,
            subItems: [
                {
                    title: 'Все новости',
                    href: newsAdmin(),
                    icon: List,
                },
                {
                    title: 'Добавить новость',
                    href: addNewsAdmin(),
                    icon: Plus,
                },
            ],
        }] : []),

        ...(modules?.articles?.is_active ? [{
            title: 'Статьи',
            href: articlesAdmin(),
            icon: Newspaper,
            subItems: [
                {
                    title: 'Все статьи',
                    href: articlesAdmin(),
                    icon: List,
                },
                {
                    title: 'Добавить статью',
                    href: addArticleAdmin(),
                    icon: List,
                },
            ],
        }] : []),

        ...(modules?.services?.is_active ? [{
            title: 'Услуги',
            href: servicesAdmin(),
            icon: Newspaper,
            subItems: [
                {
                    title: 'Все услуги',
                    href: servicesAdmin(),
                    icon: List,
                },
                {
                    title: 'Добавить услугу',
                    href: addServices(),
                    icon: Plus,
                },
            ],
        }] : []),

        ...(modules?.person?.is_active ? [{
            title: 'Персоны',
            href: personaAdmin(),
            icon: Newspaper,
            subItems: [
                {
                    title: 'Все персоны',
                    href: personaAdmin(),
                    icon: List,
                },
                {
                    title: 'Добавить персону',
                    href: addPerson(),
                    icon: Plus,
                },
            ],
        }] : []),

        {
            title: 'Файловый менеджер',
            href: filesAdmin(),
            icon: Folder,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavMain items={settingsNavItems} />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
