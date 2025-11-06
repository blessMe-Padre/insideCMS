import AppLayout from '@/layouts/app-layout';
import { dashboard, personaAdmin, addPerson } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
// import ArticleForm from '@/components/form/ArticleForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Персоны',
        href: personaAdmin().url,
    },
    {
        title: 'Добавить персону',
        href: addPerson().url,
        },
    ];

export default function AddPerson() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Добавить персону">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <h1 className="text-3xl font-bold text-foreground mb-4">Добавить персону</h1>

                {/* <ArticleForm /> */}

            </div>

       </AppLayout>
    );
}
