
import { Head } from '@inertiajs/react';

interface Result {
    title: string;
    description: string;
    content: string;
    type: string;
}
const typeTranslations: Record<string, string> = {
    article: 'Статья',
    service: 'Услуга',
    personas: 'Персона',
  };

export default function SearchResult({ results, query }: { results: Result[], query: string }) {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Head title="Результаты поиска">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">Результаты поиска по запросу: "{query}"</h1>
                
                <div className="mb-8">
                    {results.map((result, index) => (
                        <div key={index} className="mb-4">
                            <h2 className="text-lg font-bold">{result.title}</h2>
                            <p className="text-sm text-gray-500">{typeTranslations[result.type]}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}