# InsideCMS

Современная CMS система, построенная на Laravel с React frontend через Inertia.js.

## Технологический стек

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Аутентификация**: Laravel Fortify
- **UI компоненты**: Radix UI, Headless UI
- **Сборка**: Vite
- **База данных**: MySQL

## Требования

- PHP 8.2 или выше
- Composer
- Node.js 18+ и npm
- Git

## Установка

1. **Клонируйте репозиторий**
   ```bash
   git clone <repository-url>
   cd insideCMS
   ```

2. **Установите PHP зависимости**
   ```bash
   composer install
   ```

3. **Установите Node.js зависимости**
   ```bash
   npm install
   ```
## Запуск

### Разработка

Запуск в режиме разработки (автоматически запускает сервер, очереди и Vite):
composer run dev

Или запуск с SSR (Server-Side Rendering):
composer run dev:ssr

## Функциональность

- Система аутентификации (регистрация, вход, двухфакторная аутентификация)
- Управление пользователями
- Система отзывов
- Адаптивный интерфейс
- Современный UI/UX
