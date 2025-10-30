import AppLayout from '@/layouts/app-layout';
import { addMenuAdmin, dashboard } from '@/routes';
import { type BreadcrumbItem} from '@/types';
import { Head} from '@inertiajs/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from '@inertiajs/react';

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
                <Link href={addMenuAdmin().url} className="btn btn-primary">Добавить меню</Link>
 
                {/* <MenuBuilder /> */}

                <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue="item-1"
                    >
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Главное меню</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                                2323232
                        </AccordionContent>
                    </AccordionItem>
                 </Accordion>
        </AppLayout>
    );
}
