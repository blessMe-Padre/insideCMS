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
import { dashboard, info, reviewsAdmin, newsAdmin, addNewsAdmin, articlesAdmin, addArticleAdmin} from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, List, MessageCircle, Newspaper, Plus, User } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Информация о пользователе',
        href: info(),
        icon: User,
    },
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
];

export function AppSidebar() {
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
