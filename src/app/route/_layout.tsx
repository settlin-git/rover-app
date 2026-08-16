import { Stack } from 'expo-router';

import { RouteProvider } from '@/features/route/route-store';

/**
 * The route builder.
 *
 * Everything under here shares one in-progress route, held by the provider.
 * Mounting it at the layout means the state lives exactly as long as the modal:
 * closing the builder without saving discards the route, which is what closing
 * a modal should do.
 */
export default function RouteLayout() {
  return (
    <RouteProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="search" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen
          name="details"
          options={{ presentation: 'transparentModal', animation: 'fade' }}
        />
      </Stack>
    </RouteProvider>
  );
}
