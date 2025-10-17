import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head} from '@inertiajs/react';
import PageBuilderForm from '@/components/form/PageBuilderForm';


interface Component {
    id: string;
    name: string;
    description: string;
    content?: string;
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
                <PageBuilderForm components={components}/>
            </div>
       </AppLayout>
    );
}
