import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface ModulesSetting {
    id: number;
    module_name: string;
    module_description: string;
    is_active: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Настройка модулей',
        href: '/',
    },
];

export default function ModulesAdmin({ modules }: { modules: ModulesSetting[] }) {
    const [processingModuleId, setProcessingModuleId] = useState<number | null>(null);

    const handleToggleActive = (moduleId: number, isActive: boolean) => {
        setProcessingModuleId(moduleId);

        router.post(`/modules/${moduleId}/active`, {}, {
            onSuccess: () => {
                setProcessingModuleId(null);
                toast.success(isActive ? 'Модуль деактивирован' : 'Модуль активирован');
            },
            onError: () => {
                setProcessingModuleId(null);
                toast.error('Ошибка при изменении статуса модуля');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-8">
                <Head title="Настройка модулей">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>
                <h1 className="text-3xl font-bold text-foreground mb-4">Настройка модулей</h1>
                <p className="mb-4 text-sm text-gray-500">Подключите дополнительные модули для расширения функционала сайта</p>

                <ul className="space-y-4">
                    {modules.map((module) => (
                        <li key={module.id}  className="flex items-center justify-between max-w-md p-4 border rounded-lg">
                            <div>
                                <h2 className="text-lg font-bold text-foreground mb-2">{module.module_name}</h2>
                                <p className="mb-2 text-sm text-gray-500">{module.module_description}</p>
                            </div>
                            <div>
                                <Switch 
                                    checked={module.is_active} 
                                    disabled={processingModuleId === module.id}
                                    onCheckedChange={() => {
                                        handleToggleActive(module.id, module.is_active);
                                    }} 
                                />
                            </div>
                        </li>
                    ))}
                </ul>

           </div>
       </AppLayout>
    );
}
