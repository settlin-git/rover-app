import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/cn';

const containers = {
  primary: 'bg-brand active:bg-brand-hover',
  secondary: 'bg-surface border border-border active:bg-surface-sunken',
  ghost: 'bg-transparent active:bg-surface-sunken',
  danger: 'bg-danger active:opacity-90',
} as const;

const labels = {
  primary: 'text-on-brand',
  secondary: 'text-content',
  ghost: 'text-brand',
  danger: 'text-content-inverse',
} as const;

const sizes = {
  sm: 'h-9 px-3',
  md: 'h-12 px-4',
  lg: 'h-14 px-5',
} as const;

export type ButtonVariant = keyof typeof containers;
export type ButtonSize = keyof typeof sizes;

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center gap-2 rounded-control',
        containers[variant],
        sizes[size],
        isDisabled && 'opacity-50',
        className
      )}
      {...props}>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Text variant="body" className={cn('font-semibold', labels[variant])}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
