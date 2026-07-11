import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../../common/Label';
import { ScalePressable } from '../ui';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { palette } from '../../constants/theme';

const ProfileSettingsItem = ({ item, isLast, onPress }) => {
  return (
    <ScalePressable onPress={onPress}>
      <View style={[styles.actionRow, isLast && styles.lastRow]}>
        <View
          style={[styles.actionIconBox, { backgroundColor: item.color + '33' }]}
        >
          <MaterialCommunityIcons
            name={item.icon}
            size={hp(3)}
            color={item.color}
          />
        </View>

        <View style={styles.actionTextWrap}>
          <View style={styles.actionTitleRow}>
            <Label style={styles.actionTitle}>{item.title}</Label>
            {item.chip ? (
              <View style={styles.chip}>
                <Label style={styles.chipText}>{item.chip}</Label>
              </View>
            ) : null}
          </View>
          <Label style={styles.actionSubtitle}>{item.subtitle}</Label>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={hp(3.2)}
          color={COLORS.lightBlue}
        />
      </View>
    </ScalePressable>
  );
};

export default ProfileSettingsItem;

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
    paddingVertical: hp(2),
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  actionIconBox: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextWrap: {
    flex: 1,
    marginLeft: wp(2.6),
  },
  actionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.2),
  },
  actionTitle: {
    color: COLORS.white,
    fontSize: hp(2.2),
    fontFamily: FONT.semiBold,
  },
  actionSubtitle: {
    marginTop: hp(0.1),
    color: COLORS.white + HEX_OPACITY[35],
    fontSize: hp(1.8),
    fontFamily: FONT.medium,
  },

  chip: {
    backgroundColor: COLORS.red,
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    marginLeft: wp(1),
  },
  chipText: {
    color: COLORS.white,
    fontSize: hp(1.3),
    fontFamily: FONT.medium,
  },
});
