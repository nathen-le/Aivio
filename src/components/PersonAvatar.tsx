import React from 'react';
import type { PublicProfile } from '../lib/publicProfile';

/** Public-profile avatar tile in the style used across the Friends screens. */
export const PersonAvatar: React.FC<{ profile: PublicProfile | null; size?: 'md' | 'lg' }> = ({
  profile,
  size = 'md',
}) => (
  <div
    className={`${
      size === 'lg' ? 'w-16 h-16' : 'w-14 h-14'
    } shrink-0 rounded-2xl bg-gradient-to-br from-[#142344] to-[#1b3464] border-2 border-[#274885] flex items-center justify-center shadow-md overflow-hidden p-1`}
  >
    <img
      src={profile?.avatarUrl ?? '/mascot-cat-avatar.png'}
      alt=""
      className={`w-full h-full object-contain ${profile ? '' : 'opacity-40'}`}
    />
  </div>
);

export const personName = (profile: PublicProfile | null) =>
  profile ? profile.displayName || (profile.username ? `@${profile.username}` : 'Aivio learner') : 'Loading…';
