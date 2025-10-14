import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem} from '@/types';
import { Head} from '@inertiajs/react';
import "@cubone/react-file-manager/dist/style.css";
import FileManagerComponent from '@/components/editor/fileManager/FileManagerComponent';

/**
 * Доработать функцонал файлового менеждера
 * копировать
 * переместить
 * переименовать
 * скачать
 * создать пути
 */

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Файловый менеджер',
        href: '/files-admin',
    },
];

export default function FilesAdmin() {
        return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Файловый менеджер" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4">
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-xl font-semibold">Файловый менеджер</h2>
                    </div>
                </div>

                <FileManagerComponent 
                    initialFiles={[]} 
                    setActivePopup={() => {}} 
                    setSelectedFiles={() => {}}
                />
            </div>
        </AppLayout>
    );
}
