import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'ff_session_mode';

export const SESSION_MODE = {
  LOGGED_OUT: 'logged_out',
  GUEST: 'guest',
  ACTIVE: 'active',
};

export const getSessionMode = async () => {
  try {
    return await AsyncStorage.getItem(SESSION_KEY);
  } catch (error) {
    console.log('Failed to read session mode:', error?.message || error);
    return null;
  }
};

export const setSessionMode = async mode => {
  try {
    await AsyncStorage.setItem(SESSION_KEY, mode);
  } catch (error) {
    console.log('Failed to save session mode:', error?.message || error);
  }
};
