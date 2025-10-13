import AppLayout from '@/layouts/app-layout';
import { dashboard, filesAdmin } from '@/routes';
import { type BreadcrumbItem} from '@/types';
import { Head, router} from '@inertiajs/react';

import { useState } from "react";
import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";
import { toast } from 'sonner';

/**
 * Доработать функцонал файлового менеждера
 * копировать
 * переместить
 * переименовать
 * скачать
 * создать пути
 */


interface File {
    name: string;
    path: string;
    isDirectory: boolean;
    updatedAt: string;
    size: number;
    mime_type: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Файлы',
        href: '/files-admin',
    },
];

export default function FilesAdmin({initialFiles}: {initialFiles: File[]}) {
    const [files] = useState(initialFiles);

    // Обработчик кнопки "Обновить"
    const handleRefresh = () => {
        router.get(filesAdmin());
    };

    // Обработчик удаления файла
    const handleDelete = (files: File | File[]) => {
        const filesToDelete = Array.isArray(files) ? files : [files];
        
        filesToDelete.forEach(file => {
            router.delete('/files-delete', {
                data: { path: file.path },
                preserveScroll: true,
                onBefore: () => {
                    console.log('Перед отправкой запроса для:', file.name);
                },
                onSuccess: () => {
                    toast.success(`Файл "${file.name}" успешно удален`);
                    handleRefresh();
                },
                onError: (errors) => {
                    toast.error(`Ошибка при удалении файла "${file.name}": ${errors}`);
                    handleRefresh();
                },
            });
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Файловый менеджер" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4">
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-xl font-semibold">Файловый менеджер</h2>
                    </div>
                </div>

                <FileManager 
                    files={files} 
                    collapsibleNav={true}
                    enableFilePreview={true}
                    initialPath="/public"
                    language="ru-RU"
                    onDelete={handleDelete}
                    onRefresh={handleRefresh}

                    permissions={{
                        create: false, // Disable "Create Folder"
                        delete: true, // Disable "Delete"
                        download: true, // Enable "Download"
                        copy: false,
                        move: false,
                        rename: false,
                        upload: true,
                      }}

                    fileUploadConfig={{
                        url: "/files-upload",
                        method: "POST",
                        headers: {
                          "X-CSRF-TOKEN":
                            (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                              ?.content || "",
                          "X-Requested-With": "XMLHttpRequest",
                        },
                      }}
                />

            </div>
        </AppLayout>
    );
}
