import AppLayout from '@/layouts/app-layout';
import { dashboard, newsAdmin, addNewsAdmin } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import NewsForm from '@/components/form/NewsForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Новости',
        href: newsAdmin().url,
    },
    {
        title: 'Добавить новость',
        href: addNewsAdmin().url,
    },
];

export default function AddNewsAdmin() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Добавить новость">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <h1 className="text-3xl font-bold text-white mb-4">Добавить новость</h1>
                
                <NewsForm />
            </div>

       </AppLayout>
    );
}
