import TextEditor from '@/components/editor/TextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem} from '@/types';
import { Head, useForm} from '@inertiajs/react';
import { ChartLine, Cookie, LoaderCircle, Mail, PlusIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Консоль',
        href: dashboard().url,
    },
    {
        title: 'Настройки сайта',
        href: '/files-admin',
    },
];

const buttons = [
    {
        title: 'Код счетчика yandex метрики (ym)',
        icon: <ChartLine />,
        id: 1,
    },
    {
        title: 'Текст Cookie',
        icon: <Cookie />,
        id: 2,
    },
    {
        title: 'Почтовые ящики',
        icon: <Mail />,
        id: 3,
    },
]

interface SiteSettingsFormData {
    cookie_text : string[];
    cookie_link : string[];
    emails : string[];
    ym_code : string[];
}

interface SiteSettingsItem {
    slug: string;
    type: string;
    content: string[];
}

export default function SiteSettings({ settings }: { settings: SiteSettingsItem[] }) {
    const { data, setData, post, processing, reset, errors } = useForm<SiteSettingsFormData>({
        cookie_text: settings?.[0]?.content ?? [],
        cookie_link: settings?.[1]?.content ?? [],
        emails: settings?.[2]?.content ?? [],
        ym_code: settings?.[3]?.content ?? [],
    });
 
    const [selectedButton, setSelectedButton] = useState<number | null>(1);
    const [emails, setEmails] = useState<string[]>(settings?.[2]?.content ?? []);

    useEffect(() => {
        setData('emails', emails);
    }, [emails, setData]);

    const handleSubmit = () => {
        
        post('site-settings', {
            onSuccess: () => {
                reset();
                toast.success('Настройки сайта успешно сохранены');
            },
            onError: () => {
                toast.error('Ошибка при сохранении настроек сайта');
            },
        });
    }

    const handleUpdateContent = (value: string) => {
        setData('cookie_text', JSON.parse(value));
    }

    const handleAddEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
            setEmails([...emails, '']);
    }

    const handleEmailChange = (index: number, value: string) => {
        const updatedEmails = [...emails];
        updatedEmails[index] = value;
        setEmails(updatedEmails);
        setData('emails', updatedEmails);
    }
    const handleDeleteEmail = (index: number) => {
        const updatedEmails = [...emails];
        updatedEmails.splice(index, 1);
        setEmails(updatedEmails);
        setData('emails', updatedEmails);
    }
    
        return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Настройки сайта" />
            <h1 className="text-2xl font-bold mb-4">Настройки сайта</h1>

            <div className="flex gap-4 h-full">
                <div className="flex flex-col gap-2">
                    {buttons.map((button) => (
                        <Button 
                            key={button.title}
                            onClick={() => setSelectedButton(button.id)}
                            className='cursor-pointer'
                            variant={selectedButton === button.id ? 'default' : 'outline'}
                        >{button.icon} {button.title}</Button>
                    ))}
                </div>

                <div className="flex flex-col gap-2 justify-between pb-10 w-full px-4">
                    <div>
                        <div className={selectedButton === 1 ? 'block' : 'hidden'}>
                            <h2 className="text-lg font-bold mb-2">yandex метрика</h2>
                                <Label className="text-sm text-gray-500" htmlFor="ym-code">Код счетчика yandex метрики (ym)</Label>
                                <Input
                                    className="mt-1 block w-full" 
                                    id="ym-code" 
                                    placeholder="104070000" 
                                    defaultValue={data?.ym_code?.[0] ?? ''} 
                                    onChange={(e) => setData('ym_code', [e.target.value])} 
                                />
                        </div>

                        <div className={selectedButton === 2 ? 'block' : 'hidden'}>
                                <h2 className="text-lg font-bold mb-2">Текст Cookie</h2>
                                <div className="mb-2">
                                    <Label className="text-sm text-gray-500" htmlFor="cookie-text">Текст Cookie</Label>
                                    <TextEditor
                                        value={
                                            Array.isArray(data.cookie_text)
                                                ? JSON.stringify(data.cookie_text)
                                                : (typeof data.cookie_text === 'string' ? data.cookie_text : JSON.stringify(data.cookie_text ?? ''))
                                        } 
                                        onChange={(value) => handleUpdateContent(value)} 
                                     />
                                </div>
                                <div className="mb-2">
                                    <Label className="text-sm text-gray-500" htmlFor="ym-code">ссылка на страницу Cookie</Label>
                                    <Input 
                                        type="email" 
                                        className="mt-1 block w-full" id="cookie-link" 
                                        placeholder="https://example.com/cookie" 
                                        defaultValue={data?.cookie_link?.[0] ?? ''} 
                                        onChange={(e) => setData('cookie_link', [e.target.value])} />
                                </div>
                        </div>

                        <div className={selectedButton === 3 ? 'block' : 'hidden'}>
                                <Label className="text-sm text-gray-500" htmlFor="email-0">Почтовые ящики</Label>
                                {emails.map((email, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <div>
                                        <Input
                                            key={index}
                                            type="email"
                                            className="mt-1 block w-full"
                                            id={`email-${index}`}
                                            placeholder="example@example.com"
                                            value={email}
                                            onChange={(e) => handleEmailChange(index, e.target.value)}
                                        />

                                                <p className="text-red-500">{errors[`emails.${index}`]}</p>

                                        </div>
                                        <Button variant="destructive"
                                            onClick={() => handleDeleteEmail(index)}
                                            className="cursor-pointer"
                                            title="Удалить почтовый ящик"
                                        >
                                        <TrashIcon /></Button>
                                    </div>
                                ))}
                                <Button className="mt-2" onClick={handleAddEmail}><PlusIcon /> Добавить почтовый ящик</Button>
                        </div>
                   </div>

                   <Button 
                        className="bg-blue-600 flex items-center gap-2 cursor-pointer text-white rounded-sm hover:bg-blue-700 transition-colors max-w-[300px]"
                        onClick={handleSubmit}
                        disabled={processing}
                    >
                        {processing ? <LoaderCircle className="size-4 text-gray-500 animate-spin" /> : <SaveIcon className="size-4 text-gray-500"/>}
                        <span>Сохранить</span>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
