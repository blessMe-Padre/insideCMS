import AppLayout from '@/layouts/app-layout';
import { addServices, dashboard } from '@/routes';
import { type BreadcrumbItem, type ServicesAdminPageProps } from '@/types';
import { Head, useForm, router, Link } from '@inertiajs/react';
import placeholder from '/public/placeholder.svg';
import { Edit, Info, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/spinner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ToggleLayout from '@/components/ToggleLayout/ToggleLayout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Услуги',
        href: '/services-admin',
    },
];

export default function ServicesAdmin({ services, links, total_pages, total}: ServicesAdminPageProps) {
    const deleteForm = useForm();
    const [processingNewsId, setProcessingNewsId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setProcessingNewsId(id);

        deleteForm.delete(`services/${id}`, {
            onSuccess: () => {
                setProcessingNewsId(null);
                toast.success('Услуга удалена');
            },
            onError: () => {
                toast.error('Ошибка при удалении услуги');
            }
        });
    };

    const handleEdit = (id: number) => {
        router.visit(`/admin/services/${id}/edit`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Услуги">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-3xl font-bold text-foreground">Услуги</h1>
                    <Popover>
                        <PopoverTrigger>
                            <Info />
                        </PopoverTrigger>
                        <PopoverContent className="background-lab w-full max-w-[450px]">
                            <p>Все записи этой таксономии хранятся в таблице services.</p>
                            <p>services_components - компоненты услуг</p>
                            <p>services_personas - персоны услуг</p>
                        </PopoverContent>
                    </Popover>
                </div>

                <Alert variant="default" className="mb-4">
                    <Lock />
                    <AlertDescription>
                      API:  /api/v1/services
                    </AlertDescription>
                </Alert>

                <div className="mb-5 flex justify-between items-center">
                    <p className="text-gray-500 text-lg">Всего услуг: {total}</p>
                    <Link
                        href={addServices()}
                        className="bg-blue-600 flex items-center gap-2 cursor-pointer text-white px-4 py-2 rounded-sm hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Добавить услугу
                    </Link>
                </div>
                <ToggleLayout />

                {services.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Пока нет опубликованных записей.</p>
                    </div>
                ) : (
                    <ul className="items-layout">
                        {services.map((item) => (
                            <li key={item.id} className="flex justify-between items-center gap-4 py-2 px-4 rounded-sm shadow-md border hover:shadow-lg transition-shadow mb-4" style={{ borderColor: 'var(--foreground)' }}>
                                <div className="flex items-center justify-between gap-4">
                                    <img src={item.images && item.images.length > 0 ? `${item.images[0]}` : (item.content && item.content.length > 0 ? `${item.content[0]}` : placeholder)} alt={item.title} className="w-10 h-10 rounded-full object-cover" />
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
                            </li>
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
