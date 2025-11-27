import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem} from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { LoaderCircle, SaveIcon, Trash } from 'lucide-react';

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

export default function UserSettings({ users, roles }: { users: UserType[], roles: Role_userType[] }) {
    const deleteForm = useForm();
    const [processingUserId, setProcessingUserId] = useState<number | null>(null);

    const handleDelete = (userId: number) => {
        setProcessingUserId(userId);
        deleteForm.delete(`/admin/user-settings/${userId}`, {
            onSuccess: () => {
                toast.success('Пользователь успешно удален');
            },
            onError: () => {
                toast.error('Ошибка при удалении пользователя');
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
            <h1 className="text-2xl font-bold mb-4">Настройки пользователей</h1>
            <div className="flex flex-col gap-4">
                
                {users.map((user) => (
                    <div key={user.id} className="flex flex-col gap-2">
                        <h2 className="text-lg font-bold">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <select 
                            name="role" 
                            id="role"
                            value={String(userRoles[user.id] ?? '')}
                            onChange={(e) => setUserRoles((prev) => ({
                                ...prev,
                                [user.id]: Number(e.target.value),
                            }))}
                        >
                            {rolesNames.map((role) => (
                                <option 
                                    key={role.id} 
                                    value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>

                        <button
                            title="удалить"
                            className="p-2 w-10 h-10 rounded-sm hover:bg-red-700 transition-colors cursor-pointer"
                            onClick={() => handleDelete(user.id)}
                        >
                            {processingUserId === user.id ? (<LoaderCircle className="w-5 h-5 animate-spin" />) : (<Trash className="w-5 h-5" />)}
                        </button>

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