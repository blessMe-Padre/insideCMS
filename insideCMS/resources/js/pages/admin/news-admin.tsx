import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import NewsForm from '@/components/form/NewsForm';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

interface NewsAdminPageProps {
    news: News[];
}

interface News {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Отзывы">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <h1 className="text-3xl font-bold text-white mb-4">Все новости</h1>

                
                
            </div>

       </AppLayout>
    );
}
