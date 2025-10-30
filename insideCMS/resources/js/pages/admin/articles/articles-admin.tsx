import AppLayout from '@/layouts/app-layout';
import { addArticleAdmin, dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router, Link } from '@inertiajs/react';
import placeholder from '/public/placeholder.svg';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/spinner';

interface ArticlesAdminPageProps {
    articles: Articles[];
    links: Array<{
        url: string | null;
        label: string | null;
        active: boolean | null;
    }>;
    current_page: number;
    total_pages: number;
    per_page: number;
    total: number;
}

interface Articles {
    id: number;
    title: string;
    content: string;
    slug: string;
    created_at: string;
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
];

export default function ArticlesAdmin({ articles, links, total_pages, total }: ArticlesAdminPageProps) {
    const deleteForm = useForm();
    const [processingNewsId, setProcessingNewsId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setProcessingNewsId(id);

        deleteForm.delete(`/articles/${id}`, {
            onSuccess: () => {
                setProcessingNewsId(null);
                toast.success('Статья удалена');
            },
            onError: () => {
                toast.error('Ошибка при удалении статьи');
            }
        });
    };

    const handleEdit = (id: number) => {
        router.visit(`/articles/${id}/edit`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Статьи">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>
                <h1 className="text-3xl font-bold text-foreground mb-4">Cтатьи</h1>
                <Alert variant="default" className="mb-4">
                    <Lock />
                    <AlertDescription>
                      API:  /api/v1/articles
                    </AlertDescription>
                </Alert>

                <div className="mb-5 flex justify-between items-center">
                    <p className="text-gray-500 text-lg">Всего статей: {total}</p>
                    <Link
                        href={addArticleAdmin()}
                        className="bg-blue-600 flex items-center gap-2 cursor-pointer text-white px-4 py-2 rounded-sm hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Добавить статью
                    </Link>
                </div>

                {articles.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Пока нет опубликованных новостей.</p>
                    </div>
                ) : (
                    <div className="block">
                        {articles.map((item) => (
                            <div key={item.id} className="flex justify-between items-center gap-4 bg-gray-700 py-2 px-4 rounded-sm shadow-md border hover:shadow-lg transition-shadow mb-4">
                                <div className="flex items-center justify-between gap-4">
                                    <img src={item.images && item.images.length > 0 ? `${item.images[0]}` : placeholder} alt={item.title} className="w-10 h-10 rounded-full" />
                                    <div className="">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-white">{item.title}</h3>
                                        </div>
                                        <div className="mb-2">
                                            <p className="text-sm text-gray-500">
                                                {new Date(item.created_at).toLocaleDateString('ru-RU')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                     onClick={() => handleEdit(item.id)}
                                     title="редактировать" 
                                     className="bg-blue-600 text-white px-2 py-2 rounded-sm hover:bg-blue-700 transition-colors cursor-pointer">
                                        <Edit className="w-5 h-5" />
                                    </button>

                                    <button
                                     title="удалить"
                                     className="bg-red-600 text-white px-2 py-2 rounded-sm hover:bg-red-700 transition-colors cursor-pointer"
                                     onClick={() => handleDelete(item.id)}
                                     >
                                        {processingNewsId === item.id ? (<Spinner />) : (<Trash className="w-5 h-5" />)}
                                       
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {total_pages > 1 && (
                    <Pagination className="mt-6">
                        <PaginationContent>
                            {links.find(link => link.label === '&laquo; Previous')?.url && (
                                <PaginationItem>
                                    <PaginationPrevious 
                                        href={links.find(link => link.label === '&laquo; Previous')?.url || ''}
                                    />
                                </PaginationItem>
                            )}
                            {links
                                .filter(link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;')
                                .map((link, index) => (
                                    <PaginationItem key={index}>
                                        {link.label === '...' ? (
                                            <PaginationEllipsis />
                                        ) : (
                                            <PaginationLink 
                                                href={link.url || ''} 
                                                isActive={link.active || false}
                                            >
                                                {link.label}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                ))
                            }
                            {links.find(link => link.label === 'Next &raquo;')?.url && (
                                <PaginationItem>
                                    <PaginationNext 
                                        href={links.find(link => link.label === 'Next &raquo;')?.url || ''}
                                    />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
       </AppLayout>
    );
}
