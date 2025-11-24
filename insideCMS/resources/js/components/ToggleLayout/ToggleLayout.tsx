import { useState } from "react";
import { Grid, List } from "lucide-react";


export default function ToggleLayout() {
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');
    console.log(layout);

    const handleLayout = (layout: 'grid' | 'list') => {
        setLayout(layout);
    };

    

    return (
        <div className="flex items-center gap-2 mb-4">
            <button type="button" title="Показать ввиде списка" className='cursor-pointer' onClick={() => handleLayout('list')}>
                <List className="w-5 h-5" />
            </button>
            <button type="button" title="Показать ввиде карточек" className='cursor-pointer' onClick={() => handleLayout('grid')}>
                <Grid className="w-5 h-5" />
            </button>
        </div>
    );
}