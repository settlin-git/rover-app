export type Profile = {
  id: string;
  name: string;
  /**
   * Header photo. Optional on purpose — a profile without one still has to
   * look deliberate, so the header falls back to a gradient rather than a gap.
   *
   * Placeholder demo content. Replace with images your users upload.
   */
  coverUrl?: string;
  currentCity: string;
  countryCount: number;
  followerCount: number;
  isFollowing: boolean;
};

const PROFILE: Profile = {
  id: 'john-smith',
  name: 'John Smith',
  coverUrl:
    'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?auto=format&fit=crop&w=900&q=70',
  currentCity: 'New Delhi',
  countryCount: 32,
  followerCount: 109,
  isFollowing: false,
};

export function getProfile(): Profile {
  return PROFILE;
}
