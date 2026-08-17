import { View, StyleSheet } from 'react-native';
import * as ui from '../screens';
import { SCREEN } from '../enums';
import If from '../common/If';
import Label from '../common/Label';
import SvgIcon from '../common/SvgIcon';
import { bottomIcons } from '../dummies';
import {
  COLORS,
  commonStyles,
  FONT,
  HEX_OPACITY,
  hp,
  wp,
} from '../enums/StyleGuide';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { palette } from '../constants/theme';
import { useUserProfile } from '../hooks';

const ICON_SIZE = wp(6);

const renderIcon =
  routeName =>
  ({ focused }) => {
    const item = bottomIcons[routeName];
    if (!item) {
      return null;
    }

    return (
      <View style={[styles.tabContainer, item.title && { marginTop: hp(6) }]}>
        <View style={[styles.iconBg, focused && styles.activeIconBg]}>
          <SvgIcon
            icon={focused ? item.activeIcon : item.iconName}
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        </View>
        <If condition={item?.title}>
          <Label
            style={[
              styles.text,
              focused ? styles.activeText : styles.inactiveText,
            ]}
          >
            {item?.title}
          </Label>
        </If>
      </View>
    );
  };

const BottomNavigator = () => {
  const Tab = createBottomTabNavigator();
  const { isGuest } = useUserProfile();

  const guestTabListeners = ({ navigation }) => ({
    tabPress: e => {
      if (!isGuest) {
        return;
      }

      e.preventDefault();

      const rootNavigation = navigation.getParent();

      if (rootNavigation) {
        rootNavigation.reset({
          index: 0,
          routes: [{ name: SCREEN.WELCOME_SCREEN }],
        });
        return;
      }

      navigation.reset({
        index: 0,
        routes: [{ name: SCREEN.WELCOME_SCREEN }],
      });
    },
  });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: renderIcon(route.name),
        tabBarItemStyle: {
          paddingRight: 0,
          paddingLeft: 0,
        },
        tabBarStyle: {
          position: 'absolute',
          height: hp(12),
          borderRadius: wp(8),
          backgroundColor: palette.tabBar,
          borderColor: COLORS.orange + HEX_OPACITY[55],
          shadowColor: COLORS.orange,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 14,
        },
      })}
    >
      <Tab.Screen name={SCREEN.HOME_SCREEN} component={ui.HomeScreen} />
      <Tab.Screen
        name={SCREEN.WITHDRAWAL_SCREEN}
        component={ui.WithdrawalScreen}
        listeners={guestTabListeners}
      />
      <Tab.Screen
        name={SCREEN.PROFILE_SCREEN}
        component={ui.ProfileScreen}
        listeners={guestTabListeners}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  tabContainer: {
    height: '100%',
    width: wp(22),
    ...commonStyles.center,
  },
  iconBg: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    ...commonStyles.center,
    backgroundColor: COLORS.orange + HEX_OPACITY[6],
    // borderWidth: 1,
    borderColor: COLORS.orange + HEX_OPACITY[12],
  },
  activeIconBg: {
    backgroundColor: COLORS.orange + HEX_OPACITY[20],
    borderColor: COLORS.orange + HEX_OPACITY[68],
  },
  text: {
    fontSize: 11,
    fontFamily: FONT.medium,
    textAlign: 'center',
    marginTop: hp(0.4),
  },
  activeText: {
    color: COLORS.orange,
    textShadowColor: COLORS.orange + HEX_OPACITY[45],
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  inactiveText: {
    color: COLORS.grey,
  },
});
