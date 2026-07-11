import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../../common/Label';
import { AppScreen } from '../../components/ui';
import { en } from '../../languages';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { AppHeader } from '../../components';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';

const TransactionHistoryScreen = ({ navigation }) => {
  return (
    <AppScreen>
      <AppHeader
        title={en.transactionHistory.screenTitle}
        showBackButton
        onLeftPress={() => navigation.goBack()}
        titleSpacing={wp(6)}
      />

      <View style={styles.emptyWrap}>
       <SvgIcon icon={SVG.document} height={hp(8)} width={hp(8)}/>
        <Label style={styles.emptyTitle}>{en.transactionHistory.emptyTitle}</Label>
        <Label style={styles.emptySubtitle}>{en.transactionHistory.emptySubtitle}</Label>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(10),
    marginBottom: hp(8),
  },
  emptyTitle: {
    marginTop: hp(1.8),
    color: COLORS.white,
    fontSize: hp(3),
    fontFamily: FONT.bold,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: hp(1),
    color: COLORS.white + HEX_OPACITY[62],
    fontSize: hp(2),
    textAlign: 'center',
    lineHeight: hp(3),
    fontFamily: FONT.medium,
  },
});

export default TransactionHistoryScreen;
