import AppLayout from '@/layouts/app-layout';
import { dashboard, servicesAdmin, addServices } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import ServicesBuilderForm from '@/components/form/ServicesBuilderForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Услуги',
        href: servicesAdmin().url,
    },
    {
        title: 'Добавить услугу',
        href: addServices().url,
        },
    ];

interface Component {
    id: string;
    name: string;
    description: string;
    type: string;
    content?: string;
    component_id: string;
}

interface Service {
    id: number;
    title: string;
    slug: string;
    description: string;
    parentId: number;
}

export default function AddServices({ components, services }: { components: Component[], services: Service[] }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <div className="px-4 py-8">
            <Head title="Создать услугу">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <h1 className="text-3xl font-bold text-foreground mb-4">Создать услугу</h1>
            <Alert variant="default" className="mb-4">
                <Info />
                <AlertDescription>
                    <p>Для транслита slug используйте <a className="text-blue-500 hover:text-blue-700" href="https://www.itranslit.com/" target="_blank">этот сервис</a></p>
                </AlertDescription>
            </Alert>
            <ServicesBuilderForm components={components} services={services}/>
            </div>
   </AppLayout>
    );
}
