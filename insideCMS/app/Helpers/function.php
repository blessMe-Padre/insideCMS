<?php

use App\Models\ModulesSetting;

function getModules()
{
    return ModulesSetting::all()->keyBy('module_slug')->toArray();
}

function transliterateFileName($filename)
{
    // Удаляем расширение, если есть
    $filename = pathinfo($filename, PATHINFO_FILENAME);

    // Таблица транслитерации
    $translit = [
        'А'=>'A','Б'=>'B','В'=>'V','Г'=>'G','Д'=>'D','Е'=>'E','Ё'=>'E','Ж'=>'Zh','З'=>'Z','И'=>'I','Й'=>'Y',
        'К'=>'K','Л'=>'L','М'=>'M','Н'=>'N','О'=>'O','П'=>'P','Р'=>'R','С'=>'S','Т'=>'T','У'=>'U','Ф'=>'F',
        'Х'=>'Kh','Ц'=>'Ts','Ч'=>'Ch','Ш'=>'Sh','Щ'=>'Sch','Ъ'=>'','Ы'=>'Y','Ь'=>'','Э'=>'E','Ю'=>'Yu','Я'=>'Ya',
        'а'=>'a','б'=>'b','в'=>'v','г'=>'g','д'=>'d','е'=>'e','ё'=>'e','ж'=>'zh','з'=>'z','и'=>'i','й'=>'y',
        'к'=>'k','л'=>'l','м'=>'m','н'=>'n','о'=>'o','п'=>'p','р'=>'r','с'=>'s','т'=>'t','у'=>'u','ф'=>'f',
        'х'=>'kh','ц'=>'ts','ч'=>'ch','ш'=>'sh','щ'=>'sch','ъ'=>'','ы'=>'y','ь'=>'','э'=>'e','ю'=>'yu','я'=>'ya',
    ];

    // Транслитерация
    $filename = strtr($filename, $translit);

    // Заменяем пробелы и запрещённые символы на дефис
    $filename = preg_replace('/[^a-zA-Z0-9]+/', '-', $filename);

    // Убираем повторяющиеся дефисы и дефисы по краям
    $filename = preg_replace('/-+/', '-', $filename);
    $filename = trim($filename, '-');

    // Приводим к нижнему регистру
    $filename = strtolower($filename);

    return $filename;
}
