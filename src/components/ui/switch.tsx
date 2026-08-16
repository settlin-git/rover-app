import { Switch as RNSwitch, type SwitchProps as RNSwitchProps } from 'react-native';

import { useThemeColors } from '@/theme';

export type SwitchProps = Omit<RNSwitchProps, 'trackColor' | 'thumbColor'>;

/**
 * The platform switch, wired to the theme.
 *
 * React Native's Switch takes colour strings rather than class names, which is
 * why this wrapper exists — so no screen has to reach for `useThemeColors` just
 * to render a toggle.
 */
export function Switch(props: SwitchProps) {
  const colors = useThemeColors();

  return (
    <RNSwitch
      trackColor={{ false: colors.border, true: colors.accent }}
      thumbColor={colors.surface}
      ios_backgroundColor={colors.border}
      {...props}
    />
  );
}
