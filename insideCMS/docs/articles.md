## CRUD Articles — документация

### 1. Назначение и обзор

- **Сущность**: `Article` — статьи сайта.
- **Где используется**:
  - Админ‑панель:
    - список статей: `/admin/articles-admin`
    - создание: `/admin/add-article-admin`
    - редактирование: `/admin/articles/{article}/edit`
  - Публичное API:
    - список: `GET /api/v1/articles`
    - одна статья по `slug`: `GET /api/v1/articles/{slug}`
- **Модульность**: доступ к CRUD статей включается через модуль `articles` (см. `routes/admin.php`, `$modules['articles']['is_active']`).

---

### 2. Модель и структура данных

- **Модель**: `App\Models\Article`
- **Таблица**: `articles`

Основные поля (см. миграцию `2025_10_08_004839_create_articles_table.php` и модель):

- **id**: `bigint`, PK, автоинкремент.
- **title**: `string`, заголовок статьи, обязательно.
- **content**: `text`, полный контент, обязательно.
- **slug**: `string`, URL‑идентификатор, `unique`.
- **images**: `json`, список изображений, `nullable`.
- **created_at / updated_at**: стандартные timestamp‑поля.

Настройки модели:

- **$fillable**: `title`, `content`, `slug`, `images`.
- **$casts**:
  - `slug` → `string`
  - `title` → `string`
  - `images` → `array`

---

### 3. Роли и доступ

- Все админ‑роуты `Article` находятся в группе:
  - middleware: `auth`, `verified`, `App\Http\Middleware\AdminAccess`
  - префикс: `/admin`
- К админским страницам статей имеют доступ только авторизованные администраторы при включённом модуле `articles`.
- Публичное API `/api/v1/articles` доступно без авторизации (стандартные `apiResource`‑роуты).

---

### 4. Админ‑интерфейс (UI‑сценарии)

#### 4.1. Список статей

- **Роуты** (см. `routes/admin.php`):
  - `GET /admin/articles-admin` — вывод списка статей.
  - `POST /admin/articles-admin` — тот же список с поиском.
- **Контроллер**: `App\Http\Controllers\ArticleController@adminShow`.
- **Фильтрация**:
  - Параметр `query` (из запроса).
  - При наличии `query` выполняется фильтр: `where title like %query%`.
- **Пагинация**:
  - Используется `paginate(6)` — по 6 статей на страницу.
  - В представление передаются:
    - `articles` — элементы текущей страницы,
    - `links` — массив ссылок для пагинации,
    - `current_page`, `total_pages`, `per_page`, `total`.

> Примечание: фронтенд‑страница списка (`admin/articles/articles-admin`) реализована по аналогии с `news-admin` (поиск, пагинация, действия редактирования/удаления).

---

#### 4.2. Создание статьи

- **Роуты**:
  - `GET /admin/add-article-admin` — страница создания.
  - `POST /admin/articles/add` — сохранение новой статьи (см. `routes/admin.php` → `articles.store`).
- **Контроллер**:
  - `create()` → отрисовывает `admin/articles/add-article-admin`.
  - `store(Request $request)` → создаёт запись в БД.

Валидация при создании (`ArticleController@store`):

- `title`: `required|string|max:255`
- `content`: `required|string`
- `slug`: `required|string|max:255|unique:articles,slug`
- `images`: `nullable|array`
- `images.*`: `string`

Поведение:

- Создаётся запись `Article` с полями:
  - `title`, `content`, `slug`,
  - `images` — либо из валидации, либо пустой массив `[]`.
- На успех:
  - редирект обратно на страницу создания,
  - в сессии устанавливается сообщение `Статья успешно создана`.

Фронтенд‑страница: `resources/js/pages/admin/articles/add-article-admin.tsx`.

- Показывает стандартные хлебные крошки, заголовок «Добавить статью» и подсказки по использованию внешних сервисов для транслитерации `slug` и типографики текста.
- Подключает компонент формы `ArticleForm`.

Компонент формы: `resources/js/components/form/ArticleForm.tsx`.

- Начальные данные:
  - `title`: `''`
  - `content`: `''`
  - `slug`: `''`
  - `images`: `[]`
- Отправка:
  - `post('/admin/articles/add')`.
  - При успехе:
    - вызывается `reset()` формы,
    - опционально вызывается `onSuccess`,
    - показывается тост «Статья успешно создана»,
    - выполняется `router.visit(articlesAdmin().url)` (`/admin/articles-admin`).
  - При ошибке:
    - тост «Ошибка при создании статьи».
- Дополнительно:
  - Кнопка «Сгенерировать slug»:
    - использует `transliterateToSlug(title)`,
    - записывает значение в `slug`.
  - Поле `content` реализовано через компонент `TextEditor`.
  - Работа с изображениями:
    - через `MainImagesComponent`,
    - данные лежат в массиве `images` (строки, например, имена/пути файлов).

---

#### 4.3. Редактирование статьи

- **Роуты**:
  - `GET /admin/articles/{article}/edit` — страница редактирования (`articles.update`).
  - `POST /admin/articles/{article}` — сохранение изменений (`articles.edit`).
- **Контроллер**:
  - `edit(Article $article)` → отдаёт страницу `admin/articles/edit-article-admin` с пропом `article`.
  - `update(Request $request, Article $article)` → обновляет запись.

Валидация при обновлении (`ArticleController@update`):

- `title`: `required|string|max:255`
- `content`: `required|string`
- `slug`: `required|string|max:255|unique:articles,slug,{article->id}`
- `images`: `nullable|array`
- `images.*`: `string`

Поведение:

- Обновляются поля:
  - `title`, `content`, `slug`,
  - `images` — либо из валидации, либо пустой массив `[]`.
- На успех:
  - редирект на `route('articles-admin')` с сообщением `Статья успешно обновлена`.

Фронтенд‑страница: `resources/js/pages/admin/articles/edit-article-admin.tsx`.

- Инициализирует форму начальными значениями из `article`.
- Сабмит:
  - `post('/admin/articles/{id}')`.
  - При успехе:
    - переход на `/admin/articles-admin`,
    - тост «Статья успешно обновлена».
  - При ошибке:
    - тост «Ошибка при редактировании статьи».
- Поля формы:
  - `title` (Input),
  - `content` (TextEditor),
  - `slug` (Input),
  - `images` (через `MainImagesComponent`).
- В `Alert` показывается строка с примером публичного API:
  - `API: /api/v1/articles/{article.slug}`.

---

#### 4.4. Удаление статьи

- **Роут**: `DELETE /admin/articles/{article}`.
- **Контроллер**: `ArticleController@destroy(Article $article)`.
- **Поведение**:
  - Выполняется физическое удаление записи: `$article->delete()`.
  - После удаления — редирект назад с сообщением `Статья удалена.`.

---

### 5. Публичное API

Роуты в `routes/api.php`:

- `Route::apiResource('articles', App\Http\Controllers\Api\V1\ArticleController::class);`
- `Route::get('articles/{slug}', [ArticleController::class, 'show']);`
- Префикс группы: `/api/v1`.

Итого по URL:

- **Список статей**:
  - `GET /api/v1/articles`
- **Одна статья по slug**:
  - `GET /api/v1/articles/{slug}`

Контроллер: `App\Http\Controllers\Api\V1\ArticleController`.

#### 5.1. Список статей — `GET /api/v1/articles`

- Метод `index()`:
  - Получение всех записей: `Article::all()`.
  - Формат успешного ответа:
    - `status`: `"success"`
    - `data`: массив объектов `Article`.
- Блок `if (!$articles)` фактически никогда не срабатывает, так как `Article::all()` всегда возвращает коллекцию (даже пустую). При отсутствии статей вернётся `"success"` с `data: []`.

#### 5.2. Одна статья по slug — `GET /api/v1/articles/{slug}`

- Метод `show(string $slug)`:
  - Поиск статьи по `slug`: `Article::where('slug', $slug)->first()`.
  - Если статья не найдена:
    - HTTP‑код: `404`,
    - тело ответа:
      - `status`: `"error"`,
      - `errors`: `["Article not found"]`.
  - Если найдена:
    - HTTP‑код: `200`,
    - тело ответа:
      - `status`: `"success"`,
      - `data`: объект `Article`.

---

### 6. Бизнес‑правила и особенности

- **Обязательные поля в админ‑формах**:
  - `title`, `content`, `slug`.
- **Slug**:
  - Должен быть уникальным (`unique:articles,slug`).
  - Для генерации slug во фронтенде используется утилита `transliterateToSlug(title)`.
  - Публичный API для получения одной статьи завязан на `slug`.
- **Изображения**:
  - Хранятся в поле `images` как JSON‑массив строк.
  - Управляются через компонент `MainImagesComponent` в формах создания и редактирования.
