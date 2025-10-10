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
import { dashboard, reviewsAdmin, newsAdmin, addNewsAdmin, articlesAdmin, addArticleAdmin, modulesAdmin, filesAdmin} from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, List, MessageCircle, Newspaper, Plus, User, Settings, Folder } from 'lucide-react';
import AppLogo from './app-logo';

const settingsNavItems: NavItem[] = [
    {
        title: 'Настройка модулей',
        href: modulesAdmin(),
        icon: Settings,
    },
];

export function AppSidebar() {
    const { modules } = usePage<SharedData>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(modules?.info?.is_active ? [{
            title: 'Информация о пользователе',
            href: '/info',
            icon: User,
        }] : []),
        {
            title: 'Отзывы ',
            href: reviewsAdmin(),
            icon: MessageCircle,
        },
        {
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
        },
        {
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
                    icon: Plus,
                },
            ],
        },
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
