import React from 'react';
import { View ,StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../../common/Label';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import SvgIcon from '../../common/SvgIcon';

const ProfileStatItem = ({ item, value = 0}) => {
  return (
    <View style={styles.statItem}>
      <View style={[styles.statIconBox, { backgroundColor: item.color + '33' }]}>
        <SvgIcon icon={item.icon} height={hp(3)} width={hp(3)} />
      </View>
      <Label style={styles.statNumber}>{value}</Label>
      <Label style={styles.statLabel}>{item.label}</Label>
    </View>
  );
};

export default ProfileStatItem;


const styles = StyleSheet.create({
      statItem: {
        width: '31.5%',
        alignItems: 'center',
      },
      statIconBox: {
        width: wp(12),
        height: wp(12),
        borderRadius: wp(6),
        justifyContent: 'center',
        alignItems: 'center',
      },
      statNumber: {
        marginTop: hp(2),
        color: COLORS.yellow,
        fontSize: hp(3.1),
        fontFamily: FONT.semiBold,
      },
      statLabel: {
        color: COLORS.white+HEX_OPACITY[72],
        fontSize: hp(1.7),
        textAlign: 'center',
        fontFamily: FONT.semiBold,
      },
});