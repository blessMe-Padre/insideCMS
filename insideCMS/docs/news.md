## CRUD News — документация

### 1. Назначение и обзор

- **Сущность**: `News` — новости сайта.
- **Где используется**:
  - Админ‑панель:
    - список новостей: `/admin/news-admin`
    - создание: `/admin/add-news-admin`
    - редактирование: `/admin/news/{news}/edit`
  - Публичное API:
    - список: `GET /api/v1/news`
    - одна новость по `slug`: `GET /api/v1/news/{slug}`
- **Модульность**: функционал активируется/отключается через модуль `news` (см. `routes/admin.php`, `$modules['news']['is_active']`).

---

### 2. Модель и структура данных

- **Модель**: `App\Models\News`
- **Таблица**: `news`

Поля таблицы (миграция `2025_10_07_032009_create_news_table.php`):

- **id**: `bigint`, PK, автоинкремент.
- **title**: `string`, заголовок новости, обязательно.
- **content**: `text`, полный контент, обязательно.
- **excerpt**: `text`, краткое описание, `nullable` (в HTTP‑валидации — обязательно).
- **slug**: `string`, уникальный URL‑идентификатор, `unique`.
- **time_to_read**: `integer`, примерное время чтения (в минутах), `nullable` (в HTTP‑валидации — обязательно).
- **is_published**: `boolean`, признак публикации, по умолчанию `false`.
- **images**: `json`, список изображений, `nullable`.
- **created_at / updated_at**: стандартные timestamp‑поля.

Настройки модели:

- **$fillable**: `title`, `content`, `excerpt`, `slug`, `time_to_read`, `is_published`, `images`.
- **$casts**:
  - `is_published` → `boolean`
  - `images` → `array`
  - `time_to_read` → `integer`

---

### 3. Роли и доступ

- Все админ‑роуты `News` находятся в группе:
  - middleware: `auth`, `verified`, `App\Http\Middleware\AdminAccess`
  - префикс: `/admin`
- К админским страницам `News` имеют доступ только авторизованные пользователи с правами администратора и включённым модулем `news`.
- Публичное API `/api/v1/news` не требует авторизации (стандартные `apiResource`‑роуты без дополнительного middleware).

---

### 4. Админ‑интерфейс (UI‑сценарии)

#### 4.1. Список новостей

- **Роуты**:
  - `GET /admin/news-admin` — вывод списка новостей.
  - `POST /admin/news-admin` — тот же список с фильтрацией по поиску.
- **Контроллер**: `App\Http\Controllers\NewsController@adminShow`.
- **Фильтрация**:
  - Параметр `query` (передаётся через POST‑запрос или query‑строку).
  - При наличии `query` выполняется фильтр: `where title like %query%`.
- **Пагинация**:
  - Используется `paginate(3)` — по 3 новости на страницу.
  - Во фронт передаётся:
    - `news` — элементы текущей страницы,
    - `links` — массив ссылок пагинации,
    - `current_page`, `total_pages`, `per_page`, `total`.

Фронтенд‑страница: `resources/js/pages/admin/news/news-admin.tsx`.

- Отображает:
  - общее количество новостей (`total`),
  - список карточек через `TaxonomyItem`,
  - пагинацию через `Pagination`.
- **Поиск**:
  - Панель поиска разворачивается/скрывается по кнопке с иконкой `Search`.
  - Поле ввода `Input name="query"` привязано к форме `useForm`.
  - Запрос отправляется через `post('/admin/news-admin')`:
    - по клику на кнопку поиска;
    - по нажатию `Enter` в поле.
- **Удаление**:
  - Используется `deleteForm.delete('news/{id}')` → `DELETE /admin/news/{news}`.
  - При успехе показывается тост «Новость удалена».
- **Редактирование**:
  - Переход на редактирование: `router.visit('news/{id}/edit')` → `GET /admin/news/{news}/edit`.

---

#### 4.2. Создание новости

- **Роуты**:
  - `GET /admin/add-news-admin` — страница создания.
  - `POST /admin/news` — сохранение новой новости.
- **Контроллер**:
  - `create()` → отрисовывает страницу `admin/news/add-news-admin`.
  - `store(Request $request)` → создаёт запись.

Валидация при создании (`NewsController@store`):

- `title`: `required|string|max:255`
- `content`: `required|string`
- `excerpt`: `required|string`
- `slug`: `required|string|max:255|unique:news,slug`
- `time_to_read`: `required|integer|min:1`
- `is_published`: `boolean`
- `images`: `nullable|array`
- `images.*`: `string`

Поведение:

- Если `images` не переданы, сохраняется пустой массив `[]`.
- Если `is_published` не передан, сохраняется `false`.
- На успех: редирект обратно на форму со статусом `Новость успешно создана`.

Фронтенд‑страница: `resources/js/pages/admin/news/add-news-admin.tsx`.

- Показывает заголовок, подсказки по работе со `slug` и типографикой, подключает компонент `NewsForm`.

Компонент формы: `resources/js/components/form/NewsForm.tsx`.

- Начальные данные:
  - `title`: `''`
  - `content`: `''`
  - `excerpt`: `''`
  - `slug`: `''`
  - `time_to_read`: `0`
  - `is_published`: `false`
  - `images`: `[]`
- Отправка:
  - `post('/admin/news')`.
  - При успехе:
    - опционально вызывается `onSuccess`,
    - показывается тост «Новость успешно создана»,
    - редирект на `newsAdmin().url` (`/admin/news-admin`).
  - При ошибке:
    - тост «Ошибка при создании новости».
- Дополнительно:
  - Кнопка «Сгенерировать slug»:
    - вызывает `transliterateToSlug(title)`,
    - записывает результат в поле `slug`.
  - Поле `content` реализовано через компонент `TextEditor`.
  - Работа с изображениями — через `MainImagesComponent` (список строк в `images`).

---

#### 4.3. Редактирование новости

- **Роуты**:
  - `GET /admin/news/{news}/edit` — страница редактирования.
  - `POST /admin/news/{news}` — сохранение изменений.
- **Контроллер**:
  - `edit(News $news)` → отдаёт страницу `admin/news/edit-news-admin` с пропом `news`.
  - `update(Request $request, News $news)` → обновляет запись.

Валидация при обновлении (`NewsController@update`):

- `title`: `required|string|max:255`
- `content`: `required|string`
- `excerpt`: `required|string`
- `slug`: `required|string|max:255|unique:news,slug,{news->id}`
- `time_to_read`: `required|integer|min:1`
- `is_published`: `boolean`
- `images`: `nullable|array`
- `images.*`: `string`

Поведение:

- Обновляются поля: `title`, `content`, `excerpt`, `slug`, `time_to_read`, `images` (по умолчанию `[]`), `is_published` (по умолчанию `false`).
- На успех: редирект на `route('news-admin')` со статусом `Новость успешно обновлена`.

Фронтенд‑страница: `resources/js/pages/admin/news/edit-news-admin.tsx`.

- Инициализирует `useForm` начальными значениями из `news`.
- Сабмит:
  - `post('/admin/news/{id}')`.
  - При успехе:
    - `router.visit(newsAdmin().url)`,
    - тост «Новость успешно обновлена».
  - При ошибке:
    - тост «Ошибка при обновлении новости».
- Поля формы:
  - `title`, `content` (`TextEditor`), `excerpt`, `slug`, `time_to_read`,
  - чекбокс `is_published`,
  - `MainImagesComponent` для редактирования `images`.
- Дополнительно:
  - В `Alert` выводится строка с примером API‑URL для текущей новости:
    - `API: /api/v1/news/{news.slug}`.

---

#### 4.4. Удаление новости

- **Роут**: `DELETE /admin/news/{news}`.
- **Контроллер**: `NewsController@destroy(News $news)`.
- **Поведение**:
  - Выполняется физическое удаление: `$news->delete()`.
  - После удаления редирект назад с сообщением «Новость удалена.».

---

### 5. Публичное API

Роуты в `routes/api.php`:

- `Route::apiResource('news', App\Http\Controllers\Api\V1\NewsController::class);`
- `Route::get('news/{slug}', [NewsController::class, 'show']);`
- Префикс группы: `/api/v1`.

Итого по URL:

- **Список новостей**:
  - `GET /api/v1/news`
- **Одна новость по slug**:
  - `GET /api/v1/news/{slug}`

Контроллер: `App\Http\Controllers\Api\V1\NewsController`.

#### 5.1. Список новостей — `GET /api/v1/news`

- Метод `index()`:
  - Получение всех записей: `News::all()`.
  - Формат ответа при успехе:
    - `status`: `"success"`
    - `data`: массив объектов `News`.
- Блок проверки `if (!$news)` фактически не срабатывает, т.к. `News::all()` всегда возвращает коллекцию (даже если она пустая). При отсутствии новостей возвращается `"success"` с `data: []`.

#### 5.2. Одна новость по slug — `GET /api/v1/news/{slug}`

- Метод `show(string $slug)`:
  - Поиск новости по `slug`: `News::where('slug', $slug)->first()`.
  - Если новость не найдена:
    - HTTP‑код: `404`.
    - Тело ответа:
      - `status`: `"error"`
      - `errors`: `["News not found"]`.
  - Если найдена:
    - HTTP‑код: `200`.
    - Тело ответа:
      - `status`: `"success"`
      - `data`: объект `News`.

---

### 6. Бизнес‑правила и особенности

- **Обязательные поля в админ‑формах**:
  - `title`, `content`, `excerpt`, `slug`, `time_to_read`.
- **Публикация**:
  - Флаг `is_published` управляется чекбоксом в админке.
  - Дополнительных статусов (черновик/архив) нет; логика сводится к Boolean‑флагу.
- **Slug**:
  - Должен быть уникальным (`unique:news,slug`).
  - Для генерации slug используется утилита `transliterateToSlug(title)` (в компоненте `NewsForm`).
  - Публичное API для получения одной новости привязано именно к `slug`.
- **Изображения**:
  - Хранятся как JSON‑массив строк (например, путей к файлам).
  - Управляются в админке через компонент `MainImagesComponent`, который работает с массивом строк в поле `images`.
