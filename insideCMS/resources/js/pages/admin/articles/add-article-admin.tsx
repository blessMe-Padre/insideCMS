import AppLayout from '@/layouts/app-layout';
import { dashboard, articlesAdmin, addArticleAdmin } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ArticleForm from '@/components/form/ArticleForm';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Статьи',
        href: articlesAdmin().url,
    },
    {
        title: 'Добавить статью',
        href: addArticleAdmin().url,
    },
];

export default function AddArticleAdmin() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Добавить статью">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <h1 className="text-3xl font-bold text-foreground mb-4">Добавить статью</h1>

                <Alert variant="default" className="mb-4">
                    <Info />
                    <AlertDescription>
                        <p>Для транслита slug используйте <a className="text-blue-500 hover:text-blue-700" href="https://www.itranslit.com/" target="_blank">этот сервис</a></p>
                        <p>Тексты форматируйте с помощью <a className="text-blue-500 hover:text-blue-700" href="https://www.artlebedev.ru/typograf/" target="_blank">Типографа</a></p>
                    </AlertDescription>
                </Alert>

                <ArticleForm />

            </div>

       </AppLayout>
    );
}
