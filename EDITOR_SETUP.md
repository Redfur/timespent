# 🛠️ Настройка редактора и инструментов

## 📋 Единая точка входа для настройки табуляции

В этом проекте используется **`.editorconfig`** как единая точка входа для настройки табуляции. Все инструменты настроены для чтения этих настроек.

## ⚙️ Текущие настройки

### Табуляция
- **Размер**: 4 пробела (по умолчанию)
- **Стиль**: пробелы (не табы)
- **Применяется ко всем файлам**

### Специальные правила для разных типов файлов:
- **TypeScript/JavaScript**: 4 пробела
- **JSON**: 2 пробела
- **Markdown**: 4 пробела (для лучшей читаемости)
- **YAML**: 2 пробела
- **HTML**: 4 пробела
- **CSS/SCSS**: 4 пробела

### Инструменты и их настройки

#### 1. **`.editorconfig`** (главная точка входа)
```ini
[*]
indent_style = space
indent_size = 4

# Специальные правила для разных типов файлов
[*.{ts,tsx,js,jsx}]
indent_size = 4

[*.json]
indent_size = 2

[*.md]
indent_size = 4

[*.{yml,yaml}]
indent_size = 2

[*.{html,htm}]
indent_size = 4

[*.{css,scss,sass}]
indent_size = 4
```

#### 2. **VSCode** (`.vscode/settings.json`)
```json
{
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "editor.detectIndentation": false,
  "editor.defaultFormatter": "biomejs.biome"
}
```

#### 3. **Biome** (`biome.json`)
- Убраны дублирующие настройки табуляции
- Использует настройки из `.editorconfig`
- Настроен как форматтер по умолчанию
- Игнорирует системные файлы (`package.json`, `tsconfig.json`, и т.д.)

#### 4. **TypeScript** (`tsconfig.json`)
- Не содержит настроек табуляции
- Использует настройки из `.editorconfig`

## 🔧 Как изменить настройки табуляции

### Для изменения размера табуляции:

1. **Измените `.editorconfig`:**
```ini
[*]
indent_size = 4  # вместо 2
```

2. **Обновите VSCode настройки:**
```json
{
  "editor.tabSize": 4  # вместо 2
}
```

### Для добавления правил для отдельных типов файлов:

1. **Добавьте секцию в `.editorconfig`:**
```ini
# Для Python файлов
[*.py]
indent_size = 4

# Для Java файлов
[*.java]
indent_size = 4

# Для C/C++ файлов
[*.{c,cpp,h,hpp}]
indent_size = 4
```

3. **Переформатируйте код:**
```bash
npm run format
```

## 📝 Рекомендации

### ✅ Что делать:
- Всегда изменяйте настройки в `.editorconfig` в первую очередь
- Используйте Biome для форматирования кода
- Настройте VSCode для автоматического форматирования при сохранении

### ❌ Что НЕ делать:
- Не дублируйте настройки табуляции в разных файлах
- Не используйте разные размеры табуляции для разных типов файлов
- Не отключайте автоматическое форматирование

## 🚀 Автоматизация

### Pre-commit hooks
Проект настроен с Husky для автоматического форматирования:
```json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": "biome check --write"
  }
}
```

### Игнорируемые файлы
Biome настроен игнорировать системные файлы:
- `package.json`, `yarn.lock`, `package-lock.json`
- `tsconfig.json`, `vite.config.ts`, `biome.json`
- `.editorconfig`, `.gitignore`
- `*.d.ts`, `*.min.js`, `*.bundle.js`
- `README.md`, `CHANGELOG.md`, `LICENSE`

Полный список в файле `.biomeignore`

### VSCode расширения
Рекомендуемые расширения:
- **Biome** - для форматирования и линтинга
- **EditorConfig** - для автоматического применения настроек `.editorconfig`

## 📝 Примеры настройки для разных типов файлов

### Добавление новых типов файлов:

```ini
# Python файлы
[*.py]
indent_size = 4

# Java файлы
[*.java]
indent_size = 4

# C/C++ файлы
[*.{c,cpp,h,hpp}]
indent_size = 4

# PHP файлы
[*.php]
indent_size = 4

# Ruby файлы
[*.rb]
indent_size = 2

# Go файлы
[*.go]
indent_size = 4
```

### Изменение существующих правил:

```ini
# Изменить табуляцию для TypeScript на 4 пробела
[*.{ts,tsx}]
indent_size = 4

# Изменить табуляцию для JSON на 4 пробела
[*.json]
indent_size = 4
```

### Специальные настройки:

```ini
# Файлы конфигурации - табы
[*.{ini,conf}]
indent_style = tab
indent_size = 4

# Makefile - только табы
[Makefile]
indent_style = tab
```

## 🔍 Проверка настроек

### Проверить текущие настройки:
```bash
# Проверить форматирование
npm run format

# Проверить линтинг
npm run lint

# Проверить все
npm run check
```

### Проверить настройки VSCode:
1. Откройте любой TypeScript файл
2. Нажмите `Ctrl+Shift+P` (или `Cmd+Shift+P` на Mac)
3. Введите "Format Document"
4. Убедитесь, что выбран Biome как форматтер 