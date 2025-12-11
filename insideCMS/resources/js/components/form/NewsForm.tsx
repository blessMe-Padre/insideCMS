import { router, useForm } from '@inertiajs/react';
import TextEditor from '../editor/TextEditor';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { LoaderCircle, SaveIcon} from 'lucide-react';
import { newsAdmin } from '@/routes';
import transliterateToSlug from '@/utils/transliterateToSlug';
import { Input } from '@/components/ui/input';
import MainImagesComponent from '../MainImagesComponent/MainImagesComponent';

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
    const { data, setData, post, processing, errors} = useForm<NewsFormData>({
        title: '',
        content: '',
        excerpt: '',
        slug: '',
        time_to_read: 0,
        is_published: false,
        images: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/news', {
            onSuccess: () => {
                onSuccess?.();
                toast.success('Новость успешно создана');
                router.visit(newsAdmin().url);
            },  
            onError: () => {
                toast.error('Ошибка при создании новости');
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
                        className="w-full p-2 border rounded"                        required
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

                <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-1">
                        Краткое описание *
                    </label>
                    <textarea
                        id="excerpt"
                        value={data.excerpt}
                        onChange={(e) => setData('excerpt', e.target.value)}
                        className="w-full p-2 border rounded"                         rows={2}
                        required
                    />
                    {errors.excerpt && (
                        <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="time_to_read" className="block text-sm font-medium text-foreground mb-1">
                        Время на чтение (минут) *
                    </label>
                    <Input
                        id="time_to_read"
                        type="number"
                        min="1"
                        value={data.time_to_read}
                        onChange={(e) => setData('time_to_read', parseInt(e.target.value))}
                        className="w-full p-2 border rounded"                         required
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

                <MainImagesComponent
                    label="Изображения"
                    imagesList={data.images}
                    setData={setData}
                />

                <div className="flex gap-2">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white cursor-pointer px-4 p-2 rounded-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {processing ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <SaveIcon className="w-4 h-4" />} Создать новость
                    </Button>
                    <Button
                        type="button"
                        onClick={() => router.visit(newsAdmin().url)}
                        disabled={processing}
                        className="bg-gray-500 text-white cursor-pointer px-4 p-2 rounded-sm hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </>
    );
}