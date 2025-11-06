import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head} from '@inertiajs/react';
import SectionsBuilderForm from '@/components/form/SectionsBuilderForm';


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
        title: 'Разделы',
        href: '#',
    },
];

export default function AddSection({ components }: { components: Component[] }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Создать раздел">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>
                <h1 className="text-3xl font-bold text-foreground mb-4">Создать раздел</h1>
                <SectionsBuilderForm components={components}/>
            </div>
       </AppLayout>
    );
}
