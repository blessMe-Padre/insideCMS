import { useState, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import { FileManagerFile } from '@cubone/react-file-manager';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { LoaderCircle, SaveIcon, TrashIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FileManagerComponent from '../editor/fileManager/FileManagerComponent';
import Popup from '../popup/Popup';
import { servicesAdmin } from '@/routes';
import transliterateToSlug from '@/utils/transliterateToSlug';
import { Input } from '@/components/ui/input';
import ElementsBuilder from '../ElementsBuilder/ElementsBuilder';

interface ServicesFormData {
    title: string;
    description: string;
    slug: string;
    content?: string[];
    images?: string[];
    parentId?: number;
    personaIds?: number[];
    elements?: Element[];
}

interface Component {
    id: string;
    name: string;
    description: string;
    content?: string;
    type: string;
}

interface Service {
    id: number;
    title: string;
    slug: string;
    description: string;
    parentId: number;
}

interface Persona {
    id: number;
    name: string;
}

interface Element {
    id: string;
    type?: string;
    description?: string;
    content?: string;
    component_id?: string;
}

export default function ServicesBuilderForm({ components, services, personas }: { components: Component[], services: Service[], personas: Persona[] }) {
       const { data, setData, post, processing, reset, transform } = useForm<ServicesFormData>({
        title: '',
        description: '',
        slug: '',
        content: [],
        images: [],
        parentId: 0,
        personaIds: [],
        elements: [],
    });

    // File manager (главные изображения услуги)
    const [activePopup, setActivePopup] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<FileManagerFile[]>([]);

    useEffect(() => {
        if (selectedImage.length > 0) {
            setData('images', selectedImage.map((image) => image.path));
        }
    }, [selectedImage, setData]);

    const handleRemoveTopImage = (e: React.MouseEvent, fileIndex: number) => {
        e.preventDefault();
        setSelectedImage((prev) => prev.filter((_, index) => index !== fileIndex));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((form) => ({
            ...form,
            parentId: form.parentId && form.parentId > 0 ? form.parentId : undefined,
            personaIds: form.personaIds && form.personaIds.length > 0 ? form.personaIds : undefined,
        }));

        post('services', {
            onSuccess: () => {
                reset();
                toast.success('Услуга создана успешно');
            },
            onError: () => {
                toast.error('Ошибка при создании услуги');
            },
        });
    }

    const handleSelectParent = (value: string) => {
        setData('parentId', parseInt(value));
    }

    const handleAddPersona = (value: string) => {
        const id = parseInt(value);
        const current = Array.isArray(data.personaIds) ? data.personaIds : [];
        if (!current.includes(id)) {
            setData('personaIds', [...current, id]);
        }
    }

    const handleRemovePersona = (id: number) => {
        const current = Array.isArray(data.personaIds) ? data.personaIds : [];
        const next = current.filter((x) => x !== id);
        setData('personaIds', next);
    }

    const handleGenerateSlug = (e: React.MouseEvent) => {
        e.preventDefault();
        const slug = transliterateToSlug(data.title);
        setData('slug', slug);
    }

    return (
        <>
           <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Название
                </label>
                <Input 
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Введите название..."
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
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                </label>
                <Input 
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Введите описание..."
                    className="w-full p-2 border rounded"
                />
           </div>
           <div className="mb-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Родительская услуга
                </label>
 
                <Select onValueChange={handleSelectParent}>
                    <SelectTrigger className="w-[320px]">
                        <SelectValue placeholder="Выберите родителя" />
                    </SelectTrigger>
                    <SelectContent>
                        {services.map((service) => (
                            <SelectItem key={service.id} value={service.id.toString()}>{service.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
           </div>
           <div className="mb-4">
                <label htmlFor="persona" className="block text-sm font-medium text-gray-700 mb-1">
                    Персона
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {(data.personaIds ?? []).map((id) => {
                        const p = personas.find((pp) => pp.id === id);
                        return (
                            <div key={id} className="flex items-center gap-2 border rounded px-2 py-1">
                                <span>{p?.name ?? id}</span>
                                <button onClick={(e) => { e.preventDefault(); handleRemovePersona(id); }}>
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>
                <Select onValueChange={handleAddPersona}>
                    <SelectTrigger className="w-[320px]">
                        <SelectValue placeholder="Добавить персону" />
                    </SelectTrigger>
                    <SelectContent>
                        {personas.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2" />
           </div>
           <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                   Изображения
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
                onClick={() => router.visit(servicesAdmin().url)}
                disabled={processing}
                className="bg-gray-500 text-white cursor-pointer px-4 p-2 rounded-sm hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Отмена
            </Button>
            </div>
        </>
    );
}