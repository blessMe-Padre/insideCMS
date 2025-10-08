import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type User } from '@/types';
import { Head } from '@inertiajs/react';



interface InfoPageProps {
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Информация о пользователе',
        href: '/info',
    },
];

export default function Info({ user }: InfoPageProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Информация о пользователе" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4">
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-xl font-semibold">Личная информация</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Имя</label>
                                <p className="text-sm">{user.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <p className="text-sm">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">ID пользователя</label>
                                <p className="text-sm">{user.id}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Дата регистрации</label>
                                <p className="text-sm">
                                    {new Date(user.created_at).toLocaleDateString('ru-RU', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Последнее обновление</label>
                                <p className="text-sm">
                                    {new Date(user.updated_at).toLocaleDateString('ru-RU', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Статус email</label>
                                <p className="text-sm">
                                    {user.email_verified_at ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                            Подтвержден
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                                            Не подтвержден
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {user.avatar && (
                        <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                            <h2 className="mb-4 text-xl font-semibold">Аватар</h2>
                            <div className="flex items-center gap-4">
                                <img
                                    src={user.avatar}
                                    alt="Аватар пользователя"
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                                <p className="text-sm text-muted-foreground">Загружен аватар пользователя</p>
                            </div>
                        </div>
                    )}
                    
                    {user.two_factor_enabled && (
                        <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                            <h2 className="mb-4 text-xl font-semibold">Безопасность</h2>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Двухфакторная аутентификация включена
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
