import placeholder from '/public/placeholder.svg';
import { Edit, LoaderCircle,  Trash } from 'lucide-react';

interface TaxonomyItemProps {
    item: {
        id: number;
        title: string;
        content: string;
        slug: string;
        created_at: string;
        updated_at: string;
        excerpt: string;
        images: string[];
    };
    handleDelete: (id: number) => void;
    handleEdit: (id: number) => void;
    processingNewsId: number | null;
}

export default function TaxonomyItem( { item, handleDelete, handleEdit, processingNewsId }: TaxonomyItemProps) {

    return (
        <li key={item.id} className="flex justify-between gap-4 p-4 rounded-sm shadow-md border hover:shadow-lg transition-shadow 
        " style={{ borderColor: 'var(--foreground)' }}>

        <div className="flex justify-between gap-4">
            <img 
                src={item.images && item.images.length > 0 ? item.images[0] : placeholder} 
                alt={item.title} 
                className="w-15 h-15 rounded-full object-cover" 
            />

            <div className="">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                </div>
                <div className="mb-2">
                    <p className="text-sm text-gray-500">
                       slug: {item?.slug}
                    </p>
                </div>
                <div className="mb-2">
                    <p className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString('ru-RU')}
                    </p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <button
             onClick={() => handleEdit(item.id)}
             title="редактировать" 
             className="text-white px-2 py-2 rounded-sm hover:bg-blue-700 transition-colors cursor-pointer">
                <Edit className="w-5 h-5" />
            </button>

            <button
             title="удалить"
             className="text-white px-2 py-2 rounded-sm hover:bg-red-700 transition-colors cursor-pointer"
             onClick={() => handleDelete(item.id)}
             >
                {processingNewsId === item.id ? (<LoaderCircle className="w-5 h-5 animate-spin" />) : (<Trash className="w-5 h-5" />)}
               
            </button>
        </div>
    </li>
    );
}