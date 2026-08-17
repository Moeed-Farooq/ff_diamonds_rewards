import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../../common/Label';
import { AppScreen } from '../../components/ui';
import { en } from '../../languages';
import { palette, radius, shadows, spacing } from '../../constants/theme';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { AppHeader } from '../../components';
import PolicySectionBlock from '../../components/PolicySectionBlock';

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <AppScreen>
      <AppHeader
        title={en.privacyPolicy.screenTitle}
        showBackButton
        onLeftPress={() => navigation.goBack()}
        titleSpacing={wp(6)}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topCard}>
          <View style={styles.policyIconWrap}>
            <MaterialCommunityIcons
              name="shield-check"
              size={hp(4.2)}
              color={palette.green}
            />
          </View>
          <View style={styles.topCardTextWrap}>
            <Label style={styles.topCardTitle}>{en.privacyPolicy.screenTitle}</Label>
            <Label style={styles.topCardDate}>{en.privacyPolicy.lastUpdated}</Label>
          </View>
        </View>

        <View style={styles.policyCard}>
          <PolicySectionBlock
            title={en.privacyPolicy.collectTitle}
            description={en.privacyPolicy.collectDescription}
            styles={styles}
            bullets={[
              en.privacyPolicy.collectBullet1,
              en.privacyPolicy.collectBullet2,
              en.privacyPolicy.collectBullet3,
              en.privacyPolicy.collectBullet4,
            ]}
          />

          <PolicySectionBlock
            title={en.privacyPolicy.usageTitle}
            description={en.privacyPolicy.usageDescription}
            styles={styles}
            bullets={[
              en.privacyPolicy.usageBullet1,
              en.privacyPolicy.usageBullet2,
              en.privacyPolicy.usageBullet3,
              en.privacyPolicy.usageBullet4,
            ]}
          />

          <PolicySectionBlock
            title={en.privacyPolicy.storageTitle}
            description={en.privacyPolicy.storageDescription}
            styles={styles}
          />

          <PolicySectionBlock
            title={en.privacyPolicy.thirdPartyTitle}
            description={en.privacyPolicy.thirdPartyDescription}
            styles={styles}
            bullets={[
              en.privacyPolicy.thirdPartyBullet1,
              en.privacyPolicy.thirdPartyBullet2,
              en.privacyPolicy.thirdPartyBullet3,
            ]}
          />

          <Label style={[styles.sectionBody, styles.followUp]}>
            {en.privacyPolicy.thirdPartyFollowup}
          </Label>

          <PolicySectionBlock
            title={en.privacyPolicy.rightsTitle}
            description={en.privacyPolicy.rightsDescription}
            styles={styles}
            bullets={[
              en.privacyPolicy.rightsBullet1,
              en.privacyPolicy.rightsBullet2,
              en.privacyPolicy.rightsBullet3,
              en.privacyPolicy.rightsBullet4,
            ]}
          />

          <PolicySectionBlock
            title={en.privacyPolicy.deletionTitle}
            description={en.privacyPolicy.deletionDescription}
            styles={styles}
          />

          <PolicySectionBlock
            title={en.privacyPolicy.contactTitle}
            description={en.privacyPolicy.contactDescription}
            styles={styles}
          />

          <Label style={styles.contactLine}>{en.privacyPolicy.contactEmail}</Label>
          <Label style={[styles.contactLine, styles.contactBottom]}>
            {en.privacyPolicy.contactSubject}
          </Label>
        </View>

        <View style={styles.footerCard}>
          <Label style={styles.footerText}>{en.privacyPolicy.footerAgreement}</Label>
        </View>
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: hp(1.8),
    paddingBottom: hp(3),
  },
  topCard: {
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5.5),
    paddingVertical: hp(1.8),
    ...shadows.card,
  },
  policyIconWrap: {
    width: wp(11),
    height: wp(11),
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.privacyIconBg,
  },
  topCardTextWrap: {
    marginLeft: wp(4),
    flex: 1,
  },
  topCardTitle: {
    color: COLORS.white,
    fontSize: hp(2.3),
    fontFamily: FONT.bold,
  },
  topCardDate: {
    marginTop: hp(0.2),
    color: COLORS.white + HEX_OPACITY[62],
    fontSize: hp(1.9),
    fontFamily: FONT.medium,
  },
  policyCard: {
    marginTop: hp(1.8),
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    paddingHorizontal: wp(5.5),
    paddingVertical: hp(2),
    ...shadows.card,
  },
  sectionWrap: {
    marginBottom: hp(1.4),
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: hp(2.3),
    fontFamily: FONT.bold,
    marginBottom: hp(0.7),
  },
  sectionBody: {
    color: COLORS.white + HEX_OPACITY[62],
    fontSize: hp(1.9),
    lineHeight: hp(3),
    fontFamily: FONT.medium,
  },
  bulletText: {
    color: COLORS.white + HEX_OPACITY[62],
    fontSize: hp(1.9),
    lineHeight: hp(3),
    fontFamily: FONT.medium,
  },
  followUp: {
    marginTop: hp(0.2),
    marginBottom: hp(1.5),
  },
  contactLine: {
    color: COLORS.white + HEX_OPACITY[62],
    fontSize: hp(1.9),
    lineHeight: hp(3),
    fontFamily: FONT.medium,
  },
  contactBottom: {
    marginBottom: hp(1),
  },
  footerCard: {
    marginTop: hp(1.8),
    borderRadius: radius.lg,
    backgroundColor: palette.privacyFooterBg,
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(5),
    marginBottom: hp(2),
  },
  footerText: {
    color: COLORS.white + HEX_OPACITY[62],
    fontSize: hp(2),
    lineHeight: hp(3.2),
    textAlign: 'center',
    fontFamily: FONT.medium,
    fontStyle: 'italic',
  },
});

export default PrivacyPolicyScreen;
