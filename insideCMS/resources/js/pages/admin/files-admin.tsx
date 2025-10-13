import AppLayout from '@/layouts/app-layout';
import { dashboard, filesAdmin } from '@/routes';
import { type BreadcrumbItem} from '@/types';
import { Head, router} from '@inertiajs/react';

import { useState } from "react";
import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";

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
    const handleDelete = (file: File) => {
        console.log(file);
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
                    language="ru-RU"
                    initialPath="/public"
                    onDelete={handleDelete}
                    onRefresh={handleRefresh}

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
