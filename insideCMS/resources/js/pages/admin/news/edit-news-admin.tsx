import TextEditor from '@/components/editor/TextEditor';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { toast } from "sonner";
import Popup from '@/components/popup/Popup';
import FileManagerComponent from '@/components/editor/fileManager/FileManagerComponent';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FileManagerFile } from '@cubone/react-file-manager';
import { LoaderCircle, LockIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface News {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    excerpt: string;
    images: string[];
    slug: string;
    time_to_read: number;
    is_published: boolean;
}

interface EditNewsAdminPageProps {
    news: News;
}

interface NewsFormData {
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    time_to_read: number;
    is_published: boolean;
    images: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Новости',
        href: '/news-admin',
    },
    {
        title: 'Редактирование',
        href: '#',
    },
];

export default function EditNewsAdmin({ news }: EditNewsAdminPageProps) {
    const { data, setData, post, processing, errors } = useForm<NewsFormData>({
        title: news.title,
        content: news.content,
        excerpt: news.excerpt,
        slug: news.slug,
        time_to_read: news.time_to_read,
        is_published: news.is_published,
        images: news.images || [],
    });
   
    const [activePopup, setActivePopup] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string[]>(news?.images || []);
    const [currentImageElementId, setCurrentImageElementId] = useState<number | null>(null);
    const [elements, setElements] = useState<Array<{ id: number; data: string[] }>>([]);

    // Обработчик выбора файлов из FileManager
    const handleFileSelection = (files: FileManagerFile[]) => {
        const filePaths = files.map(file => file.path);
        setSelectedFiles(filePaths);
        setData('images', filePaths);
        
        // Затем синхронизируем данные элемента
        if (currentImageElementId) {
            const updatedElements = elements.map((element) => 
                element.id === currentImageElementId ? { ...element, data: filePaths } : element
            );
            setElements(updatedElements);
        }
    };
    
    const handleRemoveFile = (e: React.FormEvent, elementId: number, fileIndex: number) => {
        e.preventDefault();

        // Если удаляем файл из временно выбранных (предпросмотр), синхронизируем и элементы
        if (currentImageElementId === elementId && selectedFiles.length > 0) {
            const updatedSelectedFiles = selectedFiles.filter((_, index) => index !== fileIndex);
            setSelectedFiles(updatedSelectedFiles);
            setData('images', updatedSelectedFiles);

            const updatedElements = elements.map((element) =>
                element.id === elementId ? { ...element, data: updatedSelectedFiles } : element
            );
            setElements(updatedElements);
            return;
        }

        // Иначе удаляем из уже сохранённых файлов
        if (data.images && data.images.length > 0) {
            const updatedImages = data.images.filter((_, index) => index !== fileIndex);
            setData('images', updatedImages);
            // Принудительно обновляем selectedFiles
            setSelectedFiles(updatedImages);
        } else {
            // Если data.images пустой, принудительно очищаем selectedFiles
            setSelectedFiles([]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/news/${news.id}`, {
            onSuccess: () => {
                window.location.href = '/news-admin';
                toast.success('Новость успешно обновлена');
            },
            onError: () => {
                toast.error('Ошибка при обновлении новости');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Редактирование новости">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <h1 className="text-3xl font-bold text-foreground mb-6">Редактирование новости</h1>

                <Alert variant="default" className="mb-4">
                    <LockIcon className="w-4 h-4" />
                    <AlertDescription>
                      API:  /api/v1/news/{news.slug}
                    </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-foreground text-sm font-medium mb-1">
                            Заголовок *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full text-foreground px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-foreground mb-1">
                            Контент *
                        </label>
                        <TextEditor
                            value={data.content}
                            onChange={(value) => setData('content', value)}
                        />
                        {errors.content && (
                            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-1">
                            Краткое описание *
                        </label>
                        <textarea
                            id="excerpt"
                            value={data.excerpt}
                            onChange={(e) => setData('excerpt', e.target.value)}
                            className="w-full text-foreground px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                            required
                        />
                        {errors.excerpt && (
                            <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-1">
                            Slug *
                        </label>
                        <input
                            id="slug"
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            className="w-full text-foreground px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {errors.slug && (
                            <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="time_to_read" className="block text-sm font-medium text-foreground mb-1">
                            Время на чтение (минут) *
                        </label>
                        <input
                            id="time_to_read"
                            type="number"
                            min="1"
                            value={data.time_to_read}
                            onChange={(e) => setData('time_to_read', parseInt(e.target.value))}
                            className="w-full text-foreground px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {errors.time_to_read && (
                            <p className="text-red-500 text-sm mt-1">{errors.time_to_read}</p>
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            id="is_published"
                            type="checkbox"
                            checked={data.is_published}
                            onChange={(e) => setData('is_published', e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="is_published" className="ml-2 block text-sm font-medium text-foreground">
                            Опубликовать новость
                        </label>
                        {errors.is_published && (
                            <p className="text-red-500 text-sm mt-1">{errors.is_published}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Изображения
                        </label>
                        
                        {selectedFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                {selectedFiles.map((file, index) => (
                                    <div key={`selected-${index}`} className="relative">
                                        <button
                                            className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700 z-10"
                                            onClick={(e) => handleRemoveFile(e, 0, index)}>
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                        <img  
                                            src={file} 
                                            alt={`Selected ${index + 1}`} 
                                            className={`w-20 h-20 object-cover rounded-md border ${
                                                currentImageElementId === 0 ? 'border-blue-500' : ''
                                            }`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button 
                            type="button"
                            variant="outline" 
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentImageElementId(0);
                                setActivePopup(true);
                            }}>
                            Выбрать файл
                        </Button>
                        
                        <Popup activePopup={activePopup} setActivePopup={setActivePopup}>
                            <FileManagerComponent 
                                initialFiles={[]}
                                setActivePopup={setActivePopup}
                                setSelectedFiles={handleFileSelection}
                            />
                        </Popup>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white cursor-pointer px-4 p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {processing ? 
                                (<div className="flex items-center gap-2"><LoaderCircle className="w-4 h-4 animate-spin" /> Сохранение...</div>)
                                : 
                                (<div className="flex items-center gap-2"><SaveIcon className="w-4 h-4" /> Сохранить изменения</div>)
                            }
                        </button>
                        <button
                            type="button"
                                onClick={() => window.location.href = '/pages-admin'}
                                disabled={processing}
                            className="bg-gray-500 text-white cursor-pointer px-4 p-2 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

