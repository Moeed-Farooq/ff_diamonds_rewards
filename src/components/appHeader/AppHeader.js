import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Label from '../../common/Label';
import { CoinPill } from '../ui';
import { palette, spacing } from '../../constants/theme';
import { FONT, hp, wp } from '../../enums/StyleGuide';

const AppHeader = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  showBackButton = false,
  showCoinPill = false,
  variant = 'screen',
  containerStyle,
  titleStyle,
  subtitleStyle,
  leftWrapStyle,
  titleSpacing,
}) => {
  const isTopBar = variant === 'topbar';
  const isHero = variant === 'hero';

  const resolvedTitleSpacing =
    titleSpacing !== undefined
      ? titleSpacing
      : showBackButton || leftIcon
      ? isTopBar
        ? wp(2.5)
        : wp(6)
      : 0;

  const renderLeft = () => {
    if (leftIcon) {
      return (
        <TouchableOpacity activeOpacity={0.8} onPress={onLeftPress}>
          {leftIcon}
        </TouchableOpacity>
      );
    }

    if (showBackButton) {
      return (
        <TouchableOpacity activeOpacity={0.8} onPress={onLeftPress}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={isTopBar ? hp(2.4) : hp(2.5)}
            color={palette.orange}
          />
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderRight = () => {
    if (showCoinPill) {
      return <CoinPill />;
    }

    if (rightIcon) {
      return (
        <TouchableOpacity activeOpacity={0.8} onPress={onRightPress}>
          {rightIcon}
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View
      style={[
        styles.base,
        isTopBar && styles.topbar,
        isHero && styles.hero,
        !isTopBar && !isHero && styles.screen,
        containerStyle,
      ]}
    >
      <View style={[styles.leftWrap, leftWrapStyle]}>
        {renderLeft()}
        <View style={{ marginLeft: resolvedTitleSpacing, flexShrink: 1 }}>
          <Label
            style={[
              styles.title,
              isTopBar && styles.topbarTitle,
              isHero && styles.heroTitle,
              titleStyle,
            ]}
          >
            {title}
          </Label>
          {subtitle ? (
            <Label
              style={[styles.subtitle, isHero && styles.heroSubtitle, subtitleStyle]}
            >
              {subtitle}
            </Label>
          ) : null}
        </View>
      </View>
      {renderRight()}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screen: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: hp(3),
  },
  topbar: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: hp(0.8),
    marginTop: hp(2),
  },
  hero: {
    alignItems: 'flex-start',
    marginBottom: hp(1.5),
  },
  leftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  title: {
    color: palette.textPrimary,
    fontSize: hp(2.6),
    fontFamily: FONT.bold,
  },
  topbarTitle: {
    fontSize: hp(2.4),
  },
  heroTitle: {
    fontSize: hp(3),
  },
  subtitle: {
    marginTop: hp(0.45),
    color: palette.textSecondary,
    fontSize: hp(1.7),
    fontFamily: FONT.medium,
  },
  heroSubtitle: {
    marginTop: hp(0.45),
  },
});

export default AppHeader;
