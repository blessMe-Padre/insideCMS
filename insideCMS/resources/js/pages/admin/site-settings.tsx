import TextEditor from '@/components/editor/TextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem} from '@/types';
import { Head, useForm} from '@inertiajs/react';
import { ChartLine, Cookie, LoaderCircle, Mail, PlusIcon, SaveIcon } from 'lucide-react';
import { useState } from 'react';
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
    ym_code: string;
    cookie_text: string;
    cookie_link: string;
    emails: string[];
}

export default function SiteSettings() {
    const { data, setData, post, processing, reset } = useForm<SiteSettingsFormData>({
        ym_code: '',
        cookie_text: '',
        cookie_link: '',
        emails: [],
    });
    console.log('data', data);
  
    const [selectedButton, setSelectedButton] = useState<number | null>(1);
    const [emails, setEmails] = useState<string[]>(data?.emails || []);

    const handleSubmit = () => {
        post('/', {
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
        setData('cookie_text', value);
    }

    const handleAddEmail = () => {
        setEmails([...emails, '']);
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
                                    value={data?.ym_code} 
                                    onChange={(e) => setData('ym_code', e.target.value)} 
                                />
                        </div>

                        <div className={selectedButton === 2 ? 'block' : 'hidden'}>
                                <h2 className="text-lg font-bold mb-2">Текст Cookie</h2>
                                <div className="mb-2">
                                    <Label className="text-sm text-gray-500" htmlFor="cookie-text">Текст Cookie</Label>
                                    <TextEditor value={''} onChange={(value) => handleUpdateContent(value)} />
                                </div>
                                <div className="mb-2">
                                    <Label className="text-sm text-gray-500" htmlFor="ym-code">ссылка на страницу Cookie</Label>
                                    <Input className="mt-1 block w-full" id="cookie-link" placeholder="https://example.com/cookie" />
                                </div>
                        </div>

                        <div className={selectedButton === 3 ? 'block' : 'hidden'}>
                                <Label className="text-sm text-gray-500" htmlFor="ym-code">Почтовые ящики</Label>
                                <Input className="mt-1 block w-full" id="ym-code" placeholder="example@example.com" />
                                {emails.map((email, index) => (
                                    <Input key={index} className="mt-1 block w-full" id="ym-code" placeholder="example@example.com" />
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
