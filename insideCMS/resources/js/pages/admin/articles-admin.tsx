import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';


interface ArticlesAdminPageProps {
    articles: Articles[];
}

interface Articles {
    id: number;
    title: string;
    content: string;
    slug: string;
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

export default function ArticlesAdmin({ articles }: ArticlesAdminPageProps) {

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

                <div className="mb-3">
                    <p className="text-gray-500 text-lg">Всего статей: {articles.length}</p>
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-4">Все статьи</h1>
                           
            </div>

       </AppLayout>
    );
}
