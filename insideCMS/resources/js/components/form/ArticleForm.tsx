import { router, useForm } from '@inertiajs/react';
import { toast } from "sonner";
import TextEditor from '../editor/TextEditor';
import { LoaderCircle, SaveIcon } from 'lucide-react';
import { articlesAdmin } from '@/routes';
import transliterateToSlug from '@/utils/transliterateToSlug';
import { Input } from '@/components/ui/input';
import MainImagesComponent from '../MainImagesComponent/MainImagesComponent';


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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/articles/add', {
            onSuccess: () => {
                reset();
                onSuccess?.();
                toast.success('Статья успешно создана');
                router.visit(articlesAdmin().url);
            },
            onError: () => {
                toast.error('Ошибка при создании статьи');
            },
        });
    };

    const handleGenerateSlug = (e: React.MouseEvent) => {
        e.preventDefault();
        const slug = transliterateToSlug(data.title);
        setData('slug', slug);
    }

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">Добавить статью</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-foreground text-sm font-medium mb-1">
                        Заголовок *
                    </label>
                    <Input
                        id="title"
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-1">
                        Slug *
                    </label>
                    <Input
                        id="slug"
                        type="text"
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                        className="w-full p-2 border rounded"                        required
                    />
                    <button className="cursor-pointer text-[10px] underline text-blue-500 transition-colors hover:text-blue-700" onClick={handleGenerateSlug}>Сгенерировать slug</button>

                    {errors.slug && (
                        <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
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

                <MainImagesComponent
                    label="Изображения"
                    imagesList={data.images}
                    setData={setData}
                />

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
                        onClick={() => window.location.href = '/admin/articles-admin'}
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