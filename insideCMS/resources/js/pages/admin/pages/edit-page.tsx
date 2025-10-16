import AppLayout from '@/layouts/app-layout';
import { dashboard, pagesAdmin } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Страницы',
        href: pagesAdmin().url,
    },
    {
        title: 'Редактировать страницу',
        href: '#',
    },
];

interface Page {
    id: number;
    name: string;
    slug: string;
    description: string;
}

export default function EditPage({ page }: { page: Page }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Редактировать страницу">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <h1 className="text-3xl font-bold text-foreground mb-4">Редактировать страницу</h1>

                {page.name}
            </div>

       </AppLayout>
    );
}
