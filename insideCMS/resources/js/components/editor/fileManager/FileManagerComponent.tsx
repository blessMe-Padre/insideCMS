import { router} from '@inertiajs/react';

import { useState, useEffect } from "react";
import { FileManager, FileManagerFile } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface FileManagerComponentProps {
    initialFiles: FileManagerFile[];
    setActivePopup: (active: boolean) => void;
    setSelectedFiles: (files: FileManagerFile[]) => void;
}

export default function FileManagerComponent({
    initialFiles,
    setActivePopup,
    setSelectedFiles,
}: FileManagerComponentProps) {
    const [files, setFiles] = useState(initialFiles);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<FileManagerFile[]>(initialFiles);

    // Загрузка файлов, если initialFiles пустой
    useEffect(() => {
        if (files.length === 0) {
            loadFiles();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const handleDelete = (files: FileManagerFile | FileManagerFile[]) => {
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
    const handleDownload = (files: FileManagerFile | FileManagerFile[]) => {
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

    const handleSelectionChange = (files: FileManagerFile[]) => {
        setSelected(files);
    };
        
    return (
        <>
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
                onSelectionChange={handleSelectionChange}

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
            <Button onClick={(e) => {
                e.preventDefault();
                setSelectedFiles(selected);
                setActivePopup(false);
            }}>Выбрать</Button>
        </>
    );
}