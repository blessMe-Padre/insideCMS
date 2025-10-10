import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem} from '@/types';
import { Head } from '@inertiajs/react';

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

export default function FilesAdmin() {
    const [files, setFiles] = useState([
        {
          name: "Documents",
          isDirectory: true, // Folder
          path: "/Documents", // Located in Root directory
          updatedAt: "2024-09-09T10:30:00Z", // Last updated time
        },
        {
          name: "Pictures",
          isDirectory: true,
          path: "/Pictures", // Located in Root directory as well
          updatedAt: "2024-09-09T11:00:00Z",
        },
        {
          name: "Pic.png",
          isDirectory: false, // File
          path: "/Pictures/Pic.png", // Located inside the "Pictures" folder
          updatedAt: "2024-09-08T16:45:00Z",
          size: 2048, // File size in bytes (example: 2 KB)
        },
      ]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Файловый менеджер" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4">
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-xl font-semibold">Файловый менеджер</h2>
                    </div>
                </div>

                <FileManager files={files} />

            </div>
        </AppLayout>
    );
}
