import AppLayout from '@/layouts/app-layout';
import { addArticleAdmin, dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Plus, Lock, Search, Loader2} from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import ToggleLayout from '@/components/ToggleLayout/ToggleLayout';
import TaxonomyItem from '@/components/TaxonomyItem/TaxonomyItem';
import { Input } from '@/components/ui/input';

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
        title: 'Статьи',
        href: '/articles-admin',
    },
];

export default function ArticlesAdmin({ articles, links, total_pages, total }: ArticlesAdminPageProps) {
    const deleteForm = useForm();
    const [processingNewsId, setProcessingNewsId] = useState<number | null>(null);
    const [showSearch, setShowSearch] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        query: '',
    });

    const handleDelete = (id: number) => {
        setProcessingNewsId(id);

        deleteForm.delete(`articles/${id}`, {
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
        router.visit(`articles/${id}/edit`);
    };

    const handleShowSearchPanel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setShowSearch(!showSearch);

    };

    const handleSearchSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (data.query.trim() === '') return;

        post('/admin/articles-admin',{
            onSuccess: () => {
                reset();
                setShowSearch(false);
            },
            onError: () => {
                toast.error('Ошибка при выполнении поиска');
            }
        });
    }

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (data.query.trim() === '') return;

        post('/admin/articles-admin',{
            onSuccess: () => {
                reset();
                setShowSearch(false);
            },
            onError: () => {
                toast.error('Ошибка при выполнении поиска');
            }
        });
    }


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
                        className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center gap-2 cursor-pointer"                    >
                        <Plus className="w-5 h-5" />
                        Добавить статью
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <ToggleLayout />
                    <button 
                        title="Открыть панель поиска"
                        onClick={handleShowSearchPanel}
                        className="cursor-pointer mb-4"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {showSearch && (
                <div className="mb-4 flex items-center gap-2">
                    <Input 
                        type="text" 
                        name="query" 
                        placeholder="Поиск по названию" 
                        className="w-full" 
                        value={data.query}
                        onChange={(e) => setData('query', e.target.value)}
                        onKeyUp={handleKeyUp}
                        autoFocus
                    />
                    <button 
                        className="cursor-pointer" 
                        onClick={handleSearchSubmit}
                    >
                        {processing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Search className="w-5 h-5" />
                        )}
                    </button>
                </div>
                )}

                {articles.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Пока нет опубликованных новостей.</p>
                    </div>
                ) : (
                    <ul className="items-layout">
                        {articles.map((item) => (
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

                {total_pages > 1 && (
                    console.log(links),
            
                    <Pagination className="mt-6">
                        <PaginationContent>
                            {links.find(link => link.label === 'Предыдущая')?.url && (
                                <PaginationItem>
                                    <PaginationPrevious 
                                        href={links.find(link => link.label === 'Предыдущая')?.url || ''}
                                    />
                                </PaginationItem>
                            )}
                            {links
                                .filter(link => link.label !== 'Предыдущая' && link.label !== 'Следующая')
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
                            {links.find(link => link.label === 'Следующая')?.url && (
                                <PaginationItem>
                                    <PaginationNext 
                                        href={links.find(link => link.label === 'Следующая')?.url || ''}
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
