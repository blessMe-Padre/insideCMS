import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem} from '@/types';
import { Head} from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Настройки сайта',
        href: '/files-admin',
    },
];

export default function SiteSettings() {
        return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Настройки сайта" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4">
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-xl font-semibold">Настройки сайта</h2>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
