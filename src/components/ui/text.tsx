import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/lib/cn';

const variants = {
  display: 'text-display font-bold text-content',
  title: 'text-title font-semibold text-content',
  headline: 'text-headline font-semibold text-content',
  body: 'text-body text-content',
  footnote: 'text-footnote text-content-secondary',
  caption: 'text-caption font-medium uppercase tracking-wide text-content-tertiary',
} as const;

export type TextVariant = keyof typeof variants;

export type TextProps = RNTextProps & {
  variant?: TextVariant;
};

export function Text({ variant = 'body', className, ...props }: TextProps) {
  return <RNText className={cn(variants[variant], className)} {...props} />;
}
