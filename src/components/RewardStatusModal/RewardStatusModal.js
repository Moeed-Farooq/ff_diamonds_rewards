import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Label from '../../common/Label';
import { ScalePressable } from '../ui';
import { palette, radius, spacing } from '../../constants/theme';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';

const RewardStatusModal = ({
  visible,
  title,
  message,
  buttonLabel,
  onClose,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Label style={styles.modalTitle}>{title}</Label>
          <Label style={styles.modalText}>{message}</Label>
          <ScalePressable style={styles.modalButton} onPress={onClose}>
            <Label style={styles.modalButtonText}>{buttonLabel}</Label>
          </ScalePressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: palette.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.pageHorizontal,
  },
  modalCard: {
    width: '100%',
    backgroundColor: palette.pageBottom,
    borderRadius: hp(2),
    paddingVertical: hp(4),
    paddingHorizontal: wp(5),
    alignItems: 'center',
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: hp(3.1),
    fontFamily: FONT.semiBold,
  },
  modalText: {
    color: COLORS.white + HEX_OPACITY[83],
    fontSize: hp(2.1),
    marginBottom: hp(2),
    textAlign: 'center',
    fontFamily: FONT.medium,
  },
  modalButton: {
    marginTop: hp(1.3),
    backgroundColor: palette.green,
    borderRadius: radius.pill,
    paddingHorizontal: wp(7),
    paddingVertical: hp(0.8),
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: hp(2.1),
    fontFamily: FONT.semiBold,
  },
});

export default RewardStatusModal;