# Деплой на GitHub Pages

## Автоматический деплой

Проект настроен для автоматического деплоя на GitHub Pages при пуше в ветку `main`.

### Что уже настроено:

1. **Vite конфигурация** - добавлен base path для GitHub Pages
2. **GitHub Actions** - автоматическая сборка и деплой
3. **Workflow** - запускается при каждом push в main

### Шаги для активации:

1. **Создайте репозиторий на GitHub** (если еще не создан)
2. **Запушьте код** в репозиторий:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/timespent.git
   git push -u origin main
   ```

3. **Настройте GitHub Pages**:
   - Перейдите в Settings → Pages
   - В разделе "Source" выберите "GitHub Actions"
   - Сохраните настройки

4. **Проверьте Actions**:
   - Перейдите в раздел Actions
   - Убедитесь, что workflow "Deploy to GitHub Pages" запустился
   - Дождитесь завершения сборки

### URL вашего сайта:

После успешного деплоя ваш сайт будет доступен по адресу:
```
https://YOUR_USERNAME.github.io/timespent/
```

## Ручной деплой (альтернатива)

Если нужно деплоить вручную:

```bash
# Сборка проекта
npm run build

# Деплой (требует установки gh-pages)
npm install -g gh-pages
gh-pages -d dist
```

## Настройка кастомного домена

1. Добавьте файл `CNAME` в папку `public/` с вашим доменом
2. Настройте DNS записи у провайдера домена
3. В настройках GitHub Pages укажите ваш домен

## Troubleshooting

### Проблема: 404 ошибки при переходе по ссылкам
**Решение**: Убедитесь, что в `vite.config.ts` правильно настроен `base` path

### Проблема: Стили не загружаются
**Решение**: Проверьте, что все пути относительные и начинаются с `/`

### Проблема: GitHub Actions не запускается
**Решение**:
1. Проверьте права доступа в Settings → Actions → General
2. Убедитесь, что workflow файл находится в `.github/workflows/`
