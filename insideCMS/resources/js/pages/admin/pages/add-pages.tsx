import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head} from '@inertiajs/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';




const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Страницы',
        href: '/pages-admin',
    },
];

export default function AddPages() {



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Создать страницу">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>
                <h1 className="text-3xl font-bold text-foreground mb-4">Создать страницу</h1>
                <Alert variant="default" className="mb-4">
                    <Lock />
                    <AlertDescription>
                      API:  /api/v1/pages/slug
                    </AlertDescription>
                </Alert>
                

            </div>
       </AppLayout>
    );
}
