import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2Icon, SearchIcon, XIcon } from 'lucide-react';

export default function Search() {
    const [inputValue, setInputValue] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [dataList, setData] = useState([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setInputValue('');
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleSearchSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (inputValue.trim() === '') return;
        console.log('search', inputValue);
    };

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current)
        }

        if (inputValue.trim() === '') {
            setData([])
            return
        }

        setLoading(true)
        debounceTimeout.current = setTimeout(async () => {
            setLoading(false)
        }, 1000)

        return () => debounceTimeout.current && clearTimeout(debounceTimeout.current as NodeJS.Timeout)
    }, [inputValue])
  
    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                <Input 
                    type="text" 
                    placeholder='Поиск'
                    value={inputValue}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 1000)} // задержка, чтобы кликнуть по элементу
                />

                <Button
                    title="Очистить поиск"
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                >
                    <XIcon />
                </Button>

                <Button
                    title="Найти"
                    variant="default"
                    size="icon"
                    onClick={(e) => handleSearchSubmit(e)}
                >
                    <SearchIcon />
                </Button>
            </div>

            {
                        isFocused && (
                            <ul className="list-none">
                                {inputValue.trim() === '' && <li>Начните печатать</li>}
                                {loading && <Loader2Icon className="animate-spin" width={20} height={20} />}
                                {!loading && dataList.length === 0 && inputValue.trim() !== '' && (
                                    <li>Ничего не найдено</li>
                                )}

                                {
                                    !loading &&
                                    dataList.map((product, index) => {
                                        return (
                                            <li key={index}>     
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        )
                    }

        </div>
    );
}