import { useForm } from '@inertiajs/react';
import TextEditor from '../editor/TextEditor';
import { toast } from 'sonner';

/**
 * TODO: добавить редактор для контента
 */

interface NewsFormData {
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    time_to_read: number;
    is_published: boolean;
    images: File[];
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/news', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onSuccess?.();
                toast.success('Новость успешно создана');
            },  
            onError: () => {
                toast.error('Ошибка при создании новости');
            },
        });
    };

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">Добавить новость</h2>

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
                    <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-1">
                        Краткое описание *
                    </label>
                    <textarea
                        id="excerpt"
                        value={data.excerpt}
                        onChange={(e) => setData('excerpt', e.target.value)}
                        className="w-full text-whitepx-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full text-whitepx-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full text-whitepx-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <label htmlFor="images" className="block text-sm font-medium text-foreground mb-1">
                        Изображения
                    </label>
                    <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setData('images', Array.from(e.target.files || []))}
                        className="w-full text-whitepx-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.images && (
                        <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white cursor-pointer px-4 p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Создание...' : 'Создать новость'}
                    </button>
                    <button
                        type="button"
                        onClick={() => reset()}
                        disabled={processing}
                        className="bg-gray-500 text-white cursor-pointer px-4 p-2 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Очистить
                    </button>
                </div>
            </form>
        </>
    );
}