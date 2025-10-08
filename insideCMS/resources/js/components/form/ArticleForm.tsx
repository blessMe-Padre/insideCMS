import { useForm } from '@inertiajs/react';

/**
 * TODO: добавить редактор для контента
 */

interface ArticleFormData {
    title: string;
    content: string;
    slug: string;
}

interface ArticleFormProps {
    onSuccess?: () => void;
}

export default function ArticleForm({ onSuccess }: ArticleFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm<ArticleFormData>({
        title: '',
        content: '',
        slug: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/articles/add', {
            onSuccess: () => {
                reset();
                onSuccess?.();
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
                    <textarea
                        id="content"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        className="w-full text-whitepx-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={6}
                        required
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

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white cursor-pointer px-4 p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Создание...' : 'Создать статью'}
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