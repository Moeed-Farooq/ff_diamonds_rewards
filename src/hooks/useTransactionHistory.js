import { useEffect, useMemo, useState } from 'react';
import { subscribeToCurrentUserTransactions } from '../services/firebaseServices';
import { useCurrentUser } from './useUserSession';

const buildFallbackTitle = item => {
  const type = String(item?.type || 'reward').replace(/_/g, ' ');
  const formattedType = type
    .split(' ')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return item?.rewardSource || `${formattedType} Reward`;
};

const useTransactionHistory = () => {
  const { uid } = useCurrentUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToCurrentUserTransactions(
      nextTransactions => {
        setTransactions(Array.isArray(nextTransactions) ? nextTransactions : []);
        setLoading(false);
      },
      nextError => {
        setError(nextError);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [uid]);

  const preparedTransactions = useMemo(
    () =>
      transactions.map((item, index) => {
        const coins = Number(item?.coins || 0);
        const isDebit = coins < 0;

        return {
          ...item,
          displayTitle: item?.title || buildFallbackTitle(item),
          amountText: isDebit ? `${coins}` : `+${coins}`,
          isDebit,
          key: item?.id || `${item?.type || 'tx'}-${index}`,
        };
      }),
    [transactions],
  );

  return {
    transactions: preparedTransactions,
    loading,
    error,
  };
};

export default useTransactionHistory;
