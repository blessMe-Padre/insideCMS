import { useState, useEffect, type MouseEvent } from 'react';
import { FileManagerFile } from '@cubone/react-file-manager';
import { TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Popup from '@/components/popup/Popup';
import FileManagerComponent from '@/components/editor/fileManager/FileManagerComponent';

interface MainImagesComponentProps {
    label?: string;
    imagesList?: string[];
    setData: (key: 'images', value: string[]) => void;
}

/**
 * Компонент для выбора главной фотографии
 * @param label - label для input
 * @param imagesList - список изображений
 * @param setData - функция для установки данных
 */

export default function MainImagesComponent({ label = 'Изображение', imagesList, setData }: MainImagesComponentProps) {
    // File manager для главной фотографии
    const [activePopup, setActivePopup] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<FileManagerFile[]>([]);

    const handleRemoveImage = (e: MouseEvent<HTMLButtonElement>, fileIndex: number) => {
        e.preventDefault();

        if (selectedImage.length > 0) {
            setSelectedImage((prev) => prev.filter((_, index: number) => index !== fileIndex));
        } else if (imagesList && imagesList.length > 0) {
            const nextImages = imagesList.filter((_, index: number) => index !== fileIndex);
            setData('images', nextImages);
        }
    };

    useEffect(() => {
        if (selectedImage.length > 0) {
            setData('images', selectedImage.map((image) => image.path));
        }
    }, [selectedImage, setData]);

    return (
        <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
           {label}
        </label>

        {(() => {
            const images =
                selectedImage.length > 0
                    ? selectedImage.map((f) => f.path)
                    : (imagesList ?? []);

            if (images.length === 0) {
                return null;
            }

            return (
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {images.map((url: string, index: number) => (
                        <div key={`main-image-${index}`} className="relative">
                            <button
                                className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700 z-10"
                                onClick={(e) => handleRemoveImage(e, index)}>
                                <TrashIcon className="w-4 h-4" />
                            </button>
                            <img
                                src={url}
                                alt={`Main ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-md border"
                            />
                        </div>
                    ))}
                </div>
            );
        })()}

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
    );
}