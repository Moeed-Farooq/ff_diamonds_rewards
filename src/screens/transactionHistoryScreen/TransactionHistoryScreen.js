import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { AppScreen } from '../../components/ui';
import { en } from '../../languages';
import { hp, wp } from '../../enums/StyleGuide';
import { AppHeader } from '../../components';
import { spacing } from '../../constants/theme';
import { useTransactionHistory } from '../../hooks';
import TransactionCard from './components/TransactionCard';
import EmptyState from './components/EmptyState';
import LoadingState from './components/LoadingState';

const TransactionHistoryScreen = ({ navigation }) => {
  const { transactions, loading } = useTransactionHistory();

  const renderItem = useCallback(
    ({ item }) => <TransactionCard item={item} />,
    [],
  );

  const keyExtractor = useCallback(item => item.key, []);

  const itemSeparator = useCallback(() => <View style={styles.separator} />, []);

  return (
    <AppScreen>
      <AppHeader
        title={en.transactionHistory.screenTitle}
        showBackButton
        onLeftPress={() => navigation.goBack()}
        titleSpacing={wp(6)}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.listContent,
            transactions.length === 0 && styles.emptyContent,
          ]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={itemSeparator}
          ListEmptyComponent={EmptyState}
          initialNumToRender={8}
          windowSize={10}
          maxToRenderPerBatch={10}
          removeClippedSubviews
        />
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: hp(1.6),
    paddingBottom: hp(4.6),
  },
  emptyContent: {
    flexGrow: 1,
  },
  separator: {
    height: hp(1.35),
  },
});

export default TransactionHistoryScreen;
