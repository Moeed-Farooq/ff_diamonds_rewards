import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../../common/Label';
import { AppScreen } from '../../components/ui';
import { redemptionItems } from '../../dummies';
import { palette, radius, shadows, spacing } from '../../constants/theme';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import { AppHeader } from '../../components';
import RedemptionItemCard from '../../components/RedemptionItemCard';

const WithdrawalScreen = () => {
  return (
    <AppScreen>
      <AppHeader title={en.withdrawal.headerTitle} showCoinPill coins={0} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={{ alignSelf: 'center' }}>
            <MaterialCommunityIcons
              name="gift"
              size={hp(6.8)}
              color={palette.purple}
            />
          </View>
          <Label style={styles.heroTitle}>{en.withdrawal.heroTitle}</Label>
          <Label style={styles.heroText}>{en.withdrawal.heroSubtitle}</Label>
        </View>

        <View style={styles.grid}>
          {redemptionItems.map(item => (
            <RedemptionItemCard key={item.id} item={item} styles={styles} />
          ))}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoTitleRow}>
            <MaterialCommunityIcons
              name="information"
              size={hp(3.4)}
              color="#2CA0FF"
            />
            <Label style={styles.infoTitle}>{en.withdrawal.infoTitle}</Label>
          </View>
          <Label style={styles.infoBullet}>{en.withdrawal.infoBullet1}</Label>
          <Label style={styles.infoBullet}>{en.withdrawal.infoBullet2}</Label>
          <Label style={styles.infoBullet}>{en.withdrawal.infoBullet3}</Label>
          <Label style={styles.infoBullet}>{en.withdrawal.infoBullet4}</Label>
        </View>
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: hp(1.3),
    paddingBottom: hp(14),
  },
  heroCard: {
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    paddingVertical: hp(3),
    paddingHorizontal: wp(4.5),
    ...shadows.card,
  },
  heroTitle: {
    marginTop: hp(2.7),
    color: COLORS.white,
    fontSize: hp(2.9),
    fontFamily: FONT.bold,
    textAlign:'center'
  },
  heroText: {
    marginTop: hp(0.4),
    color: COLORS.white + HEX_OPACITY[63],
    fontSize: hp(2),
    fontFamily: FONT.medium,
    textAlign:'center'
  },
  grid: {
    marginTop: hp(5),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: hp(1.1),
  },
  itemWrap: {
    width: '48.5%',
  },
  itemCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    height: hp(30),
    padding: wp(2.7),
    alignItems: 'center',
    ...shadows.card,
    justifyContent:'center'
  },
  itemImageBox: {
    width: '100%',
    height: hp(6.1),
    borderRadius: radius.sm,
    backgroundColor: '#ECEEF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImageText: {
    color: COLORS.black,
    fontSize: hp(1.7),
    fontFamily: FONT.bold,
  },
  itemTitle: {
    width: '100%',
    marginTop: hp(1.1),
    color: COLORS.white,
    fontSize: hp(1.5),
    fontFamily: FONT.medium,
  },
  progressTrack: {
    marginTop: hp(1),
    width: '100%',
    height: hp(0.52),
    borderRadius: radius.pill,
    backgroundColor: COLORS.blue + HEX_OPACITY[38],
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.green,
  },
  itemProgressText: {
    marginTop: hp(0.55),
    color: COLORS.white  + HEX_OPACITY[48],
    fontSize: hp(1.6),
    fontFamily: FONT.medium,
  },
  infoCard: {
    marginTop: hp(5),
    borderRadius: radius.lg,
    backgroundColor: COLORS.yellow + HEX_OPACITY[70],
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2.9),
    marginBottom: hp(2),
  },
  infoTitle: {
    color: COLORS.white,
    fontSize: hp(2),
    fontFamily: FONT.bold,
  },
  infoBullet: {
    color: COLORS.white + HEX_OPACITY[93],
    fontSize: hp(1.8),
    fontFamily: FONT.medium,
  },
});

export default WithdrawalScreen;
