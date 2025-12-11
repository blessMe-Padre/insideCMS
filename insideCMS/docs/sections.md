## CRUD Sections — документация

### 1. Назначение и обзор

- **Сущность**: `Section` — разделы сайта (контейнеры контента), собираемые из компонентов.
- **Особенности**:
  - каждый раздел описывается полями `name`, `slug`, `description`;
  - содержимое раздела строится из набора `Component` через пивот‑таблицу `section_components`;
  - разделы используются как универсальные блоки, данные по ним отдаются по API.
- **Где используется**:
  - Админ‑панель:
    - список разделов: `/admin/sections-admin`
    - создание: `/admin/add-section`
    - редактирование: `/admin/sections/{section}/edit`
  - Публичное API:
    - список: `GET /api/v1/sections`
    - один раздел по slug: `GET /api/v1/sections/{slug}`

---

### 2. Модели и структура данных

#### 2.1. Модель `Section`

- **Модель**: `App\Models\Section`
- **Таблица**: `sections`

Поля таблицы (миграция `2025_11_06_010000_create_sections_table.php`):

- **id**: `bigint`, PK, автоинкремент.
- **name**: `string`, название раздела.
- **slug**: `string`, идентификатор раздела (для API/шаблонов).
- **description**: `text`, описание раздела.
- **created_at / updated_at**: timestamp‑поля.

Настройки модели:

- **$fillable**: `name`, `slug`, `description`.
- **Связи**:
  - `components(): BelongsToMany`:
    - связь многие-ко‑многим с `Component` через таблицу `section_components`,
    - используется `withPivot('data')`, `withTimestamps()`.

#### 2.2. Пивот‑таблица `section_components`

- **Миграция**: `2025_11_06_010100_create_section_components_table.php`.
- **Таблица**: `section_components`.

Поля:

- **id**: PK, автоинкремент.
- **section_id**: `foreignId`, внешний ключ на `sections.id`, `onDelete('cascade')`.
- **component_id**: `foreignId`, внешний ключ на `components.id`, `onDelete('cascade')`.
- **data**: `json`, данные компонента внутри раздела.
- **timestamps**.

Модель: `App\Models\Section_component`

- **$table**: `section_components`.
- **$fillable**: `section_id`, `component_id`, `data`.
- **$casts**:
  - `data` → `array`.

---

### 3. Роли и доступ

- Админ‑роуты для разделов объявлены в `routes/admin.php` в группе:
  - middleware: `auth`, `verified`, `App\Http\Middleware\AdminAccess`,
  - префикс: `/admin`.
- Доступ к CRUD разделов:
  - только у авторизованных администраторов.
- Публичное API `/api/v1/sections` доступно без авторизации (стандартные `apiResource`‑роуты).

---

### 4. Админ‑интерфейс (UI‑сценарии)

#### 4.1. Список разделов

- **Роут**:
  - `GET /admin/sections-admin` — страница списка (`SectionController@index`).
- **Контроллер**: `App\Http\Controllers\SectionController@index`.
- **Поведение**:
  - Загружает все разделы: `Section::all()`.
  - Передаёт их во фронт:
    - проп `sections` — массив объектов `Section`.

Фронтенд‑страница: `resources/js/pages/admin/sections/sections-admin.tsx`.

- Отображает:
  - заголовок «Разделы» и Popover с подсказкой:
    - данные разделов доступны только по API,
    - для прокидывания в blade‑шаблоны следует использовать `SectionController`.
  - блок `Alert` с указанием API:
    - `API: /api/v1/sections/`.
  - количество разделов: `sections.length`.
  - кнопку «Создать раздел», ведущую на `addSection()` (`/admin/add-section`).
- Список:
  - если `sections.length === 0` — сообщение «Создайте свою первую секцию».
  - иначе — рендер списка через `TaxonomyItem`:
    - `handleEdit(id)` → переход на `/admin/sections/{id}/edit`,
    - `handleDelete(id)` → `DELETE /admin/sections/{id}`.
- Удаление:
  - `deleteForm.delete('/admin/sections/{id}')`.
  - При успехе:
    - тост `Раздел удален`.
  - При ошибке:
    - тост `Ошибка при удалении раздела`.

---

#### 4.2. Создание раздела

- **Роуты**:
  - `GET /admin/add-section` — страница создания.
  - `POST /admin/sections` — сохранение нового раздела.
- **Контроллер**:
  - `create()`:
    - загружает все `Component`,
    - рендерит `admin/sections/add-section` с пропом `components`.
  - `store(Request $request)`:
    - создаёт раздел,
    - создаёт связку с компонентами через `section_components`.

Валидация (`SectionController@store`):

- `name`: `required|string|max:255`
- `slug`: `required|string|max:255`
- `description`: `string|max:2000`

Создание раздела:

- `Section::create` с полями:
  - `name`, `slug`, `description`.

Создание компонентов раздела:

- Ожидается массив `elements` в запросе.
- Для каждого элемента:
  - `component_id` — ID компонента,
  - `content` — строка (JSON или текст).
- Логика:

  - `contentJson = json_decode($element['content'], true)`.
  - Если `contentJson` — массив:
    - `data` = `contentJson`.
  - Иначе:
    - `data` = массив с одной строкой `[$element['content']]`.
  - В таблицу `section_components` создаётся запись:
    - `section_id`, `component_id`, `data`.

- На успех:
  - редирект на `route('sections-admin')` с сообщением `Раздел создан`.

Форма создания: `resources/js/components/form/SectionsBuilderForm.tsx`.

- Пропсы:
  - `components: Component[]` — список доступных компонентов для конструктора.
- Данные формы (`ArticleFormData` по названию интерфейса, но фактически для раздела):
  - `name`: название раздела,
  - `description`: краткое описание,
  - `slug`: slug,
  - `elements?: Element[]` — элементы конструктора.
- Стартовые значения:
  - `name: ''`, `description: ''`, `slug: ''`, `elements: []`.

Отправка:

- `post('sections')` (относительно `/admin`).
- При успехе:
  - `reset()` формы,
  - тост `Раздел создан успешно`.
- При ошибке:
  - тост `Ошибка при создании раздела`.

Генерация slug:

- Кнопка «Сгенерировать slug»:
  - использует `transliterateToSlug(data.name)`,
  - записывает результат в `slug`.

Конструктор элементов:

- Компонент `ElementsBuilder` управляет массивом `elements`:
  - каждый элемент содержит `id`, `component_id`, `content`, `description`, `type`.
  - значения `elements` уходят в бэкенд в поле `elements` и далее сохраняются в `section_components`.

---

#### 4.3. Редактирование раздела

- **Роуты**:
  - `GET /admin/sections/{section}/edit` — страница редактирования.
  - `POST /admin/sections/{section}` — сохранение изменений.
- **Контроллер**: `SectionController@edit` и `SectionController@update`.

Метод `edit(Section $section)`:

- Получает список компонентов раздела (`section_components`) с типами:
  - join с таблицей `components`:
    - `id`, `data`, `component_id`, `component_type`.
- Загружает все `Component`.
- Формирует набор данных:
  - `section` — текущий раздел,
  - `components` — список всех компонентов,
  - `sectionComponents` — существующие элементы конструктора (как массив).
- Рендерит `admin/sections/edit-section` с этими данными.

Метод `update(Request $request, Section $section)`:

- Валидация:
  - `name`: `required|string|max:255`
  - `slug`: `required|string|max:255`
  - `description`: `string|max:2000`

Обновление раздела:

- `Section::update` с:
  - `name`, `slug`, `description`.

Обновление компонентов:

- Сначала удаляются все существующие `section_components` по `section_id`.
- Затем, если пришло поле `components` (массив):
  - для каждого компонента:
    - `component_id`,
    - `data` — строка JSON (ожидается в `component['data']`).
  - `data` сохраняется как результат `json_decode($component['data'], true)` в поле `data`.

- На успех:
  - редирект на `route('sections-admin')` с сообщением `Раздел обновлен`.

---

#### 4.4. Удаление раздела

- **Роут**: `DELETE /admin/sections/{section}`.
- **Контроллер**: `SectionController@destroy(Section $section)`.
- **Поведение**:
  - Выполняется `$section->delete()`.
  - Благодаря `onDelete('cascade')` в миграции `section_components` связанные записи в `section_components` удаляются автоматически.
  - Редирект на `route('sections-admin')` с сообщением `Раздел удален`.

---

### 5. Публичное API

Роуты в `routes/api.php`:

- `Route::apiResource('sections', App\Http\Controllers\Api\V1\SectionController::class);`
- `Route::get('sections/{slug}', [SectionController::class, 'show']);`
- Префикс группы: `/api/v1`.

Итого по URL:

- **Список разделов**:
  - `GET /api/v1/sections`
- **Один раздел по slug**:
  - `GET /api/v1/sections/{slug}`

Контроллер: `App\Http\Controllers\Api\V1\SectionController`.

#### 5.1. Список разделов — `GET /api/v1/sections`

- Метод `index()`:
  - Возвращает `Section::with('components')->get()`.
  - Ответ — «сырой» список разделов с отношением `components` и pivot‑полем `data` (как оно сохранено в БД).
  - Отдельной обёртки в формате `{ status, data }` тут нет — возвращается чистый массив моделей.

#### 5.2. Один раздел по slug — `GET /api/v1/sections/{slug}`

- Метод `show(string $slug)`:
  - Ищет раздел с `with('components')` и `where('slug', $slug)->firstOrFail()`.
  - Формирует структуру:
    - `id`, `name`, `slug`, `description`,
    - `components`:
      - для каждого компонента:
        - `id`, `name`, `type`, `description`,
        - `content` — данные из pivot‑поля `data` после обработки:
          - `data = json_decode(pivot->data, true)`,
          - если `component->type === 'text'`:
            - берётся первый элемент массива `data[0]` (одно текстовое значение),
          - иначе — используется массив `data` как есть.
  - Возвращает JSON:
    - `status`: `"success"`,
    - `data`: объект раздела с компонентами.

---

### 6. Бизнес‑правила и особенности

- **Структура раздела**:
  - раздел определяется только тремя полями: `name`, `slug`, `description`;
  - содержимое формируется полностью из списка компонентов в `section_components`.
- **Slug**:
  - используется для доступа к разделу по API и, при необходимости, в шаблонах.
  - во фронте slug можно сгенерировать через `transliterateToSlug(name)`.
- **Компоненты**:
  - каждый раздел может включать несколько компонентов различных типов;
  - для текстовых компонентов содержимое представлено одной строкой;
  - для других типов компонентов данные хранятся в массиве (структурированный JSON).
- **Удаление**:
  - удаление раздела каскадно удаляет все привязанные компоненты (строки в `section_components`).
- **Использование в шаблонах**:
  - по подсказке в админке, если нужно отдать раздел в blade‑шаблон, рекомендуется использовать `SectionController` (например, отдельный метод в web‑роутах, который найдёт раздел по slug и передаст в view).

---

### 7. Возможные улучшения

- **Единый формат ответа API**:
  - выровнять `index()` под формат `{ status, data }`, как сделано в других API‑контроллерах (news/services/articles).
- **Уникальность slug**:
  - добавить уникальный индекс на `slug` в миграции и правило `unique:sections,slug` в валидацию.
- **Soft delete**:
  - опционально добавить `SoftDeletes`, если нужно временное скрытие разделов вместо физического удаления.


