import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem} from '@/types';
import { Head} from '@inertiajs/react';
import MenuEditor from '@/components/menuEditor/MenuEditor';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Меню',
        href: '#',
    },
];

export default function MenuAdmin() {
        return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Меню" />
                <h2 className="mb-4 text-xl font-semibold">Меню</h2>
                
                <MenuEditor />
        </AppLayout>
    );
}
