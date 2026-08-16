import { ActivityIndicator, Pressable, type PressableProps, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/cn';

const containers = {
  /** Next, Save — the one obvious action on a screen. */
  primary: 'bg-action active:bg-action-hover',
  /** Cancel, Follow, Message — available but not the point of the screen. */
  secondary: 'bg-surface border border-border active:bg-surface-subtle',
  /** Reserved for adding places, so teal always means the same thing. */
  accent: 'bg-accent active:bg-accent-hover',
  ghost: 'bg-transparent active:bg-surface-subtle',
  danger: 'bg-danger active:opacity-90',
} as const;

const labels = {
  primary: 'text-on-action',
  secondary: 'text-content',
  accent: 'text-on-accent',
  ghost: 'text-content',
  danger: 'text-content-inverse',
} as const;

const sizes = {
  sm: 'h-10 px-4',
  md: 'h-12 px-5',
  lg: 'h-14 px-6',
} as const;

const labelSizes = {
  sm: 'footnote',
  md: 'body',
  lg: 'body',
} as const;

export type ButtonVariant = keyof typeof containers;
export type ButtonSize = keyof typeof sizes;

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Rendered before the label. Give it a colour that matches the variant. */
  icon?: React.ReactNode;
  className?: string;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center gap-2 rounded-pill',
        containers[variant],
        sizes[size],
        isDisabled && 'opacity-50',
        className
      )}
      {...props}>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <>
          {icon ? <View>{icon}</View> : null}
          <Text variant={labelSizes[size]} className={cn('font-semibold', labels[variant])}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
