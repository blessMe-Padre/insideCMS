import { useForm } from '@inertiajs/react';
import { toast } from "sonner";
import TextEditor from '../editor/TextEditor';
import { useEffect, useState} from 'react';
import Popup from '../popup/Popup';
import FileManagerComponent from '../editor/fileManager/FileManagerComponent';
import { Button } from '@/components/ui/button';
import { FileManagerFile } from '@cubone/react-file-manager';
import { LoaderCircle, SaveIcon } from 'lucide-react';

/**
 * TODO: добавить редактор для контента
 */

interface ArticleFormData {
    title: string;
    content: string;
    slug: string;
    images?: File[];
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

    const [preview, setPreview] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<FileManagerFile[]>([]);
    const [activePopup, setActivePopup] = useState(false);

     useEffect(() => {
        setPreview(selectedFiles.map((file) => file.path));
        setData('images_urls', selectedFiles.map((file) => file.path));
    }, [selectedFiles, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/articles/add', {
            onSuccess: () => {
                reset();
                onSuccess?.();
                toast.success('Статья успешно создана');
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
                    <p className="block text-sm font-medium text-foreground mb-1">Изображения</p>
                    {preview.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2 mb-2">
                            {preview.map((image, index) => (
                                <img 
                                    key={`preview-${index}`}
                                    src={image} 
                                    alt={`Preview ${index + 1}`} 
                                    className="w-20 h-20 object-cover rounded-md border" 
                                />
                            ))}
                        </div>
                    )}

                    {/* <label htmlFor="images" className="block mb-3">
                        <input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setData('images', Array.from(e.target.files || []))}
                            className="w-full text-white px-3 py-2 px-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </label> */}

                    <Button variant="outline" onClick={(e) => {
                        e.preventDefault();
                        setActivePopup(true);
                    }}>Файловый менеджер</Button>

                    {errors.images && (
                        <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                    )}

                    <Popup activePopup={activePopup} setActivePopup={setActivePopup}>
                        <FileManagerComponent 
                            initialFiles={[]}
                            setActivePopup={setActivePopup}
                            setSelectedFiles={setSelectedFiles}
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
        </>
    );
}