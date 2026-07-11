import { FRUITS_DATA } from '../dummies';
import { Alert, Platform, PermissionsAndroid ,Share } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { en } from '../languages';


export const hexToRgba = (hex, opacity = 1) => {
  const cleanHex = hex.replace('#', '');

  const bigint = parseInt(cleanHex, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const TOTAL_TIME = 120;
export const TOTAL_LETTERS = 20;

export const shuffleArray = array => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const generateLetters = answer => {
  const answerLetters = answer.toUpperCase().split('');

  const randomLetters = [];

  while (randomLetters.length < TOTAL_LETTERS - answerLetters.length) {
    randomLetters.push(ALPHABETS[Math.floor(Math.random() * ALPHABETS.length)]);
  }

  return shuffleArray([...answerLetters, ...randomLetters]).map(
    (letter, index) => ({
      id: index.toString(),
      letter,
      selected: false,
    }),
  );
};

export const formatTime = seconds => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export const generateGameCards = () => {
  const pairs = [...FRUITS_DATA, ...FRUITS_DATA];
  return pairs
    .map((fruit, index) => ({
      ...fruit,
      uniqueId: `${fruit.id}-${index}-${Math.random()}`, // Unique key for rendering
      isFlipped: false,
      isMatched: false,
    }))
    .sort(() => Math.random() - 0.5);
};

export const checkPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: en.helpers.storagePermissionTitle,
        message: en.helpers.storagePermissionMessage,
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

// Centralized Download Function
export const handleImageDownload = async (imageUrl, onSuccess, onError) => {
  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
    onError(en.helpers.invalidLinkTitle, en.helpers.invalidLinkMessage);
    return;
  }

  const hasPermission = await checkPermission();
  if (!hasPermission) {
    onError(en.helpers.permissionDeniedTitle, en.helpers.permissionDeniedMessage);
    return;
  }

  try {
    const { fs } = ReactNativeBlobUtil;
    const { CacheDir } = fs.dirs;

    const date = new Date();
    const filePath = `${CacheDir}/item_${Math.floor(date.getTime() + date.getSeconds())}.png`;

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
        Accept: 'image/png,image/jpeg,image/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Server network rejected with status: ${response.status}`);
    }

    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result.split(',')[1];
        await fs.writeFile(filePath, base64Data, 'base64');

        await CameraRoll.save(filePath, { type: 'photo' });
        
        // Trigger Dynamic Success Modal Callback
        onSuccess(en.helpers.downloadSuccessTitle, en.helpers.downloadSuccessMessage);

        fs.unlink(filePath).catch(err => console.log('Clean up err:', err));
      } catch (saveError) {
        onError(en.helpers.compilationErrorTitle, en.helpers.compilationErrorMessage);
        console.log('Conversion/Save Error:', saveError);
      }
    };
  } catch (err) {
    onError(en.helpers.networkErrorTitle, en.helpers.networkErrorMessage);
    console.log('Standard Fetch Core Error: ', err);
  }
};


export const getAvatarStyleName = (stylesList, selectedId) => {
  const currentStyle = stylesList.find(style => style.id === selectedId);
  return currentStyle ? currentStyle.title : en.helpers.defaultStyle;
};

export const generateUniqueId = () => Date.now().toString();


export const shareAvatar = async (promptText, styleName) => {
  try {
    const message = en.helpers.shareAvatarMessage
      .replace('{{prompt}}', promptText)
      .replace('{{style}}', styleName || en.helpers.robuxAvatar);
    
    await Share.share({
      message: message,
    });
  } catch (error) {
    console.log('Sharing error: ', error.message);
  }
};

export const isIOS = () => Platform.OS === 'ios';