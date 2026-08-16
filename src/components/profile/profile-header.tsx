import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import type { Profile } from '@/data/profile';

const HEADER_HEIGHT = 290;

/**
 * The full-bleed photo at the top of a profile, with the person's name over it.
 *
 * The gradient is not decoration. White text on an uncontrolled photo is
 * unreadable as soon as someone uploads a bright sky, so the name sits on a
 * scrim that darkens towards the bottom regardless of the image behind it.
 */
export function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <View style={{ height: HEADER_HEIGHT }} className="bg-surface-subtle">
      {profile.coverUrl ? (
        <Image
          source={{ uri: profile.coverUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={200}
          accessibilityLabel={`${profile.name}'s cover photo`}
        />
      ) : (
        <LinearGradient
          colors={['#4C6B8A', '#22262B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: '100%', height: '100%' }}
        />
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.65)']}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 160 }}
        pointerEvents="none"
      />

      <View className="absolute bottom-8 left-4 right-4">
        <Text variant="title" className="text-white" numberOfLines={1}>
          {profile.name}
        </Text>
      </View>
    </View>
  );
}
