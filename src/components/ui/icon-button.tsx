import { Pressable, type PressableProps } from 'react-native';

import { cn } from '@/lib/cn';

const variants = {
  /** The overflow "..." control: a filled circle on a card. */
  subtle: 'bg-surface-subtle active:bg-border',
  /** Floating over a map, so it needs its own background and a shadow. */
  floating: 'bg-surface active:bg-surface-subtle',
  /** A bare icon, for close buttons in a header. */
  plain: 'bg-transparent active:bg-surface-subtle',
} as const;

const sizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
} as const;

export type IconButtonProps = Omit<PressableProps, 'children'> & {
  children: React.ReactNode;
  /** Required: an icon on its own tells a screen reader nothing. */
  accessibilityLabel: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

export function IconButton({
  children,
  variant = 'subtle',
  size = 'md',
  className,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      className={cn(
        'items-center justify-center rounded-pill',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}>
      {children}
    </Pressable>
  );
}
