import AppLayout from '@/layouts/app-layout';
import { addNewsAdmin, dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Lock } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from '@inertiajs/react';
import ToggleLayout from '@/components/ToggleLayout/ToggleLayout';
import TaxonomyItem from '@/components/TaxonomyItem/TaxonomyItem';

/**
 * TODO: добавить пагинацию
 * TODO: добавить поиск по названию новости (доработать )
 * TODO: добавить сортировку по дате создания
 */

interface NewsAdminPageProps {
    news: News[];
}

interface News {
    id: number;
    title: string;
    content: string;
    slug: string;
    created_at: string;
    updated_at: string;
    excerpt: string;
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
];

export default function NewsAdmin({ news }: NewsAdminPageProps) {
    const deleteForm = useForm();
    const [processingNewsId, setProcessingNewsId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setProcessingNewsId(id);

        deleteForm.delete(`news/${id}`, {
            onSuccess: () => {
                setProcessingNewsId(null);
                toast.success('Новость удалена');
            },
            onError: () => {
                toast.error('Ошибка при удалении новости');
            }
        });
    };

    const handleEdit = (id: number) => {
        router.visit(`news/${id}/edit`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Новости">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <Alert variant="default" className="mb-4">
                    <Lock />
                    <AlertDescription>
                      API:  /api/v1/news
                    </AlertDescription>
                </Alert>

                <div className="mb-5 flex justify-between items-center">
                    <p className="text-gray-500 text-lg">Всего новостей: {news.length}</p>
                    <Link
                        href={addNewsAdmin()}
                        className="bg-blue-600 flex items-center gap-2 cursor-pointer text-white px-4 py-2 rounded-sm hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Создать новость 
                    </Link>
                </div>
                <ToggleLayout />
                {news.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Пока нет опубликованных новостей.</p>
                    </div>
                ) : (
                    <ul className="items-layout">
                        {news.map((item) => (
                            <TaxonomyItem 
                                key={item.id}
                                item={item} 
                                handleDelete={handleDelete}
                                handleEdit={handleEdit}
                                processingNewsId={processingNewsId}
                            />
                        ))}
                    </ul>
                )}
                           
            </div>

       </AppLayout>
    );
}
