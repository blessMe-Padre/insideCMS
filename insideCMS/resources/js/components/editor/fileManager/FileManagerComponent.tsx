import { router} from '@inertiajs/react';

import { useState, useEffect } from "react";
import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";
import { toast } from 'sonner';

interface File {
    name: string;
    path: string;
    isDirectory: boolean;
    updatedAt: string;
    size: number;
    mime_type: string;
}


export default function FileManagerComponent({initialFiles = []}: {initialFiles: File[]}) {
    const [files, setFiles] = useState(initialFiles);
    const [loading, setLoading] = useState(false);

    // Загрузка файлов, если initialFiles пустой
    useEffect(() => {
        if (initialFiles.length === 0) {
            loadFiles();
        }
    }, []);

    const loadFiles = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/files', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setFiles(data);
                console.log(data);
            } else {
                toast.error('Ошибка загрузки файлов');
            }
        } catch (error) {
           console.log(error);
        } finally {
            setLoading(false);
        }
    };



    // Обработчик кнопки "Обновить"
    const handleRefresh = () => {
        loadFiles();
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

    // Обработчик скачивания файла
    const handleDownload = (files: File | File[]) => {
        const filesToDownload = Array.isArray(files) ? files : [files];
        filesToDownload.forEach(file => {
            const url = `/files-download?path=${encodeURIComponent(file.path)}`;
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };
        
    return (

        <FileManager 
            files={files} 
            collapsibleNav={true}
            filePreviewPath=""
            initialPath="/public"
            language="ru-RU"
            onDelete={handleDelete}
            onDownload={handleDownload}
            onRefresh={handleRefresh}
            isLoading={loading}

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
    );
}