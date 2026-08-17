import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Label from '../../common/Label';
import { AppScreen, ScalePressable } from '../../components/ui';
import { dashboardCards, todayProgressRows } from '../../dummies';
import { palette, radius, shadows, spacing } from '../../constants/theme';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import { AppHeader } from '../../components';
import { useUserProfile, useDashboardStatus } from '../../hooks';
import BannerAdView from '../../components/BannerAdView';
import AppNativeAd from '../../components/NativeAdView';

const TAB_BAR_HEIGHT = hp(12);
const BANNER_AREA_HEIGHT = hp(8);

const CARD_ICONS = {
  daily: 'calendar-month',
  scratch: 'ticket-percent-outline',
  spin: 'poker-chip',
  watch: 'play-circle-outline',
  blockPuzzle: 'puzzle-outline',
};

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { username } = useUserProfile();
  const dashboardStatus = useDashboardStatus();

  const [featuredCard, ...otherCards] = dashboardCards;
  const featuredStatus =
    dashboardStatus[featuredCard.id] ?? featuredCard.status;
  // Tab bar is absolute to the screen; AppScreen already applies bottom inset.
  const bannerBottom = Math.max(TAB_BAR_HEIGHT - insets.bottom, 0);

  return (
    <AppScreen>
      <View style={styles.body}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <AppHeader
            variant="hero"
            title={en.home.greeting.replace(
              '{{username}}',
              username || en.home.defaultPlayer,
            )}
            subtitle={en.home.readyToEarn}
            showCoinPill
          />

          <Label style={styles.sectionTitle}>{en.home.todayProgress}</Label>
          <View style={styles.progressStrip}>
            {todayProgressRows.map(row => {
              const value = dashboardStatus[row.id] ?? row.value;
              const claimed = !value;

              return (
                <View key={row.id} style={styles.progressChip}>
                  <Label style={styles.progressChipLabel} numberOfLines={1}>
                    {row.label}
                  </Label>
                  <Label
                    style={[
                      styles.progressChipValue,
                      claimed && styles.progressChipClaimed,
                    ]}
                    numberOfLines={1}
                  >
                    {claimed ? en.home.claimed : value}
                  </Label>
                </View>
              );
            })}
          </View>

          <Label style={styles.sectionTitle}>{en.home.earnDiamonds}</Label>

          <ScalePressable
            onPress={() => navigation.navigate(featuredCard.route)}
            style={styles.featuredWrap}
          >
            <View
              style={[
                styles.featured,
                { backgroundColor: featuredCard.colors[0] },
              ]}
            >
              <View style={styles.featuredOrb} />
              <View style={styles.featuredOrbSmall} />
              <View style={styles.featuredTop}>
                <View style={styles.featuredIcon}>
                  <MaterialCommunityIcons
                    name={CARD_ICONS[featuredCard.id] || 'gift-outline'}
                    size={hp(3.2)}
                    color={COLORS.white}
                  />
                </View>
                {!!featuredStatus && (
                  <View style={styles.featuredStatus}>
                    <Label style={styles.featuredStatusText}>
                      {featuredStatus}
                    </Label>
                  </View>
                )}
              </View>
              <Label style={styles.featuredTitle}>{featuredCard.title}</Label>
              <Label style={styles.featuredSubtitle}>
                {featuredCard.subtitle}
              </Label>
              <View style={styles.featuredCta}>
                <Label style={styles.featuredCtaText}>
                  {en.home.earnDiamonds}
                </Label>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={hp(2)}
                  color={COLORS.white}
                />
              </View>
            </View>
          </ScalePressable>

          <View style={styles.nativeAdWrap}>
            <AppNativeAd />
          </View>

          <View style={styles.list}>
            {otherCards.map(item => {
              const status = dashboardStatus[item.id] ?? item.status;

              return (
                <ScalePressable
                  key={item.id}
                  onPress={() => navigation.navigate(item.route)}
                  style={styles.listItemWrap}
                >
                  <View style={styles.listItem}>
                    <View
                      style={[
                        styles.listIcon,
                        { backgroundColor: item.colors[0] },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={CARD_ICONS[item.id] || 'gift-outline'}
                        size={hp(2.6)}
                        color={COLORS.white}
                      />
                    </View>

                    <View style={styles.listCopy}>
                      <Label style={styles.listTitle} numberOfLines={1}>
                        {String(item.title).replace(/\n/g, ' ')}
                      </Label>
                      <Label style={styles.listSubtitle} numberOfLines={1}>
                        {String(item.subtitle).replace(/\n/g, ' ')}
                      </Label>
                    </View>

                    <View style={styles.listRight}>
                      {!!status && (
                        <Label style={styles.listStatus}>{status}</Label>
                      )}
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={hp(2.6)}
                        color={palette.textSecondary}
                      />
                    </View>
                  </View>
                </ScalePressable>
              );
            })}
          </View>
        </ScrollView>

        <View
          pointerEvents="box-none"
          style={[styles.stickyBanner, { bottom: bannerBottom }]}
        >
          <BannerAdView style={styles.bannerWrap} />
        </View>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: hp(3),
    paddingBottom: TAB_BAR_HEIGHT + BANNER_AREA_HEIGHT + hp(2),
  },
  stickyBanner: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingVertical: hp(0.6),
    backgroundColor: palette.pageBottom,
    borderTopWidth: 1,
    borderTopColor: palette.whiteTint08,
    zIndex: 20,
    elevation: 20,
  },
  bannerWrap: {
    marginHorizontal: 0,
  },
  sectionTitle: {
    color: palette.textPrimary,
    fontSize: hp(1.85),
    fontFamily: FONT.bold,
    marginBottom: hp(1.2),
    marginTop: hp(2.4),
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.92,
  },
  progressStrip: {
    flexDirection: 'row',
    gap: wp(2.2),
  },
  progressChip: {
    flex: 1,
    backgroundColor: palette.card,
    borderRadius: radius.md,
    paddingVertical: hp(1.3),
    paddingHorizontal: wp(2.2),
    borderWidth: 1,
    borderColor: palette.whiteTint08,
    ...shadows.card,
  },
  progressChipLabel: {
    color: palette.textSecondary,
    fontSize: hp(1.25),
    fontFamily: FONT.medium,
    marginBottom: hp(0.55),
  },
  progressChipValue: {
    color: palette.orange,
    fontSize: hp(1.55),
    fontFamily: FONT.bold,
  },
  progressChipClaimed: {
    color: palette.activeGreen,
  },
  featuredWrap: {
    marginBottom: hp(1.6),
  },
  nativeAdWrap: {
    marginBottom: hp(1.6),
  },
  featured: {
    borderRadius: radius.xl,
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.2),
    overflow: 'hidden',
    minHeight: hp(22),
    justifyContent: 'space-between',
    ...shadows.card,
  },
  featuredOrb: {
    position: 'absolute',
    width: wp(42),
    height: wp(42),
    borderRadius: wp(21),
    backgroundColor: palette.whiteTint08,
    top: -wp(12),
    right: -wp(10),
  },
  featuredOrbSmall: {
    position: 'absolute',
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: palette.whiteTint08,
    bottom: hp(2),
    right: wp(8),
  },
  featuredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredIcon: {
    width: wp(13),
    height: wp(13),
    borderRadius: radius.md,
    backgroundColor: palette.whiteTint18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredStatus: {
    borderRadius: radius.pill,
    paddingVertical: hp(0.4),
    paddingHorizontal: wp(3),
    backgroundColor: COLORS.white + HEX_OPACITY[20],
  },
  featuredStatusText: {
    color: COLORS.white,
    fontSize: hp(1.4),
    fontFamily: FONT.semiBold,
  },
  featuredTitle: {
    marginTop: hp(2.2),
    color: COLORS.white,
    fontSize: hp(3),
    fontFamily: FONT.bold,
  },
  featuredSubtitle: {
    marginTop: hp(0.4),
    color: COLORS.white + HEX_OPACITY[85],
    fontSize: hp(1.75),
    fontFamily: FONT.medium,
  },
  featuredCta: {
    marginTop: hp(2),
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    backgroundColor: COLORS.white + HEX_OPACITY[18],
    paddingVertical: hp(0.85),
    paddingHorizontal: wp(4),
    borderRadius: radius.pill,
  },
  featuredCtaText: {
    color: COLORS.white,
    fontSize: hp(1.55),
    fontFamily: FONT.semiBold,
  },
  list: {
    gap: hp(1.1),
  },
  listItemWrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    paddingVertical: hp(1.35),
    paddingHorizontal: wp(3.5),
    borderWidth: 1,
    borderColor: palette.whiteTint08,
  },
  listIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listCopy: {
    flex: 1,
    marginLeft: wp(3.2),
    marginRight: wp(2),
    minWidth: 0,
  },
  listTitle: {
    width: '100%',
    color: palette.textPrimary,
    fontSize: hp(1.9),
    fontFamily: FONT.semiBold,
  },
  listSubtitle: {
    width: '100%',
    marginTop: hp(0.25),
    color: palette.textSecondary,
    fontSize: hp(1.45),
    fontFamily: FONT.medium,
  },
  listRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  listStatus: {
    color: palette.orange,
    fontSize: hp(1.35),
    fontFamily: FONT.semiBold,
    marginRight: wp(0.5),
  },
});

export default HomeScreen;
