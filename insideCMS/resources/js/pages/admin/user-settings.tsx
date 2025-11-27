import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem} from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Info, LoaderCircle, SaveIcon, Trash } from 'lucide-react';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Настройки пользователей',
        href: '/user-settings',
    },
];

interface UserType {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: string;
    created_at: string;
    updated_at: string;
}

interface Role_userType {
    id: number;
    user_id: number;
    role_id: number;
    created_at: string;
    updated_at: string;
}

const rolesNames = [
    {
        id: 1,
        name: 'Администратор',
    },
    {
        id: 2,
        name: 'Менеджер',
    },
    {
        id: 3,
        name: 'Пользователь',
    },
];

export default function UserSettings({ users, roles, auth_user }: { users: UserType[], roles: Role_userType[], auth_user: UserType }) {
    const deleteForm = useForm();
    const [processingUserId, setProcessingUserId] = useState<number | null>(null);

    const handleDelete = (userId: number) => {
        setProcessingUserId(userId);
        deleteForm.delete(`/admin/user-settings/${userId}`, {

            onSuccess: (page) => {
                const successMessage = (page.props.flash as { success?: string })?.success;
                if (successMessage) {
                    toast.success(successMessage);
                }
            },

            onError: (errors) => {
                if (errors.delete) {
                    toast.error(String(errors.delete));
                } else {
                    toast.error('Ошибка при удалении пользователя');
                }
            },
            onFinish: () => {
                setProcessingUserId(null);
            },
        });
    }

    const { setData, post, processing, reset} = useForm<{ userRoles: Record<number, number> }>({
        userRoles: {},
    }); 

    const handleSubmit = () => {
        post('/admin/user-settings', {
            onSuccess: () => {
                reset();
                toast.success('Настройки пользователей успешно сохранены');
            },
            onError: () => {
                toast.error('Ошибка при сохранении настроек пользователей');
            },
        });
    }

    const [userRoles, setUserRoles] = useState<Record<number, number>>(() => {
        const initial: Record<number, number> = {};
        roles.forEach((role) => {
            initial[role.user_id] = role.role_id;
        });
        setData('userRoles', initial);
        return initial;
    });

    useEffect(() => {
        setData('userRoles', userRoles);
    }, [userRoles, setData]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Настройки пользователей" />

            <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-3xl font-bold text-foreground">Настройки пользователей</h1>
                    <Popover>
                        <PopoverTrigger>
                            <Info />
                        </PopoverTrigger>
                        <PopoverContent className="background-lab w-full max-w-[450px]">
                            <p>Для изменения роли пользователя, выберите роль из списка и нажмите кнопку "Сохранить".</p>
                            <p>Роли:</p>
                            <p>1 - Администратор</p>
                            <p>2 - Менеджер</p>
                            <p>3 - Пользователь</p>
                        </PopoverContent>
                    </Popover>
            </div>

            <div className="flex flex-col gap-4">
                {users && users.length > 0 && users.map((user) => (
                    <div key={user.id} className="flex flex-col gap-2">
                        <h2 className="text-lg font-bold">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>

                        <div className="flex items-center gap-2">
                            <Select
                                value={String(userRoles[user.id] ?? '')}
                                onValueChange={(value) =>
                                    setUserRoles((prev) => ({
                                        ...prev,
                                        [user.id]: Number(value),
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите роль" />
                                </SelectTrigger>
                                <SelectContent>
                                    {rolesNames.map((role) => (
                                        <SelectItem 
                                            key={role.id} 
                                            value={String(role.id)}
                                        >
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <button
                                title="удалить"
                                className="flex items-center justify-center p-2 w-10 h-10 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors cursor-pointer"
                                onClick={() => handleDelete(user.id)}
                                disabled={auth_user.id === user.id}
                            >
                                {processingUserId === user.id ? (<LoaderCircle className="w-5 h-5 animate-spin" />) : (<Trash className="w-5 h-5" />)}
                            </button>
                        </div>
                    </div>
                ))}

                <Button 
                        className="bg-blue-600 flex items-center gap-2 cursor-pointer text-white rounded-sm hover:bg-blue-700 transition-colors max-w-[300px]"
                        onClick={handleSubmit}
                        disabled={processing}
                    >
                        {processing ? <LoaderCircle className="size-4 text-gray-500 animate-spin" /> : <SaveIcon className="size-4 text-gray-500"/>}
                        <span>Сохранить</span>
                    </Button>
            </div>

        </AppLayout>
    );
}