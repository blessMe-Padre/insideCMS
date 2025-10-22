import AppLayout from '@/layouts/app-layout';
import { dashboard, articlesAdmin, addArticleAdmin } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ArticleForm from '@/components/form/ArticleForm';

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

                <ArticleForm />

            </div>

       </AppLayout>
    );
}
