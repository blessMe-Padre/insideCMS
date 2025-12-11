import { router, useForm } from '@inertiajs/react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { LoaderCircle, SaveIcon } from 'lucide-react';
import { sectionsAdmin } from '@/routes';
import transliterateToSlug from '@/utils/transliterateToSlug';
import { Input } from '@/components/ui/input';
import ElementsBuilder from '../ElementsBuilder/ElementsBuilder';

interface ArticleFormData {
    name: string;
    description: string;
    slug: string;
    images?: File[];
    images_urls?: string[];
    elements?: Element[];
}

interface Element {
    id: string;
    type?: string;
    description?: string;
    content?: string;
    component_id?: string;
}

interface Component {
    id: string;
    name: string;
    description: string;
    content?: string;
    type: string;
}

export default function SectionsBuilderForm({ components }: { components: Component[] }) {
       const { data, setData, post, processing, reset } = useForm<ArticleFormData>({
        name: '',
        description: '',
        slug: '',
        elements: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('sections', {
                onSuccess: () => {
                    reset();
                    toast.success('Раздел создан успешно');
            },
            onError: () => {
                toast.error('Ошибка при создании раздела');
            },
        });
    }

    const handleGenerateSlug = (e: React.MouseEvent) => {
        e.preventDefault();
        const slug = transliterateToSlug(data.name);
        setData('slug', slug);
    }       

    return (
        <>
           <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Название раздела
                </label>
                <Input 
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Введите название раздела..."
                    className="w-full p-2 border rounded"
                />
           </div>
           <div className="mb-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                </label>
                <Input 
                    value={data.slug}
                    onChange={(e) => setData('slug', e.target.value)}
                    placeholder="Введите slug..."
                    className="w-full p-2 border rounded"
                />
                <button className="cursor-pointer text-[10px] underline text-blue-500 transition-colors hover:text-blue-700" onClick={handleGenerateSlug}>Сгенерировать slug</button>

           </div>
           <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                </label>
                <Input 
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Введите описание..."
                    className="w-full p-2 border rounded"
                />
           </div>

            <ElementsBuilder
                components={components}
                elements={data.elements || []}
                onChangeElements={(nextElements) => setData('elements', nextElements)}
            />

            <div className="flex gap-2">
            <Button 
                className="bg-blue-600 flex items-center gap-2 cursor-pointer text-white px-4 py-2 rounded-sm hover:bg-blue-700 transition-colors"
                onClick={handleSubmit}
                disabled={processing}
            >
                {processing ? <LoaderCircle className="size-4 text-gray-500 animate-spin" /> : <SaveIcon className="size-4 text-gray-500"/>}
                <span>Сохранить</span>
            </Button>
            <Button
                type="button"
                onClick={() => router.visit(sectionsAdmin().url)}
                disabled={processing}
                className="bg-gray-500 text-white cursor-pointer px-4 p-2 rounded-sm hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Отмена
            </Button>
            </div>
        </>
    );
}