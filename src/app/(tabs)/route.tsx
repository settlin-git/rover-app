import { Redirect } from 'expo-router';

/**
 * Never rendered. The Route tab intercepts its own press in the tab layout and
 * opens the route builder as a modal, but Expo Router still needs a file for
 * the tab to exist. The redirect covers the case of arriving here by deep link.
 */
export default function RouteTabPlaceholder() {
  return <Redirect href="/route" />;
}
