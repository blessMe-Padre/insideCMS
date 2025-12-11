import { useState, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import { FileManagerFile } from '@cubone/react-file-manager';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { LoaderCircle, SaveIcon, TrashIcon } from 'lucide-react';
import FileManagerComponent from '../editor/fileManager/FileManagerComponent';
import Popup from '../popup/Popup';
import { personaAdmin } from '@/routes';
import transliterateToSlug from '@/utils/transliterateToSlug';
import { Input } from '@/components/ui/input';
import ElementsBuilder from '../ElementsBuilder/ElementsBuilder';

interface ArticleFormData {
    name: string;
    slug: string;
    content?: string[];
    elements?: Element[];
    images?: string[];
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

export default function PersonBuilderForm({ components }: { components: Component[] }) {
       const { data, setData, post, processing, reset } = useForm<ArticleFormData>({
        name: '',
        slug: '',
        elements: [],
        content: [],
        images: [],
    });

    // File manager для главной фотографии
    const [activePopup, setActivePopup] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<FileManagerFile[]>([]);

    const handleRemoveTopImage = (e: React.MouseEvent, fileIndex: number) => {
        e.preventDefault();
        setSelectedImage((prev) => prev.filter((_, index) => index !== fileIndex));
    };

    useEffect(() => {
        if (selectedImage.length > 0) {
            setData('images', selectedImage.map((image) => image.path));
        }
    }, [selectedImage, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('persons', {
                onSuccess: () => {
                    reset();
                    toast.success('Персона создана успешно');
            },
            onError: () => {
                toast.error('Ошибка при создании персоны');
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
                    Имя
                </label>
                <Input 
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Введите имя..."
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
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                   Фотография
                </label>

                {selectedImage.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {selectedImage.map((file, index) => (
                            <div key={`selected-${index}`} className="relative">
                                <button
                                    className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700 z-10"
                                    onClick={(e) => handleRemoveTopImage(e, index)}>
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                                <img  
                                    src={file.path} 
                                    alt={`Selected ${index + 1}`} 
                                    className="w-20 h-20 object-cover rounded-md border"
                                />
                            </div>
                        ))}
                    </div>
                )}

                <Button 
                    variant="outline" 
                    onClick={(e) => {
                        e.preventDefault();
                        setActivePopup(true);
                    }}>Выбрать файл</Button>
                <Popup activePopup={activePopup} setActivePopup={setActivePopup}>
                    <FileManagerComponent initialFiles={[]} setActivePopup={setActivePopup} setSelectedFiles={setSelectedImage} />
                </Popup>
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
                onClick={() => router.visit(personaAdmin().url)}
                disabled={processing}
                className="bg-gray-500 text-white cursor-pointer px-4 p-2 rounded-sm hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Отмена
            </Button>
            </div>
        </>
    );
}