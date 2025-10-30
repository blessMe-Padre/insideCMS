import { useForm } from '@inertiajs/react';
import { toast } from "sonner";
import TextEditor from '../editor/TextEditor';
import { useState} from 'react';
import Popup from '../popup/Popup';
import FileManagerComponent from '../editor/fileManager/FileManagerComponent';
import { Button } from '@/components/ui/button';
import { FileManagerFile } from '@cubone/react-file-manager';
import { LoaderCircle, SaveIcon, TrashIcon } from 'lucide-react';


interface ArticleFormData {
    title: string;
    content: string;
    slug: string;
    images?: string[];
    images_urls?: string[];
}

interface ArticleFormProps {
    onSuccess?: () => void;
}

export default function ArticleForm({ onSuccess }: ArticleFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm<ArticleFormData>({
        title: '',
        content: '',
        slug: '',
        images: [],
    });

    const [activePopup, setActivePopup] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [currentImageElementId, setCurrentImageElementId] = useState<number | null>(null);
    const [elements, setElements] = useState<Array<{ id: number; data: string[] }>>([]);

    // Обработчик выбора файлов из FileManager
    const handleFileSelection = (files: FileManagerFile[]) => {
        const filePaths = files.map(file => file.path);
        setSelectedFiles(filePaths);
        setData('images', filePaths);
        
        // Затем синхронизируем данные элемента
        if (currentImageElementId !== null) {
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
        post('/articles/add', {
            onSuccess: () => {
                reset();
                onSuccess?.();
                toast.success('Статья успешно создана');
                window.location.href = '/articles-admin';
            },
            onError: () => {
                toast.error('Ошибка при создании статьи');
            },
        });
    };

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">Добавить статью</h2>

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
                        className="w-full text-whitepx-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-1">
                        Slug *
                    </label>
                    <input
                        id="slug"
                        type="text"
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                        className="w-full text-whitepx-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                    {errors.slug && (
                        <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
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
                            className="bg-blue-600 text-white cursor-pointer px-4 p-2 rounded-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {processing ? 
                                (<div className="flex items-center gap-2"><LoaderCircle className="w-4 h-4 animate-spin" /> Сохранение...</div>)
                                : 
                                (<div className="flex items-center gap-2"><SaveIcon className="w-4 h-4" /> Создать</div>)
                            }
                        </button>
                        <button
                            type="button"
                            onClick={() => window.location.href = '/pages-admin'}
                            disabled={processing}
                            className="bg-gray-500 text-white cursor-pointer px-4 p-2 rounded-sm hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Отмена
                        </button>
                    </div>
            </form>
        </>
    );
}