import AppLayout from '@/layouts/app-layout';
import { dashboard, newsAdmin, addNewsAdmin } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import NewsForm from '@/components/form/NewsForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

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

                <Alert variant="default" className="mb-4">
                    <Info />
                    <AlertDescription>
                        <p>Для транслита slug используйте <a className="text-blue-500 hover:text-blue-700" href="https://www.itranslit.com/" target="_blank">этот сервис</a></p>
                    </AlertDescription>
                </Alert>
                
                <NewsForm />
            </div>

       </AppLayout>
    );
}
