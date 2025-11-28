import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2Icon, SearchIcon, XIcon } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function Search() {
    const [inputValue, setInputValue] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [dataList, setData] = useState([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

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
        router.visit(`/search?query=${encodeURIComponent(inputValue)}`);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.which === 13) {
            if (inputValue.trim() === '') return;
            router.visit(`/search?query=${encodeURIComponent(inputValue)}`);
        }
    }

    const highlightText = (text: string, highlight: string  ) => {
        if (!highlight) return text;

        const regex = new RegExp(`(${highlight})`, 'i');
        const match = text.match(regex);

        if (!match) return text;

        const parts = text.split(regex);
        return (
            <>
                {parts[0]}
                <mark>{parts[1]}</mark>
                {parts[2]}
            </>
        );
    };

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
            debounceTimeout.current = null;
        }

        if (inputValue.trim() === '') {
            setData([])
            setLoading(false)
            return
        }

        setLoading(true)
        debounceTimeout.current = setTimeout(async () => {
            try {
                const result = await fetch('/api/v1/search?query=' + encodeURIComponent(inputValue));
                const data = await result.json();

                setData(data.data);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка загрузки Объектов:', error)
                setLoading(false);
            }
        }, 1000)

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
                debounceTimeout.current = null;
            }
        }
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
                    onKeyUp={handleKeyUp}
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
                            dataList.map((item: { title: string, slug: string, type: string }, index: number) => {
                                return (
                                    <li key={index}>     
                                        <a href={`/articles/${item.slug}`} className="block underline">
                                            {highlightText(item.title, inputValue)}
                                        </a>
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