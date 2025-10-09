import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { toast } from "sonner";
import TextEditor from '@/components/editor/TextEditor';
import { useEffect, useRef, useState } from 'react';

interface Article {
    id: number;
    title: string;
    content: string;
    slug: string;
}

interface EditArticleAdminPageProps {
    article: Article;
}

interface ArticleFormData {
    title: string;
    content: string;
    slug: string;
    images: File[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Статьи',
        href: '/articles-admin',
    },
    {
        title: 'Редактирование',
        href: '#',
    },
];

export default function EditArticleAdmin({ article }: EditArticleAdminPageProps) {
    const { data, setData, post, processing, errors } = useForm<ArticleFormData>({
        title: article.title,
        content: article.content,
        slug: article.slug,
        images: [],
    });

    const [preview, setPreview] = useState<string[]>([]);
    const previewUrlsRef = useRef<string[]>([]);

    useEffect(() => {
        // Очищаем старые URL
        previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        previewUrlsRef.current = [];

        if (data.images.length > 0) {
            const newPreview = data.images.map((image) => URL.createObjectURL(image));
            previewUrlsRef.current = newPreview;
            setPreview(newPreview);
        } else {
            setPreview([]);
        }

        // Очистка при размонтировании
        return () => {
            previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [data.images]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/articles/${article.id}`, {
            onSuccess: () => {
                window.location.href = '/articles-admin';
                toast.success('Статья успешно обновлена');
            },
            onError: () => {
                toast.error('Ошибка при редактировании статьи');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Редактирование статьи">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <h1 className="text-3xl font-bold text-foreground mb-6">Редактирование статьи</h1>

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
                       {preview.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
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
                </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white cursor-pointer px-4 p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                        <button
                            type="button"
                            onClick={() => window.location.href = '/articles-admin'}
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

