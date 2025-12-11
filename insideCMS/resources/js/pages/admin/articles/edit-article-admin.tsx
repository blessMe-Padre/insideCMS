import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import TextEditor from '@/components/editor/TextEditor';
import { toast } from "sonner";
import { LoaderCircle, LockIcon, SaveIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import MainImagesComponent from '@/components/MainImagesComponent/MainImagesComponent';

interface Article {
    id: number;
    title: string;
    content: string;
    slug: string;
    images: string[];
}

interface EditArticleAdminPageProps {
    article: Article;
}

interface ArticleFormData {
    title: string;
    content: string;
    slug: string;
    images: string[];
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
        images: article?.images || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/articles/${article.id}`, {
            onSuccess: () => {
                window.location.href = '/admin/articles-admin';
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

                <Alert variant="default" className="mb-4">
                    <LockIcon className="w-4 h-4" />
                    <AlertDescription>
                      API:  /api/v1/articles/{article.slug}
                    </AlertDescription>
                </Alert>

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
                            className="w-full p-2 border rounded"                            required
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
                        <Input
                            id="slug"
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            className="w-full p-2 border rounded"                            required
                        />
                        {errors.slug && (
                            <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
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
                                (<div className="flex items-center gap-2"><SaveIcon className="w-4 h-4" /> Сохранить изменения</div>)
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
            </div>
        </AppLayout>
    );
}

