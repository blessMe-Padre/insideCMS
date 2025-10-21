import { router, useForm } from '@inertiajs/react';
import TextEditor from '../editor/TextEditor';
import { toast } from 'sonner';
import Popup from '../popup/Popup';
import FileManagerComponent from '../editor/fileManager/FileManagerComponent';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import { FileManagerFile } from '@cubone/react-file-manager';
import { LoaderCircle, SaveIcon, TrashIcon } from 'lucide-react';
import { newsAdmin } from '@/routes';

interface NewsFormData {
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    time_to_read: number;
    is_published: boolean;
    images: string[];
}

interface NewsFormProps {
    onSuccess?: () => void;
}

export default function NewsForm({ onSuccess }: NewsFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm<NewsFormData>({
        title: '',
        content: '',
        excerpt: '',
        slug: '',
        time_to_read: 0,
        is_published: false,
        images: [],
    });

    const [activePopup, setActivePopup] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [currentImageElementId, setCurrentImageElementId] = useState<number | null>(null);
    const [elements, setElements] = useState<Array<{ id: number; data: string[] }>>([]);

    // Синхронизация selectedFiles с data.images
    useEffect(() => {
        setSelectedFiles(data.images || []);
    }, [data.images]);

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
    };

    const handleReset = () => {
        reset();
        setSelectedFiles([]);
        setElements([]);
        setCurrentImageElementId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/news', {
            onSuccess: () => {
                handleReset();
                onSuccess?.();
                toast.success('Новость успешно создана');
                router.visit(newsAdmin().url);
            },  
            onError: () => {
                toast.error('Ошибка при создании новости');
            },
        });
    };

    return (
        <>
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
                        className="w-full text-white px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full text-white px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full text-white px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full text-white px-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        className="w-20 h-20 object-cover rounded-md border border-blue-500" 
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

                <div className="flex gap-2">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white cursor-pointer px-4 p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {processing ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <SaveIcon className="w-4 h-4" />} Создать новость
                    </Button>
                    <Button
                        type="button"
                        onClick={handleReset}
                        disabled={processing}
                        className="bg-gray-500 text-white cursor-pointer px-4 p-2 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Очистить
                    </Button>
                </div>
            </form>
        </>
    );
}