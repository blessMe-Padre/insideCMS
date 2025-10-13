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
    const [files, setFiles] = useState(initialFiles);


    const handleUploading = (file) => {
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
                    onFileUploading={handleUploading}
                    language="ru-RU"
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
