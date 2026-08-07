import React, { useRef, useState } from 'react';
import { Alert, Animated, ScrollView, Share, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../../common/Label';
import { AppScreen } from '../../components/ui';
import { profileActions } from '../../dummies';
import { palette, radius, shadows, spacing } from '../../constants/theme';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import { stats } from '../../dummies';
import { SCREEN } from '../../enums';
import { AppHeader } from '../../components';
import ProfileStatItem from '../../components/ProfileStatItem';
import ProfileSettingsItem from '../../components/ProfileSettingsItem';
import { useUserProfile, useCoinsData } from '../../hooks';
import { logoutUser } from '../../services/firebaseServices';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.perkmedia.FFdiamonds';

const ProfileScreen = ({ navigation }) => {
  const [isContactVisible, setIsContactVisible] = useState(false);
  const popupTranslateY = useRef(new Animated.Value(100)).current;
  const { username, gameId } = useUserProfile();
  const { coins ,dailyStreak,transactions  } = useCoinsData();
  console.log(dailyStreak);

  const profileStats = [
    {
      ...stats[0],
      value: coins,
    },
    {
      ...stats[1],
      value:dailyStreak.count,
    },
    {
      ...stats[2],
      value: transactions,
    },
  ];

  const showContactPopup = () => {
    if (isContactVisible) {
      return;
    }

    setIsContactVisible(true);
    Animated.sequence([
      Animated.timing(popupTranslateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.delay(2200),
      Animated.timing(popupTranslateY, {
        toValue: 100,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsContactVisible(false);
      popupTranslateY.setValue(100);
    });
  };

  const onShareApp = async () => {
    try {
      await Share.share({
        title: en.profile.shareTitle,
        message: `${en.profile.shareMessage}\n${PLAY_STORE_URL}`,
        url: PLAY_STORE_URL,
      });
    } catch (error) {
      console.log('Share app failed:', error?.message || error);
    }
  };

  const onLogout = () => {
    Alert.alert(
      en.profile.logoutConfirmTitle,
      en.profile.logoutConfirmMessage,
      [
        {
          text: en.profile.cancel,
          style: 'cancel',
        },
        {
          text: en.rewardData.logout,
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: SCREEN.WELCOME_SCREEN,
                  },
                ],
              });
            } catch (error) {
              console.log('Logout error:', error?.message || error);
            }
          },
        },
      ],
    );
  };

  const onActionPress = id => {
    if (id === 'history') {
      navigation.navigate(SCREEN.TRANSACTION_HISTORY_SCREEN);
      return;
    }

    if (id === 'privacy') {
      navigation.navigate(SCREEN.PRIVACY_POLICY_SCREEN);
      return;
    }

    if (id === 'contact') {
      showContactPopup();
      return;
    }

    if (id === 'share') {
      onShareApp();
      return;
    }

    if (id === 'logout') {
      onLogout();
    }
  };

  return (
    <AppScreen>
      <AppHeader title={en.profile.headerTitle} showCoinPill />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <MaterialCommunityIcons
              name="account-outline"
              size={hp(5.4)}
              color={COLORS.white}
            />
          </View>
          <Label style={styles.userName}>{username || 'Player'}</Label>
          <View style={styles.userIdChip}>
            <Label style={styles.userIdText}>ID: {gameId || 'N/A'}</Label>
          </View>

          <View style={styles.statsRow}>
            {profileStats.map(item => (
              <ProfileStatItem
                key={item.label}
                item={item}
                value={item.value}
              />
            ))}
          </View>
        </View>

        <View style={styles.actionsCard}>
          {profileActions.map((item, index) => (
            <ProfileSettingsItem
              key={item.id}
              item={item}
              isLast={index === profileActions.length - 1}
              onPress={() => onActionPress(item.id)}
            />
          ))}
        </View>

        <View style={styles.footerCard}>
          <Label style={styles.footerTitle}>{en.profile.footerTitle}</Label>
          <Label style={styles.footerSub}>{en.profile.footerSubtitle}</Label>
        </View>
      </ScrollView>

      {isContactVisible ? (
        <Animated.View
          style={[
            styles.contactPopup,
            { transform: [{ translateY: popupTranslateY }] },
          ]}
        >
          <Label style={styles.contactPopupText}>
            {en.profile.contactPopupMessage}
          </Label>
        </Animated.View>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: hp(1.3),
    paddingBottom: hp(14),
  },
  profileCard: {
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    ...shadows.card,
  },
  avatarWrap: {
    width: wp(21),
    height: wp(21),
    borderRadius: wp(10.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.orange,
    ...shadows.glow,
  },
  userName: {
    marginTop: hp(0.8),
    color: COLORS.white,
    fontSize: hp(3.6),
    fontFamily: FONT.semiBold,
  },
  userIdChip: {
    marginTop: hp(0.3),
    borderRadius: hp(1),
    backgroundColor: COLORS.accent + HEX_OPACITY[30],
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.45),
  },
  userIdText: {
    color: COLORS.accent,
    fontSize: hp(2.2),
    fontFamily: FONT.semiBold,
  },
  statsRow: {
    marginTop: hp(1.4),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionsCard: {
    marginTop: hp(1.3),
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(2),
    ...shadows.card,
  },
  footerCard: {
    marginTop: hp(3),
    marginBottom: hp(1),
    marginHorizontal: hp(3),
    borderRadius: hp(2),
    backgroundColor: palette.pageBottom,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
  },
  footerTitle: {
    color: COLORS.white + HEX_OPACITY[72],
    fontSize: hp(1.4),
    fontFamily: FONT.semiBold,
  },
  footerSub: {
    marginTop: hp(0.2),
    color: COLORS.white + HEX_OPACITY[62],
    fontSize: hp(1.5),
    fontFamily: FONT.regular,
  },
  contactPopup: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: hp(10.2),
    backgroundColor: COLORS.accent,
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(6),
  },
  contactPopupText: {
    color: COLORS.white,
    fontSize: hp(1.9),
    fontFamily: FONT.medium,
    lineHeight: hp(3),
  },
});

export default ProfileScreen;
