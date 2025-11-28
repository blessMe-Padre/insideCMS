export default function transliterateToSlug(name: string) {
    // Таблица транслитерации
    const translitMap = {
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y',
        'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F',
        'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y',
        'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
        'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    };

    // Удаляем расширение (если нужно — как в PHP-версии)
    const filename = name.includes('.') ? name.substring(0, name.lastIndexOf('.')) : name;

    // Транслитерация
    let transliterated = '';
    for (const char of filename) {
        transliterated += translitMap[char as keyof typeof translitMap] !== undefined ? translitMap[char as keyof typeof translitMap] : char;
    }

    // Заменяем всё, кроме букв и цифр, на дефис
    let slug = transliterated.replace(/[^a-zA-Z0-9]+/g, '-');

    // Убираем повторяющиеся дефисы и дефисы по краям
    slug = slug.replace(/-+/g, '-').replace(/^-+|-+$/g, '');

    // Приводим к нижнему регистру
    return slug.toLowerCase();
}