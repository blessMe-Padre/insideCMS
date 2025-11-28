import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head} from '@inertiajs/react';
import PageBuilderForm from '@/components/form/PageBuilderForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface Component {
    id: string;
    name: string;
    description: string;
    type: string;
    content?: string;
    component_id: string;
}

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

export default function AddPages({ components }: { components: Component[] }) {

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
                    <Info />
                    <AlertDescription>
                        <p>Для транслита используйте <a className="text-blue-500 hover:text-blue-700" href="https://www.itranslit.com/" target="_blank">этот сервис</a></p>
                        <p>Тексты форматируйте с помощью <a className="text-blue-500 hover:text-blue-700" href="https://www.artlebedev.ru/typograf/" target="_blank">Типографа</a></p>
                    </AlertDescription>
                 </Alert>
                <PageBuilderForm components={components}/>
            </div>
       </AppLayout>
    );
}
