import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { ProfileHeader } from '@/components/profile/profile-header';
import { TripCard } from '@/components/trip-card';
import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { IconButton } from '@/components/ui/icon-button';
import { Stat } from '@/components/ui/stat';
import { getProfile } from '@/data/profile';
import { getTrips } from '@/data/trips';
import { useThemeColors } from '@/theme';

export default function TripsScreen() {
  const profile = getProfile();
  const trips = getTrips();
  const colors = useThemeColors();
  const [following, setFollowing] = useState(profile.isFollowing);

  const iconColor = colors['content-secondary'];

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
        // The header photo runs under the status bar, so the scroll view must
        // not inset it. Safe-area padding is applied per-section instead.
        contentInsetAdjustmentBehavior="never">
        <ProfileHeader profile={profile} />

        {/* Pulled up over the photo so the panel reads as a sheet covering it. */}
        <View className="-mt-5 rounded-t-[20px] bg-background pt-4">
          <View className="flex-row items-center gap-3 px-4">
            <Button
              label={following ? 'Following' : 'Follow'}
              variant={following ? 'primary' : 'secondary'}
              size="sm"
              className="px-6"
              onPress={() => setFollowing((value) => !value)}
            />
            <Button label="Message" variant="secondary" size="sm" className="px-6" />
            <View className="flex-1" />
            <IconButton accessibilityLabel="More options">
              <Ionicons name="ellipsis-horizontal" size={18} color={colors.content} />
            </IconButton>
          </View>

          <View className="mt-5 flex-row items-center justify-between px-6">
            <Stat
              icon={<Ionicons name="location-outline" size={16} color={iconColor} />}
              label="I'm in"
              value={profile.currentCity}
              labelPosition="before"
              className="flex-1"
            />
            <Divider orientation="vertical" className="h-8" />
            <Stat
              icon={<Ionicons name="earth-outline" size={16} color={iconColor} />}
              value={String(profile.countryCount)}
              label="Countries"
              className="flex-1"
            />
            <Divider orientation="vertical" className="h-8" />
            <Stat
              icon={<Ionicons name="people-outline" size={16} color={iconColor} />}
              value={String(profile.followerCount)}
              label="Followers"
              className="flex-1"
            />
          </View>

          <View className="mt-5 gap-4 px-4">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
