import React from 'react';
import { View } from 'react-native';
import Label from '../../common/Label';

const PolicySectionBlock = ({ title, description, bullets, styles }) => {
  return (
    <View style={styles.sectionWrap}>
      <Label style={styles.sectionTitle}>{title}</Label>
      {description ? <Label style={styles.sectionBody}>{description}</Label> : null}
      {bullets?.length
        ? bullets.map(item => (
            <Label key={item} style={styles.bulletText}>
              {item}
            </Label>
          ))
        : null}
    </View>
  );
};

export default PolicySectionBlock;
