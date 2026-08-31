import { getCurrentUser } from '../firebaseServices';

/**
 * Always returns the signed-in Firebase uid.
 * Perkox `player_id` must be this value.
 */
export const getPerkoxPlayerId = () => {
  const user = getCurrentUser();

  if (!user?.uid) {
    throw new Error('Firebase user is required for Perkox player_id.');
  }

  return user.uid;
};
