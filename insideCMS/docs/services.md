## CRUD Services — документация

### 1. Назначение и обзор

- **Сущность**: `Service` — услуги сайта.
- **Особенность**: у услуги есть:
  - иерархия (родительская услуга через `parentId`);
  - связь многие-ко‑многим с `Personas` через таблицу `service_personas`;
  - связь с `Component` через таблицу `services_components` (конструктор контента).
- **Где используется**:
  - Админ‑панель:
    - список услуг: `/admin/services-admin`
    - создание: `/admin/add-services`
    - редактирование: `/admin/services/{service}/edit`
  - Публичное API:
    - список: `GET /api/v1/services`
    - одна услуга по `slug`: `GET /api/v1/services/{slug}`
- **Модульность**: доступ к CRUD услуг включается через модуль `services` (см. `routes/admin.php`, `$modules['services']['is_active']`).

---

### 2. Модель и структура данных

#### 2.1. Модель `Service`

- **Модель**: `App\Models\Service`
- **Таблица**: `services`

Поля таблицы (миграция `2025_11_07_013723_create_services_table.php`):

- **id**: `bigint`, PK, автоинкремент.
- **parentId**: `bigint`, `nullable`, внешний ключ на `services.id`, `nullOnDelete()` — иерархия услуг.
- **title**: `string`, название услуги, обязательно.
- **slug**: `string`, уникальный slug, `unique`.
- **description**: `string`, краткое описание, `nullable`.
- **images**: `json`, список изображений, `nullable`.
- **content**: `json`, произвольный дополнительный контент, `nullable`.
- **created_at / updated_at**: timestamp‑поля.

Настройки модели:

- **$fillable**:
  - `parentId`, `slug`, `title`, `images`, `description`, `content`.
- **$casts**:
  - `images` → `array`
  - `content` → `array`

Связи:

- `components(): BelongsToMany`:
  - связь многие-ко‑многим с `Component` через таблицу `services_components`,
  - используется `withPivot('data')`, `withTimestamps()`.
- `personas(): BelongsToMany`:
  - связь многие-ко‑многим с `Persona` через таблицу `service_personas`,
  - `withTimestamps()`.

#### 2.2. Пивот‑таблица `service_personas`

- **Миграция**: `2025_11_07_041233_create_service_personas_table.php`.
- **Таблица**: `service_personas`.

Поля:

- **id**: PK, автоинкремент.
- **service_id**: `foreignId`, внешний ключ на `services.id`, `onDelete('cascade')`.
- **persona_id**: `foreignId`, внешний ключ на `personas.id`, `onDelete('cascade')`.
- **timestamps**.

Модель: `App\Models\Service_persona`

- **$fillable**: `service_id`, `persona_id`.

#### 2.3. Модель `Persona` (важная для связи)

- **Модель**: `App\Models\Persona`
- **Основные поля**:
  - `name`, `slug`, `images` (каст `images` → `array`).
- Важное:
  - Используется в связи `Service::personas()` и в админ‑формах услуг.

---

### 3. Роли и доступ

- Все админ‑роуты `Service` находятся в группе:
  - middleware: `auth`, `verified`, `App\Http\Middleware\AdminAccess`,
  - префикс: `/admin`.
- Доступ к CRUD услуг:
  - только для авторизованных администраторов;
  - зависит от активного модуля `services` в настройках.
- Публичное API `/api/v1/services` доступно без авторизации (обычные `apiResource`‑роуты).

---

### 4. Админ‑интерфейс (UI‑сценарии)

#### 4.1. Список услуг

- **Роуты** (см. `routes/admin.php`):
  - `GET /admin/services-admin` — список услуг (`ServicesController@index`).
- **Контроллер**: `App\Http\Controllers\ServicesController@index`.
- **Пагинация**:
  - `Service::paginate(10)` — по 10 услуг на страницу.
  - В представление передаётся:
    - `services` — элементы текущей страницы,
    - `links` — массив ссылок пагинации,
    - `current_page`, `total_pages`, `per_page`, `total`.
- Фронтенд‑страница `admin/services/services-admin` (по аналогии с `news-admin`, с отображением списка и пагинацией).

---

#### 4.2. Создание услуги

- **Роуты**:
  - `GET /admin/add-services` — страница создания.
  - `POST /admin/services` — сохранение новой услуги.
- **Контроллер**:
  - `create()`:
    - рендерит `admin/services/add-services`,
    - передаёт:
      - `components` — все `Component`,
      - `services` — все `Service` (для выбора родителя),
      - `personas` — все `Persona` (для связи).
  - `store(Request $request)`:
    - создаёт услугу,
    - создаёт связи с `Personas`,
    - создаёт записи в `services_components` для конструктора.

Валидация при создании (`ServicesController@store`):

- `title`: `required|string|max:255`
- `slug`: `required|string|max:255|unique:services,slug`
- `description`: `nullable|string|max:255`
- `parentId`: `nullable|integer|exists:services,id`
- `personaIds`: `nullable|array`
- `personaIds.*`: `integer|exists:personas,id`
- `images`: `nullable|array`
- `images.*`: `string`
- `content`: `nullable|array`
- `content.*`: `string`
- `elements`: `sometimes|array` — элементы конструктора.
- `elements.*.component_id`: `integer|exists:components,id`
- `elements.*.content`: `nullable|string`

Создание записи `Service`:

- Поля:
  - `title`, `slug`,
  - `description` (или `null`),
  - `parentId` (или `null`),
  - `images` (массив или `[]`),
  - `content` (массив или `[]`).

Создание связей с `Personas`:

- Берутся `personaIds` (если есть),
- для каждого `persona_id` создаётся запись в `service_personas` (`Service_persona::create`).

Создание записей конструктора (`services_components`):

- Для каждого `element`:
  - `component_id` — ID компонента,
  - `content`:
    - если строка, пытается распарсить как JSON,
    - если JSON массив — сохраняется как массив,
    - если пустая строка — сохраняется пустой массив `[]`,
    - иначе — оборачивается в массив `[raw]`.
  - В таблицу `services_components` пишется:
    - `service_id`, `component_id`, `data` (массив, сериализуется в JSON).

- Операции создания выполняются в одной транзакции `DB::transaction`.
- На успех:
  - редирект на `route('services-admin')` с сообщением `Услуга создана`.

Фронтенд‑форма: `resources/js/components/form/ServicesBuilderForm.tsx`.

- Пропсы:
  - `components: Component[]` — доступные компоненты конструктора,
  - `services: Service[]` — список услуг для выбора родителя,
  - `personas: Persona[]` — список персон для связи.
- Данные формы (`ServicesFormData`):
  - `title`, `description`, `slug`,
  - `content?: string[]`,
  - `images?: string[]`,
  - `parentId?: number`,
  - `personaIds?: number[]`,
  - `elements?: Element[]` (для конструктора).
- Стартовые значения:
  - `title: ''`, `description: ''`, `slug: ''`,
  - `content: []`, `images: []`,
  - `parentId: 0`, `personaIds: []`, `elements: []`.

Отправка формы:

- Перед `post` вызывается `transform`, чтобы:
  - заменить `parentId` на `undefined`, если `0` или не выбран,
  - убрать `personaIds`, если массив пуст.
- Отправка:
  - `post('services')` (относительно `/admin`).
  - При успехе:
    - `reset()` формы,
    - тост `Услуга создана успешно`.
  - При ошибке:
    - тост `Ошибка при создании услуги`.

Работа с `Personas` во фронте:

- Добавление персоны:
  - выпадающий `Select` со списком `personas`,
  - выбранный ID добавляется в `personaIds`, если его ещё нет.
- Удаление персоны:
  - по кнопке с `TrashIcon` из списка выбранных, ID удаляется из `personaIds`.

Прочие элементы формы:

- Выбор родительской услуги через `Select` по `services`.
- `MainImagesComponent`:
  - управляет полем `images` (главные фотографии/изображения).
- `ElementsBuilder`:
  - управляет массивом `elements` (элементы конструктора с привязкой к `Component`).

---

#### 4.3. Редактирование услуги

- **Роуты**:
  - `GET /admin/services/{service}/edit` — страница редактирования.
  - `POST /admin/services/{service}` — сохранение изменений.
- **Контроллер**: `App\Http\Controllers\ServicesController@edit` и `@update`.

Метод `edit(Service $service)`:

- Формирует данные:
  - `service` — текущая услуга,
  - `components` — все `Component`,
  - `serviceComponents` — список записей из `services_components` по этой услуге:
    - поля `id`, `data`, `component_id`, `component_type`,
  - `services` — все услуги, кроме текущей (для выбора родителя),
  - `personas` — все `Persona`,
  - `personaIds` — список `persona_id` из `service_personas` для текущей услуги.
- Рендерит страницу `admin/services/edit-services` с этими данными.

Метод `update(Request $request, Service $service)`:

- Валидация:
  - `title`: `required|string|max:255`
  - `slug`: `required|string|max:255|unique:services,slug,{service->id}`
  - `description`: `nullable|string|max:255`
  - `parentId`: `nullable|integer|exists:services,id`
  - `personaIds`: `nullable|array`
  - `personaIds.*`: `integer|exists:personas,id`
  - `images`: `nullable|array`
  - `images.*`: `string`
  - `content`: `nullable|array`
  - `content.*`: `string`
  - `components`: `sometimes|array`
  - `components.*.id`: `sometimes|integer|exists:services_components,id`
  - `components.*.component_id`: `required|integer|exists:components,id`
  - `components.*.data`: `nullable`

Проверка иерархии (защита от циклов):

- Нельзя выбрать:
  - саму услугу в качестве родителя;
  - её потомка в качестве родителя.
- Для этого:
  - берётся `newParentId`,
  - поднимаемся по цепочке родителей (`parentId`) от нового родителя вверх,
  - если встречаем текущий `service->id`, возвращаем ошибку валидации для `parentId`.

Транзакция `DB::transaction`:

1. Обновление самой услуги:
   - `title`, `slug`, `description` (или `null`),
   - `parentId` (или `null`),
   - `images` (массив или `[]`),
   - `content` (массив или `[]`).
2. Обновление связей с `Personas`:
   - удаляются все записи `Service_persona` по `service_id`,
   - заново создаются записи для каждого ID из `personaIds`.
3. Обновление конструктора (`services_components`):
   - удаляются все записи `Services_components` по `service_id`,
   - заново создаются записи по массиву `components`:
     - `component_id`,
     - `data`:
       - если строка — пытаемся распарсить как JSON,
       - если JSON‑массив — сохраняем как массив,
       - если пустая строка — `[]`,
       - если другой тип — оборачиваем в массив.

- На успех: редирект на `route('services-admin')` с сообщением `Услуга обновлена`.

---

#### 4.4. Удаление услуги

- **Роут**: `DELETE /admin/services/{service}`.
- **Контроллер**: `ServicesController@destroy(Service $service)`.
- **Поведение**:
  - Выполняется физическое удаление услуги: `$service->delete()`.
  - Благодаря `onDelete('cascade')` в миграции `service_personas`, связанные записи связи с персоной также удаляются.
  - Редирект на `route('services-admin')` с сообщением `Услуга удалена`.

---

### 5. Публичное API

Роуты в `routes/api.php`:

- `Route::apiResource('services', App\Http\Controllers\Api\V1\ServicesController::class);`
- `Route::get('services/{slug}', [ServicesController::class, 'show']);`
- Префикс группы: `/api/v1`.

Итого по URL:

- **Список услуг**:
  - `GET /api/v1/services`
- **Одна услуга по slug**:
  - `GET /api/v1/services/{slug}`

Контроллер: `App\Http\Controllers\Api\V1\ServicesController`.

#### 5.1. Список услуг — `GET /api/v1/services`

- Метод `index()`:
  - Загружает все услуги с связями `components` и `personas`:
    - `Service::with(['components', 'personas'])->get()`.
  - Для каждой услуги формируется нормализованный массив:
    - `id`, `title`, `slug`, `description`, `images`, `content`,
    - `components`:
      - `id`, `name`, `type`, `description`, `content` (собранное из `pivot->data`),
      - если `component->type === 'text'`, то массив `data` схлопывается в одну строку.
    - `personas`:
      - `id`, `name`, `slug`, `content`.
  - Ответ:
    - `status`: `"success"`,
    - `data`: массив услуг с компонентами и персонами.

#### 5.2. Одна услуга по slug — `GET /api/v1/services/{slug}`

- Метод `show(string $slug)`:
  - Находит услугу по `slug` с жадной загрузкой связей `components` и `personas`.
  - Если услуга не найдена:
    - HTTP‑код: `404`,
    - тело: `{ "message": "Service not found" }`.
  - Если найдена:
    - формируется структура по тому же принципу, что и в `index()`:
      - `id`, `title`, `slug`, `description`, `images`, `content`,
      - `components` (с нормализованным `content`),
      - `personas` (id, name, slug, content).
    - Возвращается JSON:
      - `status`: `"success"`,
      - `data`: объект услуги.

---

### 6. Бизнес‑правила и особенности

- **Иерархия услуг**:
  - Поле `parentId` задаёт родительскую услугу.
  - При редактировании:
    - нельзя выбрать текущую услугу как родителя;
    - нельзя выбрать потомка как родителя (проверка цепочки родителей предотвращает циклы).
- **Связь с `Personas`**:
  - Одна услуга может быть привязана к нескольким персонам (`many-to-many` через `service_personas`).
  - В админке персон можно:
    - добавлять через селект «Добавить персону»;
    - удалять по кнопке с иконкой корзины.
  - В API, каждая услуга возвращается со списком `personas` (id, name, slug, content).
- **Конструктор контента**:
  - Связь с `Component` через `services_components` позволяет задавать блоки контента разного типа.
  - Для текстовых компонентов массив данных схлопывается до одной строки, для других типов сохраняется массив/структура.
- **Slug**:
  - Уникален в таблице `services`.
  - Генерируется во фронтенде через `transliterateToSlug(title)`.
  - Публичный API для получения услуги завязан на `slug`.
- **Изображения**:
  - Массив строк в поле `images` (обрабатывается `MainImagesComponent`).

---

### 7. Возможные улучшения

- **Soft delete**:
  - Добавить `SoftDeletes` к `Service`, если нужно логичное «архивирование» без физического удаления.
- **Права по персонам**:
  - При необходимости можно ограничивать видимость услуги по персоне на фронте, используя возвращаемый список `personas`.
- **Фильтрация в API**:
  - Добавить параметры фильтрации/поиска (по `persona`, `slug` родителя, наличию компонента и т.п.) вместо отдачи всех услуг списком.


