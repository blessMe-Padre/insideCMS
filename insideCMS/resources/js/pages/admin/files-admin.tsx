import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem} from '@/types';
import { Head, useForm } from '@inertiajs/react';

import { useState } from "react";
import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";


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

export default function FilesAdmin({initialFiles}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
    });

    const [files, setFiles] = useState(initialFiles);


    const handleUploading = (file) => {
        console.log(file);
        setData('file', file);
        post('/files', {
            onSuccess: () => {
                reset();
            },
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
                    filePreviewPath=""
                    uploadUrl="/public"
                    onFileUploading={handleUploading}
                    language="ru-RU"
                />

            </div>
        </AppLayout>
    );
}
