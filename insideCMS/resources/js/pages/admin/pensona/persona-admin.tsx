import AppLayout from '@/layouts/app-layout';
import { addPerson, dashboard } from '@/routes';
import { type BreadcrumbItem, type PersonaAdminPageProps } from '@/types';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Info, Plus, Lock } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ToggleLayout from '@/components/ToggleLayout/ToggleLayout';
import TaxonomyItem from '@/components/TaxonomyItem/TaxonomyItem';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Персоны',
        href: '/admin/persons-admin',
    },
];

export default function PersonaAdmin({ persons, links, total_pages, total}: PersonaAdminPageProps) {
    const deleteForm = useForm();
    const [processingNewsId, setProcessingNewsId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setProcessingNewsId(id);

        deleteForm.delete(`/admin/persons/${id}`, {
            onSuccess: () => {
                setProcessingNewsId(null);
                toast.success('Персона удалена');
            },
            onError: () => {
                toast.error('Ошибка при удалении персоны');
            }
        });
    };

    const handleEdit = (id: number) => {
        router.visit(`/admin/persons/${id}/edit`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Персоны">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-3xl font-bold text-foreground">Персоны</h1>
                    <Popover>
                        <PopoverTrigger>
                            <Info />
                        </PopoverTrigger>
                        <PopoverContent className="background-lab w-full max-w-[450px]">
                            <p>Все записи этой таксономии хранятся в таблице personas.</p>
                            <p>Персоны связаны с таблицей services через промежуточную таблицу services_personas.</p>
                            <p>Компоненты  из таблицы components связаны с таблицей personas через промежуточную таблицу personas_components.</p>
                        </PopoverContent>
                    </Popover>
                </div>

                <Alert variant="default" className="mb-4">
                    <Lock />
                    <AlertDescription>
                      API:  /api/v1/persons
                    </AlertDescription>
                </Alert>

                <div className="mb-5 flex justify-between items-center">
                    <p className="text-gray-500 text-lg">Всего персон: {total}</p>
                    <Link
                        href={addPerson()}
                        className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center gap-2 cursor-pointer"                    >
                        <Plus className="w-5 h-5" />
                        Добавить персону
                    </Link>
                </div>
                <ToggleLayout />

                {persons.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Пока нет опубликованных записей.</p>
                    </div>
                ) : (
                    <ul className="items-layout">
                        {persons.map((item) => (
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
