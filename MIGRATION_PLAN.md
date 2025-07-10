# 🚀 План миграции: Material-UI → shadcn/ui + Tailwind CSS

## 📋 Обзор

Этот документ содержит детальный план перехода с Material-UI на shadcn/ui + Tailwind CSS для проекта **TimeSpent**. Миграция позволит получить больше контроля над дизайном, уменьшить размер бандла и использовать современные UI паттерны.

## 🎯 Цели миграции

- ✅ Полный контроль над дизайном компонентов
- ✅ Уменьшение размера бандла (tree-shaking)
- ✅ Современный и актуальный дизайн
- ✅ Лучшая производительность
- ✅ Гибкость в кастомизации
- ✅ Сохранение всей функциональности

## 📦 Этап 1: Подготовка и настройка

### 1.1 Установка зависимостей

```bash
# Удаление Material-UI
npm uninstall @mui/material @mui/x-date-pickers @emotion/react @emotion/styled

# Установка Tailwind CSS
npm install -D tailwindcss @tailwindcss/forms @tailwindcss/typography postcss autoprefixer

# Установка shadcn/ui зависимостей
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-select
npm install @radix-ui/react-switch @radix-ui/react-progress @radix-ui/react-label
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
```

### 1.2 Настройка Tailwind CSS

Создать конфигурационные файлы:

```bash
npx tailwindcss init -p
```

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
}
```

### 1.3 Обновление глобальных стилей

**src/app/styles/globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## 🎨 Этап 2: Создание базовых компонентов

### 2.1 Структура компонентов

Создать базовые компоненты в `src/shared/ui/`:

```
src/shared/ui/
├── button.tsx
├── input.tsx
├── card.tsx
├── select.tsx
├── dialog.tsx
├── switch.tsx
├── progress.tsx
├── label.tsx
├── textarea.tsx
└── index.ts
```

### 2.2 Примеры компонентов

**src/shared/ui/button.tsx:**
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**src/shared/ui/input.tsx:**
```typescript
import * as React from "react"
import { cn } from "@/shared/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

### 2.3 Утилиты

**src/shared/lib/utils.ts:**
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## 🔄 Этап 3: Миграция компонентов

### 3.1 Приоритет миграции

1. **Базовые компоненты** (начните с самых простых):
   - `SalaryInput.tsx` - заменить TextField на Input
   - `PeriodSelector.tsx` - заменить Select на Select
   - `AddGroupForm.tsx` - заменить формы

2. **Сложные компоненты**:
   - `WorkTimeInput.tsx` - заменить TimePicker на кастомный компонент
   - `GroupOfSpent.tsx` - переработать карточки
   - `WorkDayProgress.tsx` - заменить Progress на кастомный

3. **Основной компонент**:
   - `TimeSpentCalculator.tsx` - обновить layout и стили

### 3.2 Пример миграции SalaryInput

**Было (Material-UI):**
```typescript
import { TextField } from '@mui/material';

export const SalaryInput = ({ value, onChange }) => {
  return (
    <TextField
      label="Зарплата"
      value={value}
      onChange={onChange}
      variant="outlined"
      fullWidth
    />
  );
};
```

**Стало (shadcn/ui):**
```typescript
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

export const SalaryInput = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="salary">Зарплата</Label>
      <Input
        id="salary"
        value={value}
        onChange={onChange}
        placeholder="Введите зарплату"
      />
    </div>
  );
};
```

### 3.3 Миграция WorkTimeInput

Создать кастомный TimePicker компонент:

```typescript
// src/shared/ui/time-picker.tsx
import { Input } from './input';
import { Label } from './label';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const TimePicker = ({ value, onChange, label }: TimePickerProps) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
};
```

## 🎨 Этап 4: Обновление темы и стилей

### 4.1 Настройка темной темы

**src/shared/lib/theme.ts:**
```typescript
export const themes = {
  light: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(222.2 84% 4.9%)",
    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(222.2 84% 4.9%)",
    popover: "hsl(0 0% 100%)",
    popoverForeground: "hsl(222.2 84% 4.9%)",
    primary: "hsl(222.2 47.4% 11.2%)",
    primaryForeground: "hsl(210 40% 98%)",
    secondary: "hsl(210 40% 96%)",
    secondaryForeground: "hsl(222.2 84% 4.9%)",
    muted: "hsl(210 40% 96%)",
    mutedForeground: "hsl(215.4 16.3% 46.9%)",
    accent: "hsl(210 40% 96%)",
    accentForeground: "hsl(222.2 84% 4.9%)",
    destructive: "hsl(0 84.2% 60.2%)",
    destructiveForeground: "hsl(210 40% 98%)",
    border: "hsl(214.3 31.8% 91.4%)",
    input: "hsl(214.3 31.8% 91.4%)",
    ring: "hsl(222.2 84% 4.9%)",
  },
  dark: {
    background: "hsl(222.2 84% 4.9%)",
    foreground: "hsl(210 40% 98%)",
    card: "hsl(222.2 84% 4.9%)",
    cardForeground: "hsl(210 40% 98%)",
    popover: "hsl(222.2 84% 4.9%)",
    popoverForeground: "hsl(210 40% 98%)",
    primary: "hsl(210 40% 98%)",
    primaryForeground: "hsl(222.2 47.4% 11.2%)",
    secondary: "hsl(217.2 32.6% 17.5%)",
    secondaryForeground: "hsl(210 40% 98%)",
    muted: "hsl(217.2 32.6% 17.5%)",
    mutedForeground: "hsl(215 20.2% 65.1%)",
    accent: "hsl(217.2 32.6% 17.5%)",
    accentForeground: "hsl(210 40% 98%)",
    destructive: "hsl(0 62.8% 30.6%)",
    destructiveForeground: "hsl(210 40% 98%)",
    border: "hsl(217.2 32.6% 17.5%)",
    input: "hsl(217.2 32.6% 17.5%)",
    ring: "hsl(212.7 26.8% 83.9%)",
  },
};
```

### 4.2 Обновление провайдера темы

**src/app/providers/ThemeProvider.tsx:**
```typescript
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

## 🎯 Этап 5: Миграция виджетов

### 5.1 ThemeChange виджет

**src/widgets/themeChange/ui/ThemeChange.tsx:**
```typescript
import { Switch } from '@/shared/ui/switch';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export const ThemeChange = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
      />
      <Moon className="h-4 w-4" />
    </div>
  );
};
```

### 5.2 LanguageChange виджет

**src/widgets/languageChange/ui/LanguageChange.tsx:**
```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { useTranslation } from 'react-i18next';

export const LanguageChange = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <Select value={i18n.language} onValueChange={changeLanguage}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ru">Русский</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  );
};
```

## 🎨 Этап 6: Финальная полировка

### 6.1 Адаптивность

Проверить все компоненты на различных размерах экранов:

```typescript
// Пример адаптивного layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Компоненты */}
</div>
```

### 6.2 Анимации

Добавить плавные переходы:

```css
/* В globals.css */
@layer utilities {
  .transition-all {
    transition: all 0.2s ease-in-out;
  }
}
```

### 6.3 Доступность

Проверить ARIA атрибуты и семантику:

```typescript
// Пример доступного компонента
<button
  aria-label="Переключить тему"
  role="switch"
  aria-checked={theme === 'dark'}
  onClick={toggleTheme}
>
  {/* Содержимое */}
</button>
```

## 🧪 Этап 7: Тестирование

### 7.1 Функциональное тестирование

- [ ] Проверить все формы ввода
- [ ] Проверить переключение темы
- [ ] Проверить переключение языка
- [ ] Проверить сохранение данных
- [ ] Проверить расчеты

### 7.2 Визуальное тестирование

- [ ] Проверить на мобильных устройствах
- [ ] Проверить на планшетах
- [ ] Проверить на десктопе
- [ ] Проверить в разных браузерах

### 7.3 Производительность

- [ ] Проверить размер бандла
- [ ] Проверить время загрузки
- [ ] Проверить плавность анимаций

## 📊 Оценка результатов

### Метрики успеха

- ✅ Размер бандла уменьшился на 30-50%
- ✅ Время загрузки улучшилось
- ✅ Все функции работают корректно
- ✅ Дизайн стал более современным
- ✅ Код стал более читаемым

### Возможные проблемы

- ⚠️ Временная потеря производительности во время разработки
- ⚠️ Необходимость переобучения команды
- ⚠️ Возможные баги в новых компонентах

## 🚀 Следующие шаги

После завершения миграции:

1. **Оптимизация** - дальнейшее уменьшение размера бандла
2. **Новые компоненты** - добавление недостающих компонентов
3. **Анимации** - улучшение пользовательского опыта
4. **Тестирование** - добавление unit и integration тестов

## 📚 Полезные ресурсы

- [shadcn/ui документация](https://ui.shadcn.com/)
- [Tailwind CSS документация](https://tailwindcss.com/docs)
- [Radix UI документация](https://www.radix-ui.com/)
- [Lucide React иконки](https://lucide.dev/)

---

**Примечание:** Этот план можно адаптировать под конкретные потребности проекта. Рекомендуется выполнять миграцию поэтапно, тестируя каждый этап перед переходом к следующему.
