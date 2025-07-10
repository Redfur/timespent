import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/shared/lib/utils';

const typographyVariants = cva('leading-none tracking-tight', {
	variants: {
		variant: {
			h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
			h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
			h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
			h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
			h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
			h6: 'scroll-m-20 text-base font-semibold tracking-tight',
			body1: 'leading-7 [&:not(:first-child)]:mt-6',
			body2: 'text-sm leading-5',
			caption: 'text-sm text-muted-foreground',
			overline: 'text-xs font-medium uppercase tracking-wider text-muted-foreground',
		},
		color: {
			primary: 'text-foreground',
			secondary: 'text-muted-foreground',
			success: 'text-green-600 dark:text-green-400',
			error: 'text-red-600 dark:text-red-400',
			warning: 'text-yellow-600 dark:text-yellow-400',
			info: 'text-blue-600 dark:text-blue-400',
		},
	},
	defaultVariants: {
		variant: 'body1',
		color: 'primary',
	},
});

export interface TypographyProps
	extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
		VariantProps<typeof typographyVariants> {
	component?: React.ElementType;
	gutterBottom?: boolean;
	noWrap?: boolean;
	align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
	display?: 'initial' | 'block' | 'inline';
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
	({ className, variant, color, component, gutterBottom, noWrap, align, display, children, ...props }, ref) => {
		const Component = component || getDefaultComponent(variant || 'body1');

		return (
			<Component
				className={cn(
					typographyVariants({ variant, color }),
					gutterBottom && 'mb-2',
					noWrap && 'whitespace-nowrap',
					align && getAlignClass(align),
					display && getDisplayClass(display),
					className,
				)}
				ref={ref}
				{...props}
			>
				{children}
			</Component>
		);
	},
);
Typography.displayName = 'Typography';

// Вспомогательные функции
function getDefaultComponent(variant?: string): React.ElementType {
	switch (variant) {
		case 'h1':
		case 'h2':
		case 'h3':
		case 'h4':
		case 'h5':
		case 'h6':
			return variant as React.ElementType;
		case 'body1':
		case 'body2':
			return 'p';
		case 'caption':
			return 'span';
		case 'overline':
			return 'span';
		default:
			return 'p';
	}
}

function getAlignClass(align?: string): string {
	switch (align) {
		case 'left':
			return 'text-left';
		case 'center':
			return 'text-center';
		case 'right':
			return 'text-right';
		case 'justify':
			return 'text-justify';
		default:
			return '';
	}
}

function getDisplayClass(display?: string): string {
	switch (display) {
		case 'block':
			return 'block';
		case 'inline':
			return 'inline';
		default:
			return '';
	}
}

export { Typography, typographyVariants };
