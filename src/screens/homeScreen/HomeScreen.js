import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../../common/Label';
import { AppScreen, ScalePressable } from '../../components/ui';
import { dashboardCards, todayProgressRows } from '../../dummies';
import { palette, radius, shadows, spacing } from '../../constants/theme';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import { AppHeader } from '../../components';

const HomeScreen = ({ navigation }) => {
  return (
    <AppScreen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <AppHeader
          variant="hero"
          title={en.home.greeting}
          subtitle={en.home.readyToEarn}
          showCoinPill
          coins={0}
        />

        <Label style={styles.sectionTitle}>{en.home.earnDiamonds}</Label>
        <View style={styles.grid}>
          {dashboardCards.map(item => (
            <ScalePressable
              key={item.id}
              style={styles.tileWrap}
              onPress={() => navigation.navigate(item.route)}
            >
              <LinearGradient
                colors={item.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tile}
              >
                <View style={styles.tileTopRow}>
                  <View style={styles.iconBadge}>
                    <MaterialCommunityIcons
                      name={item.icon}
                      color="#F6FBFF"
                      size={hp(2)}
                    />
                  </View>
                  <View style={styles.statusBadge}>
                    <Label style={styles.statusText}>{item.status}</Label>
                  </View>
                </View>
                <Label style={styles.tileTitle}>{item.title}</Label>
                <Label style={styles.tileSubtitle}>{item.subtitle}</Label>
              </LinearGradient>
            </ScalePressable>
          ))}
        </View>

        <View style={styles.progressCard}>
          <Label style={styles.progressTitle}>{en.home.todayProgress}</Label>
          {todayProgressRows.map(row => (
            <View key={row.id} style={styles.progressRow}>
              <Label style={styles.progressLabel}>{row.label}</Label>
              <Label style={styles.progressValue}>{row.value}</Label>
            </View>
          ))}
        </View>
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: hp(4),
    paddingBottom: hp(14),
  },
  sectionTitle: {
    color: palette.textPrimary,
    fontSize: hp(2.1),
    fontFamily: FONT.bold,
    marginBottom: hp(1),
    marginTop: hp(3),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: hp(1.3),
  },
  tileWrap: {
    width: '48.2%',
  },
  tile: {
    height: hp(25),
    borderRadius: radius.lg,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.1),
    ...shadows.card,
  },
  tileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(0.9),
  },
  iconBadge: {
    width: wp(10),
    height: wp(10),
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    borderRadius: radius.pill,
    paddingVertical: hp(0.2),
    paddingHorizontal: wp(2),
    backgroundColor: '#EFF2F5',
  },
  statusText: {
    fontSize: hp(1.6),
    color: '#6A5B58',
    fontWeight: '700',
  },
  tileTitle: {
    color: COLORS.white,
    fontSize: hp(2),
    fontFamily: FONT.semiBold,
  },
  tileSubtitle: {
    marginTop: hp(0.45),
    fontSize: hp(1.9),
    fontFamily:FONT.medium,
    color: palette.textPrimary,
  },
  progressCard: {
    marginTop: hp(8),
    borderRadius: radius.lg,
    paddingHorizontal: wp(4.8),
    paddingVertical: hp(1.7),
    backgroundColor: '#142755',
    ...shadows.card,
  },
  progressTitle: {
    color: palette.textPrimary,
    fontSize: hp(2.9),
    fontFamily: FONT.bold,
    marginBottom: hp(0.6),
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(0.55),
  },
  progressLabel: {
    color: '#E8EEFF',
    fontSize: hp(2.3),
    fontFamily: FONT.medium,
  },
  progressValue: {
    color: '#4DC65D',
    fontSize: hp(1.8),
    fontFamily: FONT.medium,
  },
});

export default HomeScreen;
